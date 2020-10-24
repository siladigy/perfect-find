import * as firebase from 'firebase';
import "firebase/storage";

const SET_USER = 'SET_USER';



let initialState = {

}  


const addProjectReducer = (state = initialState, action) => {

    switch(action.type) {
        case SET_USER:
            return {
                ...state,
                hasAccount: action.data
            }
        default: 
            return state;
    }   

}


export const setUser = (bool) => ({ type: SET_USER, data : bool })

export const addProject = (title, description, price, currency) => {
    
    return (dispatch) => {

        const user = firebase.auth().currentUser;
        const db = firebase.firestore();

        db.collection("projects").doc().set({
            author: user.uid,
            title: title,
            description: description,
            price: price,
            currency: currency,
            createdAt: - new Date().getTime(),
            proposals: {},
            searchQueries: title.split(' ')
        }).then(() => {
            console.log('success')
        })
          
    }
}




export default addProjectReducer;