import React, {useState, useEffect, useSelector, useDispatch} from 'react';
import './sidebar.scss'
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import {authState, signOut, updatePhoto, getUserData} from '../../redux/authReducer'

import profile from './../../images/profile.png' 
import edit from './../../images/edit.svg'
import mail from './../../images/mail.svg'

import Resizer from "react-image-file-resizer"

const Sidebar = React.memo((props) => {

    
    // const [user, setUser] = useState(props.hasAccount)
    // const [photo, setPhoto] = useState(null)
    // const [img, setImg] = useState(null)


    // let shdf = useSelector<ahjsd, jdhbf>(state => state.auth);
    // let ispatch = useDispatch()

    useEffect(() => {
        props.authState();
        props.getUserData();
    },[props.hasAccount]);

    const handleLogOut = () => {
        props.signOut()
    }

    const imgUpload = (e) => {
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
        <div className="header-wrapper">
            <div className="container">
                <div className="flexbox space-between v-center">
                    {props.hasAccount ? 
                    <div className="header-account">
                        <div className="header-avatar">
                        {props.photoUrl? 
                        <img src={props.photoUrl} alt=""/>:
                        <>
                        <img src={profile} alt=""/>
                        </>
                        }
                        <label htmlFor="avatar">
                            <img src={edit} />
                        </label>
                        <input id="avatar" type="file" accept="image/*" onChange={imgUpload} />
                        </div>
                        <div className="mail">
                           <NavLink to='/messages'><img src={mail} alt=""/></NavLink> 
                        </div>
                        <div className="header-account-account">
                            <div className="header-account__title">My account</div>
                            <div className="header-account__dropdown">
                                <ul>
                                    <li onClick={handleLogOut}>Logout</li>
                                </ul>
                            </div> 
                        </div>
                        {/* <button onClick={handleLogOut}>
                            logout
                        </button> */}
                        <div>
                        <NavLink to="/add-project" className="btn add_new_project"><span>+</span> Add a New Project</NavLink>
                        </div>
                    </div>:
                    <div className="auth">
                    <span className="login">
                        <NavLink to="/login" className="btn btn-secondary-o">Log in</NavLink>
                    </span> 
                    <span className="register">
                        <NavLink to="/register" className="btn btn-secondary">Join</NavLink>
                    </span>

                    </div>}
                   
                </div>
            </div>

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
})(Sidebar);