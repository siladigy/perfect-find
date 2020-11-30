import React, {useState, useEffect, useSelector, useDispatch} from 'react';
import { connect } from 'react-redux';
import { getAllUsers } from './../../redux/contactsReducer'

import './contacts.scss'

const Contacts = React.memo((props) => {

    useEffect(() => {
        props.getAllUsers();
    },[]);

    return (
        <div className="contacts">
            {props.users ? <div className="users_wrap">
                {props.users.map(item => <div className="user_block">
                    {item.avatar ? <img src={item.avatar} /> : 
                    <div className='user_initials'>{item.firstName.charAt(0)}{item.lastName.charAt(0)}</div>}
                    <div className="user_name">
                    {item.firstName}&nbsp;
                    {item.lastName}
                    <div className="user_message">
                        <button>Message</button>
                    </div>
                    </div>
                    
                </div>)}
            </div>: null}
        </div>
    )
})



let mapStateToProps = (state) => {
    return {
        users: state.contacts.users
    }
}

export default connect(mapStateToProps, {
    getAllUsers
})(Contacts);