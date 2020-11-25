import React, {useEffect, useState, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SimpleCrypto from "simple-crypto-js"
import moment from 'moment';
import * as JSZip from 'jszip';

import { getDialogData, sendMessage, checkView, stopPreviousData, onUploadSubmission } from '../../redux/messagesReducer'
import Messages from './Messages';

import './dialog.scss'
import profile from './../../images/profile.png'
import download from './../../images/download.svg'
import Textarea from './Textarea';


const Dialog = React.memo((props) => {
    
    var dialogId = props.match.params.dialogId;
        
    const [active, setActive] = useState(null)


    useEffect(() => {
        props.getDialogData(dialogId);
        return () => {
            props.stopPreviousData();
        }
    },[dialogId]);

    const messagesEndRef = useRef(null)

    useEffect(() => {
        props.checkView(dialogId);
        if(messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView()
        }
    }, [props.dialogData]);

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

    const decryptText = (text, key) => {
        var simpleCrypto = new SimpleCrypto(key)

        return simpleCrypto.decrypt(text)
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

    const handleView = (e) => {
        setActive(e.target.src)
    }

    const getFileExtension = (file) => {
        var name = Object.keys(file)[0]
        var ext = name.split('.').pop()

        return ext
    }

    const checkGroup = (first, last, i, previ, nexti) => {
        var group = null
       
        if (previ && i.id !== previ.id || previ && i.createdAt - previ.createdAt > 60000) {
            group = 'frst'
        } else if(nexti && i.id !== nexti.id || nexti && nexti.createdAt - i.createdAt > 60000) {
            group = 'lst'
        } else if(last.createdAt == i.createdAt && i.id == previ.id && i.createdAt - previ.createdAt < 60000){
            group = 'lst'
        }

        return group ? group : ''
        
        
    }

    return (
        <div className='flexbox messages-wrap'>
            <Messages />
            <div className='dialog-window'>
                {props.dialogData ? <>

                <div className="dialogs-wrap">
                    {props.dialogData ? props.dialogData.map((value, i) => 
                    <>
                    {props.dialogData[i-1] ? dateLine(props.dialogData[i].createdAt, props.dialogData[i-1].createdAt) : null}

                    <div className={"dialog " + (props.authId === value.id ? 'me ' : 'not ') + checkGroup(props.dialogData[0], props.dialogData[props.dialogData.length - 1], props.dialogData[i], props.dialogData[i-1], props.dialogData[i+1] ) }>

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

                <Textarea dialogId={dialogId} />
                
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
        dialogs: state.messages.dialogsList
    }
}


export default connect(mapStateToProps, {
    getDialogData,
    checkView,
    stopPreviousData
})(ProjectWithRouter);