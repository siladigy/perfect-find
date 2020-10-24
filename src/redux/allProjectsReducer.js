import * as firebase from 'firebase';
import "firebase/storage";

const SET_SIZE = 'SET_SIZE';
const SET_PROJECTS = 'SET_PROJECTS';
const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS';
const GET_LAST_ITEM = 'GET_LAST_ITEM';


let initialState = {
    size: null,
    projects: {},
    lastItemId: null
}  


const allProjectsReducer = (state = initialState, action) => {

    switch(action.type) {
        case SET_SIZE:

            return {
                ...state,
                size: action.data
            }
        case SET_PROJECTS:

            var obj = {}

            action.data.forEach(doc => {
                Object.assign(obj, ({[doc.id]: doc.data()}));
            });
              

            return {
                ...state,
                projects: {...state.projects, ...obj}
            }
        case SET_SEARCH_RESULTS:

            var obj = {}

            action.data.forEach(doc => {
                Object.assign(obj, ({[doc.id]: doc.data()}));
            });
              

            return {
                ...state,
                projects: obj
            }
        case GET_LAST_ITEM:

            var id = action.data.length !== 0 ? action.data[action.data.length - 1].id : null

            return {
                ...state,
                lastItemId: id
            }
        default: 
            return state;
    }   

}


export const setSize = (data) => ({ type: SET_SIZE, data : data })
export const setProjects = (obj) => ({ type: SET_PROJECTS, data : obj })
export const setSearchResults = (obj) => ({ type: SET_SEARCH_RESULTS, data : obj })
export const getLastItem = (arr) => ({ type: GET_LAST_ITEM, data : arr })

export const getProjectsCount = () => {
    return async (dispatch) => {
        const db = firebase.firestore();

        db.collection('projects').get().then(snap => {
            dispatch (setSize(snap.size))
        });
    }
 }

export const getSearchResults = (query) => {
    return async (dispatch) => {
        const db = firebase.firestore();

        const projects = db.collection('projects').where('searchQueries', 'array-contains-any', [`${query}`]);
        const data = await projects.get();
        dispatch (setSize(data.docs.length))
        dispatch (setSearchResults(data))
    }
}

export const getAllProjects = () => {
    return async (dispatch) => {
        const db = firebase.firestore();

        const projects = db.collection('projects').orderBy('createdAt').limit(3);
        const data = await projects.get();
        dispatch (getLastItem(data.docs))
        dispatch (setProjects(data))
        dispatch (getProjectsCount())
    }
}

export const loadMoreProjects = (id) => {

    return async (dispatch) => {
        const db = firebase.firestore();

        const project = db.collection('projects').doc(id);
        const doc = await project.get();

        const last = await doc.data().createdAt

        const projects = db.collection('projects').orderBy('createdAt').startAfter(last).limit(3);
        const data = await projects.get();

        dispatch (getLastItem(data.docs))
        dispatch (setProjects(data))
    }
 }





export default allProjectsReducer;