import * as firebase from 'firebase';
import "firebase/storage";

const SET_DIALOGS = 'SET_DIALOGS';
const SET_DIALOG_DATA = 'SET_DIALOG_DATA';


let initialState = {
    dialogsList: {},
    dialogData: {},
}  


const messages = (state = initialState, action) => {

    switch(action.type) {
        case SET_DIALOGS:

            var obj = {}

            action.data.forEach(doc => {
                Object.assign(obj, ({[doc.id]: doc.data()}));
            });
              

            return {
                ...state,
                dialogsList: {...obj}
            }
        case SET_DIALOG_DATA:

            var obj = {}

            action.data.forEach(doc => {
                Object.assign(obj, ({[doc.id]: doc.data()}));
            });
              

            return {
                ...state,
                dialogData: {...obj}
            }
        default: 
            return state;
    }   

}


export const setDialogs = (data) => ({ type: SET_DIALOGS, data : data })
export const setDialogData = (data) => ({ type: SET_DIALOG_DATA, data : data })

export const getDialogs = () => {

    return (dispatch) => {

        const db = firebase.firestore();
        firebase.auth().onAuthStateChanged(function(data) {
            if (data) {
                const user = firebase.auth().currentUser 

                const query = db.collection('messages').where('users', 'array-contains', `${user.uid}`);

                const observer = query.onSnapshot(data => {

                dispatch (setDialogs(data))

                console.log('new project')

                }, err => {
                console.log(`Encountered error: ${err}`);
                });
            }
        });
        
    }
}


export const getDialogData = (id) => {

    return (dispatch) => {
        const db = firebase.firestore();
        const query = db.collection('messages').doc(id).collection('dialog').orderBy('createdAt');

        const observer = query.onSnapshot(data => {

        dispatch (setDialogData(data))

        }, err => {
        console.log(`Encountered error: ${err}`);
        });
    }
    
}


export const sendMessage = (dialogId, text) => {

    return (dispatch) => {
        const db = firebase.firestore();

        firebase.auth().onAuthStateChanged(async function(data) {
            if (data) {
                const user = firebase.auth().currentUser 
                const data = db.collection("users").doc(user.uid)
                const userData = await data.get()

                db.collection('messages').doc(dialogId).collection('dialog').doc().set({
                    id: user.uid,
                    firstName: userData.data().firstName,
                    lastName: userData.data().lastName,
                    img: userData.data().avatar || null,
                    text: text,
                    createdAt: new Date().getTime()
                }).then(() => {
                    console.log('message added')
                });

            }
        });
        

    }
}

export default messages;