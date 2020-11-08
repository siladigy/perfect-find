import * as firebase from 'firebase';
import "firebase/storage";
import SimpleCrypto from "simple-crypto-js"

const SET_DIALOGS = 'SET_DIALOGS';
const SET_DIALOG_DATA = 'SET_DIALOG_DATA';


const _ = require('lodash')


let initialState = {
    dialogsList: [],
    dialogData: null
}  


const messages = (state = initialState, action) => {

    switch(action.type) {
        case SET_DIALOGS:

            var arr = []

            action.data.forEach(doc => {
                arr.push(doc.data());
            });
              
            return {
                ...state,
                dialogsList: _.sortBy(arr, ['lastUpdate']).reverse()
            }
        case SET_DIALOG_DATA:

            var arr = []

            action.data.forEach(doc => {
                arr.push(doc.data())
                // Object.assign(obj, ({[doc.id]: doc.data()}));
            });
              

            return {
                ...state,
                dialogData: arr
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

                }, err => {
                console.log(`Encountered error: ${err}`);
                });
            }
        });
        
    }
}

var stopDialogDataListener;

export const getDialogData = (id) => {
    console.log('get dialog data')

    return (dispatch) => {
        const db = firebase.firestore();
        firebase.auth().onAuthStateChanged(async function(data) {
            if (data) {

                const user = firebase.auth().currentUser 

                const checkQuery = db.collection('messages').doc(id)
                const checkQueryData = await checkQuery.get()

                const query = db.collection('messages').doc(id).collection('dialog').orderBy('createdAt');

                if (checkQueryData.data().users.includes(user.uid)) {
                    stopDialogDataListener = query.onSnapshot(data => {
                        console.log(id)
            
                        dispatch (setDialogData(data))
            
                    }, err => {
                    console.log(`Encountered error: ${err}`);
                    });
                } 
            }
        });
    }

}

export const stopPreviousData = () => {

    return (dispatch) => {
        if(stopDialogDataListener){
            stopDialogDataListener()
            console.log('stop listener')
        }  
    }
}

export const checkView = (id) => {

    return (dispatch) => {
        const db = firebase.firestore();

        firebase.auth().onAuthStateChanged(async function(data) {
            if (data) {

                const user = firebase.auth().currentUser 
                
                const unread = db.collection("messages").doc(id)
                const view = await unread.get()
                
                if (view.data().checkView && view.data().checkView !== user.uid) {
                    unread.update({
                        checkView: null
                    }).then(() => {
                        console.log('dialog viewed')
                    })
                } 
              
            }
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

                const dialog = db.collection('messages').doc(dialogId)
                const dialogData = await dialog.get()

                var lastUpdate = new Date().getTime()
                var simpleCrypto = new SimpleCrypto(lastUpdate);

                var counter = null;

                if(dialogData.data().checkView === user.uid){
                    counter = dialogData.data().unreadCounter + 1
                } else {
                    counter = 1
                }

                var msg = typeof(text) === 'string' ? text : 'sent images'

                dialog.update({
                    lastMessage: simpleCrypto.encrypt(msg),
                    lastMessageAuthor: user.uid,
                    lastUpdate: lastUpdate,
                    checkView: user.uid,
                    unreadCounter: counter
                }).then(() => {
                    console.log('dialog data updated')
                })

                db.collection('messages').doc(dialogId).collection('dialog').doc().set({
                    id: user.uid,
                    firstName: userData.data().firstName,
                    lastName: userData.data().lastName,
                    img: userData.data().avatar || null,
                    text: typeof(text) === 'string' ? simpleCrypto.encrypt(text) : null,
                    images: typeof(text) !== 'string' ? text : null,
                    createdAt: lastUpdate,
                    viewed: false
                }).then(() => {
                    console.log('message added')
                });

            }
        });
    }
}

export const onUploadSubmission = (dialogId, files) => {

    return (dispatch) => {

        const promises = [];
        const fileURL = [];

        files.forEach(file => {

         const uploadTask = firebase.storage().ref().child(`messages/${file.name}`).put(file);
            promises.push(uploadTask);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
            
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                   if (snapshot.state === firebase.storage.TaskState.RUNNING) {
                    console.log(`Progress: ${progress}%`);
                   }
                 },
                 error => console.log(error.code),
                 async () => {
                   const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                   fileURL.push(downloadURL)
                  }
                 );
               });
           Promise.all(promises)
            .then(() => {
                console.log('All files uploaded')
                console.log(typeof(fileURL), fileURL)
                dispatch (sendMessage(dialogId, fileURL))
            })
            .catch(err => console.log(err.code));
    }
      
}

export default messages;