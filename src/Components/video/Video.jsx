import Peer from 'peerjs';
import React, {useEffect, useRef, useState, useSelector} from 'react';
import { connect } from 'react-redux';
import { callanswer, callToNode, setPeerId } from './../../redux/phoneCallReducer'
import './video.scss'

import acceptCall from './../../images/phone-call.svg'
import dropCall from './../../images/stop-call.svg'
import sound from './../../sounds/call.mp3'


const Video = React.memo((props) => {

    var localVideoRef = useRef(null)
    var remoteVideoRef = useRef(null)
    var audio = useRef(null)
    var info = useRef(null)

    var peer = new Peer();

    const [peerID, setPeerID] = useState('')
    const [otherid, setOtherid] = useState('')
    const [active, setActive] = useState(false)
    const [incomingCall, setIncomingCall] = useState(false)
    const [peercall, setPeercall] = useState(null)
    const [activeCall, setActiveCall] = useState(false)

    useEffect(() => {
        peer.on('open', function(peerID) {
            props.setPeerId(peerID)		
        });
    },[]);

    useEffect(() => {
        call()
    },[props.activateCall, props.otherId]);

   
    peer.on('call', function(call) {
        setPeercall(call)
        setIncomingCall(true)
        audio.current.play()
    });   

    const callanswer = () => {
        setActive(true)
        props.callanswer(peercall, localVideoRef.current, remoteVideoRef.current)
    }


    const call = () => {
        console.log('start call', props.otherId )
        if (props.activateCall) {
            
            props.callToNode(props.otherId, peer, localVideoRef.current, remoteVideoRef.current)
        }
    }

    peer.on('disconnected', function() { 
        setActiveCall(false)

    });

    const handleDropCall = () => {
        peer.disconnect();
        if (audio.current) {
            audio.current.pause()
        }
        setIncomingCall(false)
        setActiveCall(false)

    }

    const handleAcceptCall = () => {
        audio.current.pause()
        setIncomingCall(false)
        setActiveCall(true)
        callanswer()
    }

    return (
        <>
        {/* <input type="text" defaultValue={peerID} />
        <input type="text" value={otherid} onChange={(e) => setOtherid(e.target.value)} />
        <div ref={info}></div>
        <button onClick={call}>call</button> */}

        {incomingCall ? 
            <div className={"incoming_call" + (incomingCall ? ' active' : '')}>
                <img src={acceptCall} onClick={handleAcceptCall} />
                <img src={dropCall} onClick={handleDropCall} />
                <audio ref={audio} loop>
                    <source src={sound} type="audio/mpeg"></source>
                </audio>
            </div>
        : null}


        <div className={"video_wrap" + (props.videoActive && activeCall ? ' active' : '')}>
            <div className="videos-wrap">
                <video className='remote-video' ref={remoteVideoRef} autoPlay></video>
                <video ref={localVideoRef} autoPlay></video>
            </div>
            <div className="drop-call">
                <img src={dropCall} onClick={handleDropCall} />
            </div>
        </div>
        
        </>
    )
})

const mapStateToProps = (state) => {

    return {
        videoActive: state.phoneCall.videoActive,
        activateCall: state.phoneCall.activateCall,
        otherId: state.phoneCall.otherId
    }
}

export default connect(mapStateToProps, {
    callanswer,
    callToNode,
    setPeerId
})(Video);