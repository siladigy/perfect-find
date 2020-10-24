import * as firebase from 'firebase';
import "firebase/storage";

const SET_PROJECT_DATA = 'SET_PROJECT_DATA';
const SET_PROJECT_AUTHOR = 'SET_PROJECT_AUTHOR';
const HANDLE_PROPOSAL = 'HANDLE_PROPOSAL';


let initialState = {
    projectData: {},
    projectAuthor: null,
    projectAuthorId: null,
    handleProposal: null
}  


const projectDetailReducer = (state = initialState, action) => {

    switch(action.type) {
        case SET_PROJECT_DATA:
            return {
                ...state,
                projectData: action.data
            }
        case SET_PROJECT_AUTHOR:
            return {
                ...state,
                projectAuthor: action.data,
                projectAuthorId: action.id
            }
        case HANDLE_PROPOSAL:
            
            return {
                ...state,
                handleProposal: action.data
            }
        default: 
            return state;
    }   

}


export const setProjectData = (data) => ({ type: SET_PROJECT_DATA, data : data })
export const setProjectAuthor = (data, id) => ({ type: SET_PROJECT_AUTHOR, data : data, id: id })
export const handleProposal = (id) => ({ type: HANDLE_PROPOSAL, data : id })

export const getProjectDetails = (id) => {

    return async (dispatch) => {

        dispatch (setProjectData(null))
        dispatch (setProjectAuthor(null))

        const db = firebase.firestore();

        const project = db.collection('projects').doc(id);
        const doc = await project.get();
        const user = db.collection('users').doc(doc.data().author);
        const author = await user.get();

        dispatch (setProjectData(doc.data()))
        dispatch (setProjectAuthor(author.data(), user.id))
    }
 }


export const submitProposal = (projectId, text) => {

    return async (dispatch) => {
        const db = firebase.firestore();
        const user = firebase.auth().currentUser;

        const props = db.collection('projects').doc(projectId);
        const doc = (await props.get()).data().proposals;
        var proposal = {...doc, ...({[user.uid]: text})}

       db.collection('projects').doc(projectId).update({
           proposals: proposal
       })
    }

}

export const sendMessage = (userId, projectId, proposalText) => {
    
    return async (dispatch) => {
    
        const db = firebase.firestore();

        const data = db.collection("users").doc(userId)
        const userData = await data.get()

        firebase.auth().onAuthStateChanged(function(data) {
            if (data) {
                const user = firebase.auth().currentUser 
                var doc = db.collection("messages").doc()
                doc.set({
                    users: [user.uid, userId],
                    interlocutor: userId,
                    firstName: userData.data().firstName,
                    lastName: userData.data().lastName,
                    img: userData.data().avatar || null,
                    projectId: projectId,
                    dialog: {}
                }).then(() => {
                    console.log('chat created')
                    db.collection('messages').doc(doc.id).collection('dialog').doc().set({
                        id: userId,
                        firstName: userData.data().firstName,
                        lastName: userData.data().lastName,
                        img: userData.data().avatar || null,
                        text: proposalText,
                        createdAt: new Date().getTime()
                    }).then(() => {
                        console.log('proposal added')
                        dispatch (handleProposal(doc.id))
                    });
                })
            }
        })
          
    }

}

export default projectDetailReducer;