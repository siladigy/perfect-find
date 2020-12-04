import Peer from 'peerjs';
import React, {useEffect, useRef, useState, useSelector} from 'react';
import { connect } from 'react-redux';
import { callanswer, callToNode } from './../../redux/phoneCallReducer'
import './video.scss'
const Video = React.memo((props) => {

    var localVideoRef = useRef(null)
    var remoteVideoRef = useRef(null)
    var info = useRef(null)

    var peer = new Peer();

    const [peerID, setPeerID] = useState(null)
    const [otherid, setOtherid] = useState(null)
    const [active, setActive] = useState(false)

    useEffect(() => {
        peer.on('open', function(peerID) {
            setPeerID(peerID)		
        });
    },[]);
   

    var peercall;
    peer.on('call', function(call) {
        peercall=call;
        callanswer()
    });   

    const callanswer = () => {
        setActive(true)
        
        props.callanswer(peercall, localVideoRef.current, remoteVideoRef.current)
        
    }


    const call = () => {
        setActive(true)
    
        props.callToNode(otherid, peer, localVideoRef.current, remoteVideoRef.current)

    }

    const stop = () => {
        peer.close()
    }

    return (
        <div>
        <input type="text" value={peerID} />
        <input type="text" value={otherid} onChange={(e) => setOtherid(e.target.value)} />
        <div ref={info}></div>
        <button onClick={call}>call</button>

        <div className={"video_wrap " + (props.videoActive ? 'active' : null)}>
        <video className='remote-video' ref={remoteVideoRef} autoPlay></video>
        <video ref={localVideoRef} autoPlay></video>
        </div>
        
        </div>
    )
})

const mapStateToProps = (state) => {

    return {
        videoActive: state.phoneCall.videoActive
    }
}

export default connect(mapStateToProps, {
    callanswer,
    callToNode
})(Video);