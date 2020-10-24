import React, {useEffect, useState} from 'react';
import './addProject.scss'
import { addProject } from './../../redux/addProjectReducer'
import { connect } from 'react-redux';

const AddProject = (props) => {

    const [title, setTitle] = useState(null)
    const [description, setDescription] = useState(null)
    const [price, setPrice] = useState(null)
    const [currency, setCurrency] = useState('usd')

    const submitNewProject = (e) => {
        e.preventDefault()
        props.addProject(title, description, price, currency)
    }

    const changeTitle = (e) => {
        setTitle(e.target.value)
    }

    const changeCurrency = (e) => {
        setCurrency(e.target.value)
    }

    const changeDescription = (e) => {
        setDescription(e.target.value)
    }

    const changePrice = (e) => {
        setPrice(e.target.value)
    }

    return (
        <div className="container add-project-wrapper">
            <form onSubmit={submitNewProject}>

            <div className="project-field">
            <label htmlFor="title">Project title</label>
            <input id="title" type="text" onChange={changeTitle} />
            </div>

            <div className="project-field">
            <label htmlFor="description">Project description</label>
            <textarea id="description" type="text" onChange={changeDescription} />
            </div>

            <div className="project-field">
            <label htmlFor="tags">Project tags</label>
            <input id="tags" type="text" onChange={changeDescription} />
            <div className="project-field-info">
                Separate tags with 
            </div>
            </div>

            <div className="project-field">
            <label htmlFor="price">Project price</label>
            <input id="price" type="text" onChange={changePrice} />
            <select onChange={changeCurrency}>
                <option value="usd">USD</option>
                <option value="uah">UAH</option>
                <option value="rub">RUB</option>
            </select>
            </div>

            <button type="submit">Create project</button>
            </form>
        </div>
    )
}



export default connect(null, {
    addProject
})(AddProject);