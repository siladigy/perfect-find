import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import {register, authState} from '../../redux/authReducer'
import './auth.scss'
import { NavLink, Redirect } from 'react-router-dom';


const Login = (props) =>{

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const submitForm = (e) => {
        e.preventDefault()
        props.register(email, password, firstName, lastName)
    } 

    const changeEmailField = (e) => {  
        setEmail(e.target.value)
    }

    const changePasswordField = (e) => {  
        setPassword(e.target.value)
    }

    const changeFirstNameField = (e) => {  
        setFirstName(e.target.value)
    }

    const changeLastNameField = (e) => {  
        setLastName(e.target.value)
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
            <h2>Join</h2>
            {props.error ? <div className="email-errors">{props.error}</div> : null}
            <div className="email-wrapper">
            <label htmlFor="email">First Name</label>
            <input type="text" onChange={changeFirstNameField} required />
            </div>
            <div className="email-wrapper">
            <label htmlFor="email">Last Name</label>
            <input type="text" onChange={changeLastNameField} required />
            </div>
            <div className="email-wrapper">
            <label htmlFor="email">Email</label>
            <input type="email" onChange={changeEmailField} />
            {props.emailError ? <div className="email-errors">{props.emailError}</div> : null}
            </div>
            <div className="password-wrapper">
            <label htmlFor="password">Password</label>
            <input type="password" onChange={changePasswordField} />
            {props.passwordError ? <div className="password-errors">{props.passwordError}</div> : null}
            </div>
            <div className="">
            <button type="submit">Join</button>
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
    register,
    authState
})(Login);