// import * as firebase from 'firebase';
// import "firebase/storage";

const SET_VIDEO_ACTIVE = 'SET_VIDEO_ACTIVE';



let initialState = {
    videoActive: false
}  


const phoneCallReducer = (state = initialState, action) => {

    switch(action.type) {
        case SET_VIDEO_ACTIVE:
            return {
                ...state,
                videoActive: action.data
            }
        default: 
            return state;
    }   

}


export const setVideoActive = (bool) => ({ type: SET_VIDEO_ACTIVE, data : bool })


export const callanswer = (peercall, localVideo, remoteVideo) => {

    return (dispatch) => {
        navigator.mediaDevices.getUserMedia ({ audio: true, video: true }).then(function(mediaStream) {
            dispatch (setVideoActive(true))        
            peercall.answer(mediaStream); 
            localVideo.srcObject = mediaStream;

            setTimeout(function() {
                        
                remoteVideo.srcObject = peercall.remoteStream; 

            },1500);			  				  
                    
        }).catch(function(err) { console.log(err.name + ": " + err.message); });

    }
}

export const callToNode = (peerId, peer, localVideo, remoteVideo) => { 

    return (dispatch) => {
        navigator.mediaDevices.getUserMedia ({ audio: true, video: true }).then(function(mediaStream) {
            dispatch (setVideoActive(true)) 
            var peercall = peer.call(peerId,mediaStream); 
            peercall.on('stream', function (stream) { 
                setTimeout(function() {

                    remoteVideo.srcObject = peercall.remoteStream;

                },1500);	
            });
                			  
            localVideo.srcObject = mediaStream;
            localVideo.onloadedmetadata = function(e) {
                localVideo.play();
            };
        }).catch(function(err) { console.log(err.name + ": " + err.message); });
    }
}


export default phoneCallReducer;