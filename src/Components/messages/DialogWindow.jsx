import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect} from 'react-router-dom';

import Dialog from './Dialog';
import './dialog.scss'
import Messages from './Messages';

const DialogWindow = React.memo((props) => {

    var dialogId = props.match.params.dialogId;
    
    return (
        <div className='flexbox messages-wrap'>
            <Messages />
            {props.firstDialogId ? <>
                {dialogId ? <Dialog /> : <Redirect to={"/message/" + props.firstDialogId} />}
            </> : null}
            {/* <Dialog /> */}
        </div>
    )
})

let ProjectWithRouter = withRouter(DialogWindow)


let mapStateToProps = (state) => {
    
    return {
        firstDialogId: state.messages.firstDialogId
    }
}


export default connect(mapStateToProps, {
    
})(ProjectWithRouter);