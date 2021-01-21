import * as firebase from 'firebase';
import "firebase/storage";
import SimpleCrypto from "simple-crypto-js"

const SET_DIALOGS = 'SET_DIALOGS';
const SET_DIALOG_DATA = 'SET_DIALOG_DATA';
const APPEND_DIALOG_DATA = 'APPEND_DIALOG_DATA';
const SET_UPLOAD_PROGRESS = 'SET_UPLOAD_PROGRESS';


const _ = require('lodash')


let initialState = {
    dialogsList: [],
    firstDialogId: null,
    dialogData: null,
    uploadProgress: null
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
                dialogsList: _.sortBy(arr, ['lastUpdate']).reverse(),
                firstDialogId: ((_.sortBy(arr, ['lastUpdate']).reverse())[0]).messageId
            }
        case SET_DIALOG_DATA:

            var arr = []


            if (action.data) {
                action.data.forEach(doc => {
                    arr.push(doc.data())
                    // Object.assign(obj, ({[doc.id]: doc.data()}));
                });
            } else {
                arr = null
            }


            return {
                ...state,
                dialogData: arr ? arr.reverse() : arr
            }
        case APPEND_DIALOG_DATA:

            var arr = [...state.dialogData]

            if (action.data) {
                action.data.forEach(doc => {
                    arr.push(doc.data())
                });
            } else {
                arr = null
            }


            return {
                ...state,
                dialogData: arr
            }
        case SET_UPLOAD_PROGRESS:
            return {
                ...state,
                uploadProgress: action.data === 100 ? null : action.data
            }
        default: 
            return state;
    }   

}


export const setDialogs = (data) => ({ type: SET_DIALOGS, data : data })
export const setDialogData = (data) => ({ type: SET_DIALOG_DATA, data : data })
export const appendDialogData = (data) => ({ type: APPEND_DIALOG_DATA, data : data })
export const setUploadProgress = (data) => ({ type: SET_UPLOAD_PROGRESS, data : data })

var stopDialogsListListener;

export const getDialogs = () => {

    return (dispatch) => {

        const db = firebase.firestore();
        firebase.auth().onAuthStateChanged(function(data) {
            if (data) {
                const user = firebase.auth().currentUser 
                
                const query = db.collection('messages').where('users', 'array-contains', `${user.uid}`);

                query.onSnapshot(data => {

                dispatch (setDialogs(data))

                }, err => {
                console.log(`Encountered error: ${err}`);
                });
            }
        });
        
    }
}

export const stopDialogsList = () => {

    return (dispatch) => {
        if(stopDialogsListListener){
            stopDialogsListListener()
            
            console.log('stop dialogs list listener')
        }  
    }
}

var stopDialogDataListener;

export const getDialogData = (id) => {

    return (dispatch) => {
        const db = firebase.firestore();
        firebase.auth().onAuthStateChanged(async function(data) {
            if (data) {

                const user = firebase.auth().currentUser 

                const checkQuery = db.collection('messages').doc(id)

                // const dialogData = checkQuery.collection('dialog').orderBy("createdAt")
                // const initData = await dialogData.get()

                const checkQueryData = await checkQuery.get()

                // dispatch (setDialogData(initData.docs))

                const query = db.collection('messages').doc(id).collection('dialog').orderBy("createdAt", "desc").limit(20);

                if (checkQueryData.data().users.includes(user.uid)) {
                    stopDialogDataListener = query.onSnapshot(data => {
            
                        // dispatch (appendDialogData(data))
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
            dispatch (setDialogData(null))
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

export const sendMessage = (dialogId, text, type) => {

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

                var msg = typeof(text) === 'string' ? text : typeof(text) !== 'string' && type === 'images' ? 'sent images' : typeof(text) !== 'string' && type === 'docs' ? 'sent files' : null

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
                    images: typeof(text) !== 'string' && type !== 'docs' ? text : null,
                    files: typeof(text) !== 'string' && type !== 'images' ? text : null,
                    createdAt: lastUpdate,
                    viewed: false
                }).then(() => {
                    console.log('message added')
                });

            }
        });
    }
}

export const onUploadSubmission = (dialogId, files, type) => {

    return (dispatch) => {

        const promises = [];
        const fileURL = [];

        var uploadProgress = []

        files.forEach((file, i) => {
            
         const uploadTask = firebase.storage().ref().child(`messages/${file.name}`).put(file);
            promises.push(uploadTask);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
            
                const progress = (100 * snapshot.bytesTransferred / snapshot.totalBytes) ;
                   if (snapshot.state === firebase.storage.TaskState.RUNNING) {
                    uploadProgress[i] = progress
                    
                    var total = uploadProgress.reduce(function(a,b) {
                        return (+a)+(+b);
                    });

                    dispatch(setUploadProgress(total / files.length))
                   }
                 },
                 error => console.log(error.code),
                 async () => {
                   const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                   if(type === 'docs'){
                    fileURL.push({[file.name]: downloadURL})
                   }else {
                    fileURL.push(downloadURL)
                   }
                   
                  }
                 );
               });
           Promise.all(promises)
            .then(() => {
                console.log('All files uploaded')
                console.log(typeof(fileURL), fileURL)
                dispatch (sendMessage(dialogId, fileURL, type))
            })
            .catch(err => console.log(err.code));
    }
      
}

export default messages;