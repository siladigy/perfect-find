import React, {useEffect, useState, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SimpleCrypto from "simple-crypto-js"
import moment from 'moment';
import Resizer from "react-image-file-resizer"
import * as JSZip from 'jszip';

import { getDialogData, sendMessage, checkView, stopPreviousData, onUploadSubmission } from '../../redux/messagesReducer'
import Messages from './Messages';

import './dialog.scss'
import profile from './../../images/profile.png'
import send from './../../images/send.svg'
import images from './../../images/images.svg'
import clip from './../../images/clip.svg'
import download from './../../images/download.svg'


const Dialog = React.memo((props) => {
    
    var dialogId = props.match.params.dialogId;
    
    const [message, setMessage] = useState(null)
    const [files, setFiles] = useState([])
    const [docs, setDocs] = useState([])
    const [preview, setPreview] = useState([])
    const [docPreview, setDocPreview] = useState([])
    const [active, setActive] = useState(null)


    useEffect(() => {
        props.getDialogData(dialogId);
        return () => {
            props.stopPreviousData();
        }
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
        console.log(files, docs)
        if((textarea.current.value).trim() !== ''){
            props.sendMessage(dialogId, message)
            textarea.current.value = ''
        }
        if(files.length > 0){
            props.onUploadSubmission(dialogId, files, 'images')
        } 
        if(docs.length > 0){
            props.onUploadSubmission(dialogId, docs, 'docs')
        }
        setPreview([])
        setFiles([])
        setDocs([])
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

        return moment(number).fromNow() 
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

    const imageUpload = e => {
        var previewImg = [];
        var arr = []
        for (let i = 0; i < e.target.files.length; i++) {
            const newFile = e.target.files[i];
            const size = newFile.size/1024
            newFile["src"] = URL.createObjectURL(e.target.files[i])
            newFile["id"] = Math.random();
            previewImg.push(newFile["src"])
            if (size > 300) {
                Resizer.imageFileResizer(newFile, 500, 500, "JPEG", 100, 0, (uri) => {

                    function blobToFile(theBlob, fileName){
                        theBlob.lastModifiedDate = new Date();
                        theBlob.name = fileName;
                        theBlob.id = newFile["id"];
                        theBlob.src = newFile["src"];
                        return theBlob;
                    }

                    var myFile = blobToFile(uri, newFile.name);
                    arr.push(myFile)
                    
                }, 'blob')
            } else {
                arr.push(newFile)
            }
              
        }
        setFiles(arr); 
        setPreview(previewImg);

    };

    const fileUpload = (e) => {
        var arr = [];
        
        for (let i = 0; i < e.target.files.length; i++) {
            const newFile = e.target.files[i];
            newFile["id"] = Math.random();
            arr.push(newFile)
        }
        setDocs(arr); 
        console.log(arr)
    }

    const dateLine = (i, previ) => {

        var today = new Date() 
        var yesterday = new Date(Date.now() - 864e5)
        var dayBeforeYesterday = new Date(Date.now() - 864e5 * 2)

        if (new Date(i).toDateString() === yesterday.toDateString() && new Date(previ).toDateString() !== yesterday.toDateString() ) {
            return <div className='dateLine'><span>yesterday</span></div>
        } 
        else if (new Date(i).toDateString() === today.toDateString() && new Date(previ).toDateString() !== today.toDateString()) {
            return <div className='dateLine'><span>today</span></div>
        }
        else if(new Date(i).toDateString() !== new Date(previ).toDateString()) {
            return <div className='dateLine'><span>{new Date(i).toDateString()}</span></div>
        }
  
    }

    const removeFromAdding = (evt) => {
        var prev = [...preview]
        var arr = [...files]

        arr = arr.filter(e => e.src !== evt.target.id )
        prev = prev.filter(e => e !== evt.target.id )

        setPreview(prev)
        setFiles(arr)
    }

    const handleView = (e) => {
        setActive(e.target.src)
    }

    const getFileExtension = (file) => {
        var name = Object.keys(file)[0]
        var ext = name.split('.').pop()

        return ext
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
                    {props.dialogData ? props.dialogData.map((value, i) => 
                    <>
                    {props.dialogData[i-1] ? dateLine(props.dialogData[i].createdAt, props.dialogData[i-1].createdAt) : null}

                    <div className={"dialog " + (props.authId === value.id ? 'me' : 'not')}>

                        <div className="dialog_img">
                            <img src={value.img ? value.img : profile} />
                        </div>
                     
                        <div className="dialog_text">
                            <div className="dialog_time">{convertTime(value.createdAt)}</div> 
                           {value.text ? <div className="dialog_message">{decryptText(value.text, value.createdAt)}</div> : null} 
                        
                            {value.images ? <div className='dialog_images'>
                            {value.images.map(img => (
                                <div className={"dialog_image " + (img === active ? 'selected' : null)} onClick={handleView}>
                                <img src={img} /> 
                                </div>
                            ))}
                            </div>:null}

                            {value.files ? <div className='dialog_files'>
                            {value.files.map(value => <div className="dialog_file">
                                <span className="dialog_file-name">
                                <div className="dialog_file-ext">
                                    {getFileExtension(value)}
                                </div>
                                {Object.keys( value )[0]}
                                </span>
                                <a href={Object.values( value )[0]} >
                                    <img src={download} />
                                </a>
                            </div> )}
                            </div>:null}
                        </div>
                       
                    </div>
                    </>
                    ): null}
                     <div ref={messagesEndRef} />
                </div>

                 {preview.length > 0 || docs.length > 0 ?
                    <div className="preview">
                        {preview.map((data) => 
                        <span>
                            <div id={data} className="preview__remove" onClick={removeFromAdding}>&#215;</div>
                            <img src={data} />
                        </span>
                        )}
                        {docs.map((file) => 
                        <span>
                            <div id={file.id} className="preview__remove" onClick={removeFromAdding}>&#215;</div>
                            <div className='file-preview'>{file.name}</div>
                        </span>
                        )}
                    </div>
                 :null}

                
                <div className="dialog_buttons">
                    {props.uploadProgress ? <div className="upload-progress" style={{width: (props.uploadProgress) + '%'}}></div>  : null} 
                    <label htmlFor="images">
                        <img src={images} />
                    </label>
                    <input id="images" type="file" multiple accept="image/*" onChange={imageUpload} />
                    <label htmlFor="doc">
                        <img src={clip} />
                    </label>
                    <input id="doc" type="file" multiple onChange={fileUpload} />
                    <div>
                    </div>
                </div>
                <form> 
                    <textarea placeholder="type something..." ref={textarea} onKeyDown={onKeyDown} onFocus={toggleTyping} onChange={handleMessage} />
                    <button type="submit" onClick={onCLick}>
                        <img src={send} alt=""/>
                    </button>
                </form>
                 </> : 
                 <div className="loader">
                     <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                 </div>}
                
            </div>
        </div>
    )
})

let ProjectWithRouter = withRouter(Dialog)


let mapStateToProps = (state) => {
    
    return {
        authId: state.auth.id,
        dialogData: state.messages.dialogData,
        dialogs: state.messages.dialogsList,
        uploadProgress: state.messages.uploadProgress
    }
}


export default connect(mapStateToProps, {
    getDialogData,
    sendMessage,
    checkView,
    stopPreviousData,
    onUploadSubmission
})(ProjectWithRouter);