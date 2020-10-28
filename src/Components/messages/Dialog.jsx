import React, {useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getDialogData, sendMessage, checkView } from '../../redux/messagesReducer'
import Messages from './Messages';

import './dialog.scss'
import profile from './../../images/profile.png'

const Dialog = (props) => {
    
    var dialog = props.match.params.dialogId;
    
    const [message, setMessage] = useState(null)
    const [dialogId, setDialogId] = useState(dialog)

    useEffect(() => {
        setDialogId(dialog)
        debugger
        if (dialogId) {
            props.getDialogData(dialogId)
        }
        
    },[dialogId]);

    useEffect(() => {

        if(dialogId === props.match.params.dialogId) {
            props.checkView(dialogId);
        }

    },[props.dialogData]);

    const messagesEndRef = useRef(null)
    const textarea = useRef(null)

    useEffect(() => {
        messagesEndRef.current.scrollIntoView()
    }, [props.dialogData]);

    const sendMessage = () => {
        if((textarea.current.value).trim() !== ''){
            props.sendMessage(dialogId, message)
            textarea.current.value = ''
        }
    }

    const onCLick = (e) => {
        e.preventDefault();
        sendMessage();
    }

    const onKeyDown = (e) => {
        if(e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            sendMessage();
        }
    }

    const handleMessage = (e) => {
        setMessage(e.target.value)
    }

    const convertTime = (number) => {
        var time = new Date(number)
        var hours = time.getHours().toString().length > 1 ? time.getHours() : '0' + time.getHours()
        var minutes = time.getMinutes().toString().length > 1 ? time.getMinutes() : '0' + time.getMinutes()

        return `${hours} : ${minutes}` 
    }

    return (
        <div className='flexbox messages-wrap'>
            <Messages />
            <div className='dialog-window'>
                <div className="dialog-header">
                    
                </div>
                <div className="dialogs-wrap">
                    {props.dialogData ? Object.entries(props.dialogData).map(([key, value], i) => 
                    <div className={"dialog " + (props.authId === value.id ? 'me' : 'not')}>

                        <div className="dialog_img">
                            <img src={value.img ? value.img : profile} />
                        </div>

                        <div className="dialog_text">
                            <div className="dialog_time">{convertTime(value.createdAt)}</div> 
                            <div className="dialog_message">{value.text}</div> 
                        </div>
                       
                    </div>
                    ): null}
                     <div ref={messagesEndRef} />
                </div>
            
                <form> 
                    <textarea placeholder="type something..." ref={textarea} onKeyDown={onKeyDown} onChange={handleMessage} />
                    <button type="submit" onClick={onCLick}>send</button>
                </form>
            </div>
        </div>
    )
}

let ProjectWithRouter = withRouter(Dialog)


let mapStateToProps = (state) => {
    
    return {
        authId: state.auth.id,
        dialogData: state.messages.dialogData
    }
}


export default connect(mapStateToProps, {
    getDialogData,
    sendMessage,
    checkView
})(ProjectWithRouter);