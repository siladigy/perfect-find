import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import {login, authState} from '../../redux/authReducer'
import './auth.scss'
import { NavLink, Redirect } from 'react-router-dom';


const Login = (props) =>{

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submitForm = (e) => {
        e.preventDefault()
        props.login(email, password)
    } 

    const changeEmailField = (e) => {  
        setEmail(e.target.value)
    }

    const changePasswordField = (e) => {  
        setPassword(e.target.value)
    }


    useEffect(() => {
        props.authState()
    },[props.hasAccount],);

    return(
        <>
        {props.hasAccount ? 
            <Redirect to="/" />: 
            <div className="login-wrapper">
            <form onSubmit={submitForm}>
            <h2>Log in</h2>
            {props.error ? <div className="email-errors">{props.error}</div> : null}
            <div className="email-wrapper">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" onChange={changeEmailField} />
            {props.emailError ? <div className="email-errors">{props.emailError}</div> : null}
            </div>
            <div className="password-wrapper">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={changePasswordField} />
            {props.passwordError ? <div className="password-errors">{props.passwordError}</div> : null}
            </div>
            <div className="">
            <button type="submit">Log in</button>
            <div className="login-close">
                <NavLink to='/'>X</NavLink>
             </div>
            </div>
            
            </form>

        </div> 
        }
        </>
        
    )

    
}

let mapStateToProps = (state) => {
    return {
        hasAccount: state.auth.hasAccount,
        emailError: state.auth.emailError,
        passwordError: state.auth.passwordError,
        error: state.auth.error
    }
}

export default connect(mapStateToProps, {
    login,
    authState
})(Login);