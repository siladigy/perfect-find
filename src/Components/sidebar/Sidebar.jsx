import React, {useState, useEffect, useSelector, useDispatch} from 'react';
import './sidebar.scss'
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { authState, getUserData, signOut, updatePhoto } from '../../redux/authReducer'

import profile from './../../images/profile.svg';
import messages from './../../images/messages.svg';
import dashboard from './../../images/dashboard.svg';
import contacts from './../../images/contacts.svg';
import logout from './../../images/logout.svg';


const Sidebar = React.memo((props) => {

    
    const handleLogout = () => {
        props.signOut()
    }

    return (
        <div className="sidebar_wrapper">

                <div className="sidebar_inner">
   
                <div className="sidebar_linklist">
                    <NavLink exact to="/" activeClassName="active" className="btn"><img src={dashboard} /> Dashboard</NavLink>
                    <div className="sublinks">
                    <NavLink exact to="/add-project" activeClassName="active" className="btn new_project">Add Job</NavLink>
                    <NavLink exact to="/jobs" activeClassName="active" className="btn sub_link">Find Job</NavLink>
                    <NavLink exact to="/freelancers" activeClassName="active" className="btn sub_link">Find Freelancer</NavLink>
                    </div>
                    <NavLink to="/message" activeClassName="active" className="btn"><img src={messages} /> Messages</NavLink>
                    <NavLink to="/contacts" activeClassName="active" className="btn"><img src={contacts} /> Contacts</NavLink>
                    <NavLink to="/profile" activeClassName="active" className="btn"><img src={profile} /> Profile</NavLink>
                </div>

                <div className="sidebar_logout">
                    <button onClick={handleLogout}><img src={logout} /> Logout</button>
                </div>
                </div>
                
        </div>
    )
})

let mapStateToProps = (state) => {
    return {
        hasAccount: state.auth.hasAccount,
        name: state.auth.name,
        photoUrl: state.auth.photoUrl,
        uploadProgress: state.auth.avatarUploadProgress
    }
}


export default connect(mapStateToProps, {
    authState,
    getUserData,
    signOut,
    updatePhoto
})(Sidebar);