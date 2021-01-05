import * as firebase from 'firebase';
// import "firebase/storage";

const SET_VIDEO_ACTIVE = 'SET_VIDEO_ACTIVE';
const ACTIVATE_CALL = 'ACTIVATE_CALL';
const SET_OTHER_ID = 'SET_OTHER_ID';



let initialState = {
    videoActive: false,
    activateCall: false,
    otherId: null
}  


const phoneCallReducer = (state = initialState, action) => {

    switch(action.type) {
        case SET_VIDEO_ACTIVE:
            return {
                ...state,
                videoActive: action.data
            }
        case ACTIVATE_CALL:
            return {
                ...state,
                activateCall: action.data
            }
        case SET_OTHER_ID:
            return {
                ...state,
                otherId: action.data
            }
        default: 
            return state;
    }   

}


export const setVideoActive = (bool) => ({ type: SET_VIDEO_ACTIVE, data : bool })
export const activateCall = (bool) => ({ type: ACTIVATE_CALL, data : bool })
export const setOtherId = (data) => ({ type: SET_OTHER_ID, data : data })

export const getOtherId = (id) => {
    return async (dispatch) => {
        const db = firebase.firestore();

        var data = db.collection("users").doc(id)
        var peerId = await data.get()

        dispatch (activateCall(true))
        dispatch (setOtherId(peerId.data().peerId))

        // return peerId.data().peerId
    }
}

export const setPeerId = (id) => {
    return (dispatch) => {
        const db = firebase.firestore();

        firebase.auth().onAuthStateChanged(function(data) {
            if (data) {
                const user = firebase.auth().currentUser 
                console.log('peerId set')
                db.collection("users").doc(user.uid).update({
                    peerId: id
                })
            }
        });
    }
}

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