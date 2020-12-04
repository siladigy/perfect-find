import { createStore, combineReducers, applyMiddleware } from "redux";
import authReducer from './authReducer';
import addProjectReducer from './addProjectReducer';
import allProjectsReducer from './allProjectsReducer';
import projectDetailReducer from './projectDetailReducer';
import messagesReducer from './messagesReducer';
import contactsReducer from './contactsReducer';
import phoneCallReducer from './phoneCallReducer';
import thunkMiddleware from "redux-thunk";

 
let reducers  = combineReducers({
    auth: authReducer,
    addProject: addProjectReducer,
    allProjects: allProjectsReducer,
    projectDetail: projectDetailReducer,
    messages: messagesReducer,
    contacts: contactsReducer,
    phoneCall: phoneCallReducer
});

let store = createStore(reducers, applyMiddleware(thunkMiddleware));

window.store = store; 

export default store;