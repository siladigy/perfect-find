import * as firebase from 'firebase';
import "firebase/storage";

const SET_USER = 'SET_USER';
const USER_NAME = 'USER_NAME';
const USER_PHOTO = 'USER_PHOTO';
const USER_ID = 'USER_ID';
const CATCH_ERROR = 'CATCH_ERROR';
const UPLOAD_PROGRESS = 'UPLOAD_PROGRESS';

const localData = JSON.parse(localStorage.getItem('localData'))


let initialState = {
    error: null,
    emailError: null,
    passwordError: null,
    hasAccount: false,
    name: '',
    photoUrl: '',
    id: null,
    avatarUploadProgress: false
}  


const authReducer = (state = initialState, action) => {

    switch(action.type) {
        case SET_USER:
            return {
                ...state,
                hasAccount: action.data
            }
        case USER_NAME:
            return {
                ...state,
                name: action.name + " " + action.surname
            }
        case USER_PHOTO:
            return {
                ...state,
                photoUrl: action.data
            }
        case USER_ID:
            return {
                ...state,
                id: action.data
            }
        case CATCH_ERROR:
            var emailErr = action.code.includes('email') ? action.message : null
            var passErr = action.code.includes('password') ? action.message : null
            var err = action.code.includes('password') ? null : action.code.includes('email') ? null : action.message
            return {
                ...state,
                emailError: emailErr,
                passwordError: passErr,
                error : err
            }
        case UPLOAD_PROGRESS:
            return {
                ...state,
                avatarUploadProgress: action.bool
            }
        default: 
            return state;
    }   

}


export const setUser = (bool) => ({ type: SET_USER, data : bool })
export const userName = (name, surname) => ({ type: USER_NAME, name, surname })
export const userPhoto = (url) => ({ type: USER_PHOTO, data : url })
export const userId = (id) => ({ type: USER_ID, data : id })
export const catchError = (errCode, errMessage) => ({ type: CATCH_ERROR, code : errCode, message: errMessage })

export const avatarUploadProgress = (bool) => ({type: UPLOAD_PROGRESS, bool: bool})

export const register = (email, password, firstName, lastName) => {
    
    return (dispatch) => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function() {
            const user = firebase.auth().currentUser;
            const db = firebase.firestore();

            db.collection("users").doc(user.uid).set({
                firstName: firstName,
                lastName: lastName,
                peerId: null
            })

            var profileData = {
                'avatar': null,
                'firstName': firstName,
                'lastName': lastName
            }

            localStorage.setItem('localData', JSON.stringify(profileData));
        })
        .catch(function(error) {

            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage)
            dispatch(catchError(errorCode, errorMessage))
     
        });
          
    }
}

export const login = (email, password) => {
    
    return (dispatch) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(async function() {
            const user = firebase.auth().currentUser;
            const db = firebase.firestore();

            const users = db.collection("users").doc(user.uid)
            const data = await users.get()

            var profileData = {
                'avatar': data.data().avatar,
                'firstName': data.data().firstName,
                'lastName': data.data().lastName
            }

            localStorage.setItem('localData', JSON.stringify(profileData));

        }).catch(function(error) {

            var errorCode = error.code;
            var errorMessage = error.message;
            dispatch(catchError(errorCode, errorMessage))
            
        });
          
    }
}

export const authState = () => {

    return (dispatch) => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              dispatch (setUser(true))
              dispatch (userId(user.uid))
            } else {
                dispatch (setUser(false))
            }
          });
    }
}

export const signOut = () => {
    
    return (dispatch) => {
        firebase.auth().signOut().then(function() {
            dispatch (setUser(false))
          }).catch(function(error) {
            // An error happened.
          });
          
    }
}


export const updatePhoto = (file) => {
    
    return async (dispatch) => {
        const user = firebase.auth().currentUser;
        const db = firebase.firestore();

        dispatch (avatarUploadProgress(true))

        var successUpdate = async () => {
            dispatch (avatarUploadProgress(false))

            const users = db.collection("users").doc(user.uid)
            const data = await users.get()

            localData.avatar = data.data().avatar
            localStorage.setItem('localData', JSON.stringify(localData));
        }

        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(`avatars/${user.uid}`)
        await fileRef.put(file)

        var imgUrl = await fileRef.getDownloadURL()

        var usersRef = db.collection('users').doc(user.uid)
        usersRef.get().then((docSnapshot) => {
        
        dispatch(userPhoto(imgUrl)) 

        if (docSnapshot.exists) {
            usersRef.update({
                avatar: imgUrl
            }).then(() => {
                successUpdate()
            })
        } else {
            usersRef.set({
                avatar: imgUrl
            }).then(() => {
                successUpdate()
            })
        }
              
        });

    }
}

export const getUserData = () => {
    return async (dispatch) => {
        if (localData) {
            dispatch (userPhoto(localData.avatar))
        } else {
            dispatch (getUserDataFromServer())
        }
    }
}

export const getUserDataFromServer = () => {
    console.log('server request')
    return async (dispatch) => {
        var user = firebase.auth().currentUser;
        const db = firebase.firestore();

        if(user) {
            const users = db.collection("users").doc(user.uid)
            const data = await users.get()

            dispatch (userPhoto(data.data().avatar))
            dispatch (userName(data.data().firstName, data.data().lastName))
        }
    }
}



export default authReducer;