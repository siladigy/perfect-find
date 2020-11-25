import React, {useEffect, useState, useSelector} from 'react';
import { connect } from 'react-redux';
import './splash.scss'

const Splash = () => {

    const [title, setTitle] = useState(false) 
    const [wrap, setWrap] = useState(true) 
    const [splash, setSplash] = useState(false) 

    useEffect(() => {
        setTimeout(() => {
            setTitle(true)
        }, 1000);
        setTimeout(() => {
            setWrap(false)
            setTitle(false)
        }, 4000);
    },[]);


    return (
        <>
        {splash ? 
        <div className={"splash-wrap " + (wrap ? 'active' : null)}>
            <h1 className={title ? 'active' : null}>Your. Perfect. Find.</h1>
        </div>
        :null}
        </>
    )
}

export default connect(null, {
    
})(Splash);