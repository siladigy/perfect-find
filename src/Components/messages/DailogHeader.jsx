import React, {useEffect, useState, useRef, useCallback } from 'react';
import phone from './../../images/phone-call.svg'
import { connect } from 'react-redux';

import { getOtherId } from './../../redux/phoneCallReducer'
import placeholder from './../../images/profile.png'

const DialogHeader = React.memo((props) => {

    console.log(props.interlocutor)

    const handleCall = async () => {
        props.getOtherId(props.interlocutor.id)
    }

    return (
        <div className="dialog_header">
            {props.interlocutor ? 
            <div className="dialog_header_user_img">
                <img src={props.interlocutor.img ? props.interlocutor.img : placeholder} />
            </div>
            : null}
            
            <div className="dialog_header_user_name">

            </div>
            <div className="dialog_call">
                <img src={phone} onClick={handleCall} />
            </div>
        </div>
    )
})

// let mapStateToProps = (state) => {
    
//     return {
//         authId: state.auth.id,
//         dialogData: state.messages.dialogData,
//         dialogs: state.messages.dialogsList
//     }
// }


export default connect(null, {
    getOtherId
})(DialogHeader);