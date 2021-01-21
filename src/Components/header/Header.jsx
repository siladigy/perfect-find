import React, {useState, useEffect, useSelector, useDispatch} from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import {authState, signOut, updatePhoto, getUserData} from '../../redux/authReducer'
import placeholder from './../../images/profile.png'
import './header.scss'

import Resizer from "react-image-file-resizer"

const Header = React.memo((props) => {

    useEffect(() => {
        props.authState();
        props.getUserData();
    },[props.hasAccount]);

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
        <div className="header_wrapper">
                <div className="header_logo">
                    Your. Perfect. Find.
                </div>

                {props.hasAccount ? 
                <div className="header_profile">
                {props.uploadProgress ? 
                <div className="loader">
                    <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div> : null}
                <img src={props.photoUrl ? props.photoUrl : placeholder} />
                <label htmlFor="avatar" className="change_profile">+</label>
                <input id="avatar" type="file" accept="image/*" onChange={handleChangeAvatar} />
                </div>
                :<div className="header_auth">
                    <NavLink to='/login'>Login</NavLink>
                    <NavLink to='/register'>Register</NavLink>
                </div>}            

        </div>
    )
})

let mapStateToProps = (state) => {
    return {
        hasAccount: state.auth.hasAccount,
        name: state.auth.name,
        photoUrl: state.auth.photoUrl
    }
}


export default connect(mapStateToProps, {
    authState,
    signOut,
    updatePhoto,
    getUserData
})(Header);