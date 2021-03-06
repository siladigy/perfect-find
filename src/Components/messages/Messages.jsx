import React, {useEffect, useState, useSelector } from 'react';
import { connect } from 'react-redux';
import { NavLink , withRouter } from 'react-router-dom';
import { getDialogs, stopDialogsList } from '../../redux/messagesReducer'
import SimpleCrypto from "simple-crypto-js"
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './messages.scss'
import profile from './../../images/profile.png'

import notification from './../../sounds/notification.mp3'

const Messages = React.memo((props) => {

    const dialogId = props.match.params.dialogId;

    // const dialogsData = useSelector(state => state.messages.dialogData)
    
    useEffect(() => {
        props.stopDialogsList();
        props.getDialogs();
    },[]);

    const notif = new Audio(notification);

    const playSound = audioFile => {
        audioFile.play();
    }

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
        var weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

        var time = new Date(number)
        var today = new Date() 
        var yesterday = new Date(Date.now() - 864e5)
        var dayBeforeYesterday = new Date(Date.now() - 864e5 * 2)

        var hours = time.getHours().toString().length > 1 ? time.getHours() : '0' + time.getHours()
        var minutes = time.getMinutes().toString().length > 1 ? time.getMinutes() : '0' + time.getMinutes()

        var day = 
        time.toDateString() === yesterday.toDateString() ? 'yesterday' :
        time.toDateString() === dayBeforeYesterday.toDateString() ? weekDays[time.getDay()] :
        time.toDateString() === today.toDateString() ? '' : 
        time.getFullYear() + "." + (time.getMonth() + 1) + "." + time.getDate();

        return `${day}  ${hours} : ${minutes}` 
    }

    const decryptText = (text, key) => {
        var simpleCrypto = new SimpleCrypto(key)
        var res = simpleCrypto.decrypt(text) == 'sent images' || simpleCrypto.decrypt(text) == 'sent files' ? <i>{simpleCrypto.decrypt(text)}</i> : simpleCrypto.decrypt(text)

        return res.toString()
    }

    return (
        <div className='dialogs-list'>
            <TransitionGroup className="dialogs">
          
            {props.dialogs ? props.dialogs.map((data, index) => 
            <CSSTransition
            key={index}
            timeout={(index+1)*1000}
            classNames="item"
          >
            <NavLink to={"/message/" + data.messageId} key={index}>
            <div className={"dialog-block " + (dialogId === data.messageId ? 'selected' : null)}>
            <img src={getPhoto(data)} />
            <div className="dialog-text_wrap">
            {dialogId !== data.messageId && data.checkView !== props.authId && data.checkView ? <span className='dialog_counter'>{data.unreadCounter}{playSound(notif)} </span>  : null}
            <div className="dialog_name">{getName(data)}</div>
            <span className="dialog_time">{convertTime(data.lastUpdate)}</span>
            <div className="dialog_message">
            <span>{getMessageAuthor(data)}: </span>
            {decryptText(data.lastMessage, data.lastUpdate)}
            </div>
            </div>
            </div>
            </NavLink>
            </CSSTransition>
            ): null}
            </TransitionGroup>
        </div>
    )
})

let ProjectWithRouter = withRouter(Messages)


let mapStateToProps = (state) => {
    return {
        authId: state.auth.id,
        dialogs: state.messages.dialogsList,
        dialogData: state.messages.dialogData
    }
}


export default connect(mapStateToProps, {
    getDialogs,
    stopDialogsList
})(ProjectWithRouter);