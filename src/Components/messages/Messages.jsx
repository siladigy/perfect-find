import React, {useEffect, useState, useSelector } from 'react';
import { connect } from 'react-redux';
import { NavLink , withRouter } from 'react-router-dom';
import { getDialogs } from '../../redux/messagesReducer'

import './messages.scss'
import profile from './../../images/profile.png'

const Messages = (props) => {

    const dialogId = props.match.params.dialogId;

    // const dialogsData = useSelector(state => state.messages.dialogData)
    
    useEffect(() => {
        props.getDialogs();
    },[]);

    const getPhoto = (data) => {
        var img = props.authId === data.author.id ? data.interlocutor.img : data.author.img
        return img ? img : profile
    }

    const getName = (data) => {
        var name = props.authId === data.author.id ? `${data.interlocutor.firstName} ${data.interlocutor.lastName}` : `${data.author.firstName} ${data.author.lastName}`
        return name
    }

    const getMessageAuthor = (data) => {
        var author = props.authId === data.lastMessageAuthor ? 'me' : data.author.id === data.lastMessageAuthor ? data.author.firstName : data.interlocutor.firstName
        return author
    }

    const convertTime = (number) => {
        var time = new Date(number)
        var hours = time.getHours().toString().length > 1 ? time.getHours() : '0' + time.getHours()
        var minutes = time.getMinutes().toString().length > 1 ? time.getMinutes() : '0' + time.getMinutes()

        return `${hours} : ${minutes}` 
    }

    return (
        <div className='dialogs-list'>
            {props.dialogs ? props.dialogs.map((data, index) => 
            <NavLink to={"/message/" + data.messageId} key={index}>
            <div className={"dialog-block " + (dialogId === data.messageId ? 'selected' : null)}>
            <img src={getPhoto(data)} />
            {data.checkView !== props.authId && data.checkView ? <span>new</span> : null}
            <div className="dialog-text_wrap">
            <div className="dialog_name">{getName(data)}</div>
            <span className="dialog_time">{convertTime(data.lastUpdate)}</span>
            <div className="dialog_message">
            <span>{getMessageAuthor(data)}: </span>
            {data.lastMessage}
            </div>
            </div>
            </div>
            </NavLink>
            ): null}
        </div>
    )
}

let ProjectWithRouter = withRouter(Messages)


let mapStateToProps = (state) => {
    return {
        authId: state.auth.id,
        dialogs: state.messages.dialogsList,
        dialogData: state.messages.dialogData
    }
}


export default connect(mapStateToProps, {
    getDialogs
})(ProjectWithRouter);