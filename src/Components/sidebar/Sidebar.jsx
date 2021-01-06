import React, {useState, useEffect, useSelector, useDispatch} from 'react';
import './sidebar.scss'
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { authState, getUserData, signOut, updatePhoto } from '../../redux/authReducer'

import placeholder from './../../images/profile.png'
import profile from './../../images/profile.svg';
import messages from './../../images/messages.svg';
import dashboard from './../../images/dashboard.svg';
import contacts from './../../images/contacts.svg';
import logout from './../../images/logout.svg';

import Resizer from "react-image-file-resizer"


const Sidebar = React.memo((props) => {

    useEffect(() => {
        props.authState();
        props.getUserData();
    },[props.hasAccount]);

    const handleLogout = () => {
        props.signOut()
    }

    const handleChangeAvatar = (e) => {
        const file = e.target.files[0]
        const size = file.size/1024

        if (size > 300) {
            Resizer.imageFileResizer(
                file, // the file from input
                300, // width
                300, // height
                "JPEG", // compress format WEBP, JPEG, PNG
                70, // quality
                0, // rotation
                (uri) => {
                    props.updatePhoto(uri)
                },
                'blob')
        } else {
            props.updatePhoto(file)
        }
    }

    return (
        <div className="sidebar_wrapper">

                <div className="sidebar_inner">
                <div className="sidebar_logo">
                    Your. Perfect. Find.
                </div>

                {props.hasAccount ? 
                <div className="sidebar_profile">
                {props.uploadProgress ? 
                <div className="loader">
                    <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div> : null}
                <img src={props.photoUrl ? props.photoUrl : placeholder} />
                <label htmlFor="avatar" className="change_profile">+</label>
                <input id="avatar" type="file" accept="image/*" onChange={handleChangeAvatar} />
                </div>
                :<div className="sidebar_auth">
                    <NavLink to='/login'>Login</NavLink>
                    <NavLink to='/register'>Register</NavLink>
                </div>}
                
               
                <div className="sidebar_linklist">
                    <NavLink exact to="/" activeClassName="active" className="btn"><img src={dashboard} /> Dashboard</NavLink>
                    <NavLink to="/messages" activeClassName="active" className="btn"><img src={messages} /> Messages</NavLink>
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