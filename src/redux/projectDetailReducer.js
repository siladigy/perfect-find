import * as firebase from 'firebase';
import "firebase/storage";
import SimpleCrypto from "simple-crypto-js"

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
    
    return (dispatch) => {
    
        const db = firebase.firestore();

        firebase.auth().onAuthStateChanged(async function(data) {
            if (data) {

                const user = firebase.auth().currentUser 
                var doc = db.collection("messages").doc()

                const interlocutor = db.collection("users").doc(userId)
                const interlocutorData = await interlocutor.get()

                const author = db.collection("users").doc(user.uid)
                const authorData = await author.get()

                var lastUpdate = new Date().getTime()
                var simpleCrypto = new SimpleCrypto(lastUpdate);

                doc.set({
                    users: [user.uid, userId],
                    interlocutor: {
                        id: userId,
                        firstName: interlocutorData.data().firstName,
                        lastName: interlocutorData.data().lastName,
                        img: interlocutorData.data().avatar || null
                    },
                    author: {
                        id: user.uid,
                        firstName: authorData.data().firstName,
                        lastName: authorData.data().lastName,
                        img: authorData.data().avatar || null
                    },
                    checkView: user.uid,
                    unreadCounter: null,
                    messageId: doc.id,
                    lastMessage: simpleCrypto.encrypt(proposalText),
                    lastUpdate: lastUpdate,
                    lastMessageAuthor: userId,
                    projectId: projectId
                }).then(() => {
                    console.log('chat created')
                    db.collection('messages').doc(doc.id).collection('dialog').doc().set({
                        id: userId,
                        firstName: interlocutorData.data().firstName,
                        lastName: interlocutorData.data().lastName,
                        img: interlocutorData.data().avatar || null,
                        text: simpleCrypto.encrypt(proposalText),
                        createdAt: lastUpdate,
                        viewed: false
                    }).then(() => {
                        console.log('proposal added')
                        dispatch (handleProposal(doc.id))
                    });
                }).catch(function(error) {
                    console.log(error)
                });
            }
        })
          
    }

}

export default projectDetailReducer;