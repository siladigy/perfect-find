import React, {useEffect, useState, useRef, useCallback } from 'react';
import phone from './../../images/phone-call.svg'


const Dialog = React.memo((props) => {
    return (
        <div className="dialog_header">
            <div className="dialog_header_user_img">
                
            </div>
            <div className="dialog_header_user_name">

            </div>
            <div className="dialog_call">
                <img src={phone} alt=""/>
            </div>
        </div>
    )
})

export default Dialog