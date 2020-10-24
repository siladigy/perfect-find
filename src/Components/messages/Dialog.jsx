import React, {useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getDialogData, sendMessage } from '../../redux/messagesReducer'
import Messages from './Messages';

import './dialog.scss'

const Dialog = (props) => {
    
    const dialogId = props.match.params.dialogId;

    const [message, setMessage] = useState(null)

    useEffect(() => {
        props.getDialogData(dialogId);
    },[dialogId]);

    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current.scrollIntoView()
    }, [props.dialogData]);

    const sendMessage = (e) => {
        e.preventDefault()
        props.sendMessage(dialogId, message)
        e.target.reset()
    }

    const handleMessage = (e) => {
        
        setMessage(e.target.value)
    }

    return (
        <div className='flexbox messages-wrap container'>
            <Messages />
            <div className='dialog-window'>
                <div className="dialog-header">
                    
                </div>
                <div className="dialogs-wrap">
                    {props.dialogData ? Object.entries(props.dialogData).map(([key, value], i) => 
                    <div className={"dialog " + (props.authId === value.id ? 'me' : 'not')}>

                        <div className="dialog_img">
                            <img src={value.img} />
                        </div>

                        <div className="dialog_text">
                            <div className="dialog_name">{value.firstName} {value.lastName}</div>
                            <div className="dialog_message">{value.text}</div> 
                        </div>
                       
                    </div>
                    ): null}
                     <div ref={messagesEndRef} />
                </div>
            
                <form onSubmit={sendMessage}> 
                    <textarea placeholder="type something..." onChange={handleMessage} />
                    <button type="submit">send</button>
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
    sendMessage
})(ProjectWithRouter);