import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { getDialogs } from '../../redux/messagesReducer'

const Messages = (props) => {


    useEffect(() => {
        props.getDialogs();
    },[]);

    return (
        <div>
            {props.dialogs ? Object.entries(props.dialogs).map(([key, value], i) => 
            <NavLink to={"/message/" + key} key={i}>
            <div className="dialog">
            <img src={value.img} alt="" width="50px" height="50px" />
            <div className="dialog_name">{value.firstName} {value.lastName}</div>
            </div>
            </NavLink>
            ): null}
        </div>
    )
}

let mapStateToProps = (state) => {
    return {
        dialogs: state.messages.dialogsList
    }
}


export default connect(mapStateToProps, {
    getDialogs
})(Messages);