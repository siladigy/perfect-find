import React, {useEffect, useState, useRef} from 'react';
import {authState} from './../../redux/authReducer'
import { getProjectDetails, submitProposal, sendMessage } from '../../redux/projectDetailReducer'
import { connect } from 'react-redux';
import { NavLink, Redirect, withRouter } from 'react-router-dom';

import './projectDetail.scss'
const ProjectDetail = (props) => {

    const projectId = props.match.params.projectId;
    const time = props.projectData ? new Date(Math.abs(props.projectData.createdAt)).toString() : null
    const [proposal, setProposal] = useState(null)
    const [auth, setAuth] = useState(false)
    const [success, setSuccess] = useState(false)

    const textarea = useRef(null)

    useEffect(() => {
        props.getProjectDetails(projectId);
    },[]);

    useEffect(() => {
        props.projectAuthorId === props.authId ? setAuth(true) : setAuth(false)
        console.log(props.projectAuthorId, props.authId)
    },[props.projectData, props.projectAuthorId]);

    
    const submitProposal = (e) => {
        e.preventDefault()
        if(proposal.trim() !== '') {
            props.submitProposal(projectId, proposal)
            textarea.current.value = ''
            setSuccess(true)
        }
        
    }

    const handleProposal = (e) => {
        setProposal(e.target.value)
    }

    const sendMessage = (e) => {
        var userId = e.target.id;
        var proposalText = e.target.previousSibling.innerText;

        props.sendMessage(userId, projectId, proposalText)
    }
    

    return (
        <>
        {props.handleProposal ? <Redirect to={"/message/" + props.handleProposal} /> : null}

        <div className="project-detail-wrap">
            {props.projectData && props.projectAuthor ? 
            <>
            <div className="project-info">
                
                <div className="project-title">{props.projectData.title}</div>
                {time}
                <div className="project-description">{props.projectData.description}</div>

                <br/><br/>
                <h4>Proposals</h4>
                {props.projectData.proposals ? Object.entries(props.projectData.proposals).map(([key, value], i) => 
                <div className="proposal">
                    <span className="proposal-text">
                    {value}
                    </span>
                    {auth ? <button id={key} onClick={sendMessage}>send message</button> : null}
                </div>
                ): null }
                
                <br/><br/>
                {!auth ? 
                <div>
                <h4>Send Proposal</h4>
                <form onSubmit={submitProposal}>
                <textarea cols="60" rows="10" onChange={handleProposal} ref={textarea}></textarea>
                <button type="submit" className={'btn ' + (success && 'success')}>{success ? 'Success' : 'Submit'}</button>
                </form>
                </div>  : null}
                
            </div>
            <div className="client-info">
                <div className="client-wrap">
                <img width="70px" height="70px" src={props.projectAuthor.avatar} alt=""/>
                <div className="client-name">{props.projectAuthor.firstName} {props.projectAuthor.lastName}</div>

                <div className="client-buttons">
                    <NavLink to='/'>View Profile</NavLink>
                    <button>Connect</button>
                </div>
                </div>
                
            </div>
            
            </>:null}
           
        </div>
        </>
    )
}


let ProjectWithRouter = withRouter(ProjectDetail)

let mapStateToProps = (state) => {
    return {
        authId: state.auth.id,
        projectData: state.projectDetail.projectData,
        projectAuthor: state.projectDetail.projectAuthor,
        projectAuthorId: state.projectDetail.projectAuthorId,
        handleProposal: state.projectDetail.handleProposal
    }
}

export default connect(mapStateToProps, {
    authState,
    getProjectDetails,
    submitProposal,
    sendMessage
})(ProjectWithRouter);