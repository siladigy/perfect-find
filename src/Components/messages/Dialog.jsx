import React, {useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SimpleCrypto from "simple-crypto-js"

import { getDialogData, sendMessage, checkView, stopPreviousData, onUploadSubmission } from '../../redux/messagesReducer'
import Messages from './Messages';

import './dialog.scss'
import profile from './../../images/profile.png'
import send from './../../images/send.svg'

const Dialog = (props) => {
    
    var dialogId = props.match.params.dialogId;
    
    const [message, setMessage] = useState(null)
    const [files, setFiles] = useState([])
    const [preview, setPreview] = useState([])

    useEffect(() => {
        props.stopPreviousData()
        props.getDialogData(dialogId)
        
    },[dialogId]);

    const messagesEndRef = useRef(null)
    const textarea = useRef(null)

    useEffect(() => {
        props.checkView(dialogId);
        if(messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView()
        }
    }, [props.dialogData]);

    const sendMessage = () => {
        if((textarea.current.value).trim() !== ''){
            props.sendMessage(dialogId, message)
            textarea.current.value = ''
        }
        if(files.length > 0){
            props.onUploadSubmission(dialogId, files)
        } else {
            console.log(false)
        }
        setPreview([])
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

    const toggleTyping = (e) => {
        if (e.target.value !== '') {
            console.log(true)
        }
    }

    const convertTime = (number) => {
        var time = new Date(number)
        var hours = time.getHours().toString().length > 1 ? time.getHours() : '0' + time.getHours()
        var minutes = time.getMinutes().toString().length > 1 ? time.getMinutes() : '0' + time.getMinutes()

        return `${hours} : ${minutes}` 
    }

    const getHeaderData = (data) => {
        var user;
        data.author.id !== props.authId ? user = 'author' : user = 'interlocutor'

        return  (
            <img src={data[user].img ? data[user].img : profile} />
        )
    }

    const decryptText = (text, key) => {
        var simpleCrypto = new SimpleCrypto(key)

        return simpleCrypto.decrypt(text)
    }

    const onFileChange = e => {
        var previewImg = [];
        var arr = []
        for (let i = 0; i < e.target.files.length; i++) {
            const newFile = e.target.files[i];
            newFile["src"] = URL.createObjectURL(e.target.files[i])
            newFile["id"] = Math.random();
            arr.push(newFile)  
            previewImg.push(URL.createObjectURL(e.target.files[i]))
        }
        setFiles(arr);
        console.log(previewImg)
        setPreview(previewImg);
    };

    const getImages = (img) => {
        if (img) {
           
            for (let i = 0; i < img.length; i++) {
                console.log(img[i])
            } 
            
        }
    }
    return (
        <div className='flexbox messages-wrap'>
            <Messages />
            <div className='dialog-window'>
                {props.dialogData ? <>
                {/* <div className="dialog-header">
                    {props.dialogs ? props.dialogs.map((data, index) => <>
                        {data.messageId === dialogId ? <div>
                            {getHeaderData(data)}
                        </div>
                        :null}
                        </>
                    ) : null}
                </div> */}
                <div className="dialogs-wrap">
                    {props.dialogData ? Object.entries(props.dialogData).map(([key, value], i) => 
                    <div className={"dialog " + (props.authId === value.id ? 'me' : 'not')}>

                        <div className="dialog_img">
                            <img src={value.img ? value.img : profile} />
                        </div>

                        <div className="dialog_text">
                            <div className="dialog_time">{convertTime(value.createdAt)}</div> 
                           {value.text ? <div className="dialog_message">{decryptText(value.text, value.createdAt)}</div> : null} 
                        
                            {value.images ? <div className='dialog_images'>
                            {Object.keys(value.images).map(img => (
                                <img src={value.images[img]} />
                            ))}
                            </div>:null}
                        </div>
                       
                    </div>
                    ): null}
                     <div ref={messagesEndRef} />
                </div>

                <div className="preview">
                    {preview.map((data) => <span>
                        <img src={data} />
                    </span>
                   )}
                </div>
                  
                    
                <form> 
                    <input type="file" multiple accept="image/*" onChange={onFileChange} />

                    <textarea placeholder="type something..." ref={textarea} onKeyDown={onKeyDown} onFocus={toggleTyping} onChange={handleMessage} />
                    <button type="submit" onClick={onCLick}>
                        <img src={send} alt=""/>
                    </button>
                </form>
                 </> : null}
                
            </div>
        </div>
    )
}

let ProjectWithRouter = withRouter(Dialog)


let mapStateToProps = (state) => {
    
    return {
        authId: state.auth.id,
        dialogData: state.messages.dialogData,
        dialogs: state.messages.dialogsList
    }
}


export default connect(mapStateToProps, {
    getDialogData,
    sendMessage,
    checkView,
    stopPreviousData,
    onUploadSubmission
})(ProjectWithRouter);