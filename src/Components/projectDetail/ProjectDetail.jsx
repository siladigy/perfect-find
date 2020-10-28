import React, {useEffect, useState} from 'react';
import {authState} from './../../redux/authReducer'
import { getProjectDetails, submitProposal, sendMessage } from '../../redux/projectDetailReducer'
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';


const ProjectDetail = (props) => {

    const projectId = props.match.params.projectId;
    const time = props.projectData ? new Date(Math.abs(props.projectData.createdAt)).toString() : null
    const [proposal, setProposal] = useState(null)
    const [auth, setAuth] = useState(false)

    useEffect(() => {
        props.getProjectDetails(projectId);
        props.projectAuthorId === props.authId ? setAuth(true) : setAuth(false)
    },[props.authState]);

    const submitProposal = (e) => {
        e.preventDefault()
        props.submitProposal(projectId, proposal)
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

        <div className="flexbox">
            {props.projectData && props.projectAuthor ? 
            <>
            <div className="project-info">
                {time}
                <div className="project-title">{props.projectData.title}</div>
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
                <textarea cols="60" rows="10" onChange={handleProposal}></textarea>
                <button type="submit" className="btn">Submit</button>
                </form>
                </div>  : null}
                
            </div>
            <div className="client-info">
                <h3>Client :</h3>
                <div className="client-name">{props.projectAuthor.firstName} {props.projectAuthor.lastName}</div>
                <img width="70px" height="70px" src={props.projectAuthor.avatar} alt=""/>
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