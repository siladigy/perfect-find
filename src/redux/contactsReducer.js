import * as firebase from 'firebase';
import "firebase/storage";
import SimpleCrypto from "simple-crypto-js"

const SET_USERS = 'SET_USERS';

let initialState = {
    users: null
}  


const contactsReducer = (state = initialState, action) => {

    switch(action.type) {
        case SET_USERS:

            let arr = []

            action.data.forEach(item => {
                arr.push(item.data())
            });

            return {
                ...state,
                users: arr
            }
        default: 
            return state;
    }   

}


export const setUsers = (data) => ({ type: SET_USERS, data : data })


export const getAllUsers = () => {

    return (dispatch) => {
        const db = firebase.firestore();

        firebase.auth().onAuthStateChanged(async function(data) {
            if (data) {

            const users = db.collection('users');
            const data = await users.get();
            dispatch (setUsers(data))
            }
        })
    }
 }





export default contactsReducer;