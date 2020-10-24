import React from 'react';
import { NavLink } from 'react-router-dom';
import './logo.scss'

const Logo = () => {
    return (
        <div className="logo-wrapper container">
        <h1><NavLink to="/" className="logo"><span>Y</span>our. <span>P</span>erfect. <span>F</span>ind.</NavLink></h1>
        </div>
    )
}

export default Logo;