import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import {login, authState} from '../../redux/authReducer'
import './auth.scss'
import { NavLink, Redirect } from 'react-router-dom';

import hire from './../../images/hire.svg'

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
                <img src={hire} />
            <div className="login-right">
                <div className="login-logo">
                    <NavLink to='/'><h1>your<span>.</span> perfect<span>.</span> find<span>.</span></h1></NavLink> 
                </div><span>.</span>
            </div>
            <div className="login-form">
            <form onSubmit={submitForm}>
            <h2>Welcome back</h2>
            {props.error ? <div className="email-errors">{props.error}</div> : null}
            <div className="email-wrapper">
            <input type="email" placeholder='email' id="email" onChange={changeEmailField} />
            {props.emailError ? <div className="email-errors">{props.emailError}</div> : null}
            </div>
            <div className="password-wrapper">
            <input type="password" placeholder='password' id="password" onChange={changePasswordField} />
            {props.passwordError ? <div className="password-errors">{props.passwordError}</div> : null}
            </div>
            <div className="">
            <button type="submit">Sign in</button>
            </div>
            <div className="login-links">
          
                <NavLink to='/'>Forgot password?</NavLink>
                <NavLink to='/register'>Don't have an account?</NavLink>
            
            </div>
            
            </form>
            </div>
            

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