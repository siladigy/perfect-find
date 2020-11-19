import React, {useState, useEffect, useSelector, useDispatch} from 'react';
import './sidebar.scss'
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { authState, getUserData } from '../../redux/authReducer'

import placeholder from './../../images/profile.png'
import profile from './../../images/profile.svg';
import messages from './../../images/messages.svg';
import dashboard from './../../images/dashboard.svg';
import contacts from './../../images/contacts.svg';


const Sidebar = React.memo((props) => {

    useEffect(() => {
        props.authState();
        props.getUserData();
    },[props.hasAccount]);

    return (
        <div className="sidebar_wrapper">

                <div className="sidebar_inner">
                <div className="sidebar_logo">
                    Your. Perfect. Find.
                </div>

                <div className="sidebar_profile">
                    <img src={props.photoUrl ? props.photoUrl : placeholder} />
                    {/* <span className="profile_name">{props.name}</span> */}
                </div>
               
                <div className="sidebar_linklist">
                    <NavLink exact to="/" activeClassName="active" className="btn"><img src={dashboard} /> Dashboard</NavLink>
                    <NavLink to="/messages" activeClassName="active" className="btn"><img src={messages} /> Messages</NavLink>
                    <NavLink to="/contacts" activeClassName="active" className="btn"><img src={contacts} /> Contacts</NavLink>
                    <NavLink to="/profile" activeClassName="active" className="btn"><img src={profile} /> Profile</NavLink>
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
    getUserData
})(Sidebar);