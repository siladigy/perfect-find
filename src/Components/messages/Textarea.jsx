import React, {useEffect, useState, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import Resizer from "react-image-file-resizer"

import { sendMessage, onUploadSubmission } from '../../redux/messagesReducer'

import send from './../../images/send.svg'
import images from './../../images/images.svg'
import clip from './../../images/clip.svg'

const Textarea = (props) => {

    const [message, setMessage] = useState(null)
    const [files, setFiles] = useState([])
    const [docs, setDocs] = useState([])
    const [preview, setPreview] = useState([])

    const textarea = useRef(null)

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

    const sendMessage = () => {
        console.log(files, docs)
        if((textarea.current.value).trim() !== ''){
            props.sendMessage(props.dialogId, message)
            textarea.current.value = ''
        }
        if(files.length > 0){
            props.onUploadSubmission(props.dialogId, files, 'images')
        } 
        if(docs.length > 0){
            props.onUploadSubmission(props.dialogId, docs, 'docs')
        }
        setPreview([])
        setFiles([])
        setDocs([])
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

    const removeFromAdding = (evt) => {
        var prev = [...preview]
        var arr = [...files]

        arr = arr.filter(e => e.src !== evt.target.id )
        prev = prev.filter(e => e !== evt.target.id )

        setPreview(prev)
        setFiles(arr)
    }

    const removeDocFromAdding = (evt) => {
        var doc = [...docs]
        doc = doc.filter(e => (e.id).toString() !== (evt.target.id).toString() )

        setDocs(doc)
    }

    return (
        <>
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
                <div id={file.id} className="preview__remove" onClick={removeDocFromAdding}>&#215;</div>
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
            <textarea placeholder="type something..." ref={textarea} onKeyDown={onKeyDown} onChange={handleMessage} />
            <button type="submit" onClick={onCLick}>
                <img src={send} alt=""/>
            </button>
        </form>
        </>
    )
}

let mapStateToProps = (state) => {
    
    return {
        uploadProgress: state.messages.uploadProgress
    }
}


export default connect(mapStateToProps, {
    sendMessage,
    onUploadSubmission
})(Textarea);