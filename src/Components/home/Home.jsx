import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getAllProjects, getSearchResults, loadMoreProjects } from '../../redux/allProjectsReducer'
import './home.scss'

const Home = (props) => {


    const [search, setSearch] = useState(null)

    useEffect(() => {
        props.getAllProjects();
    },[]);

    const loadMore = () => {
        props.loadMoreProjects(props.lastItemId)
    }

    const changeSearch = (e) => {
        setSearch(e.target.value)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        search ? props.getSearchResults(search) : props.getAllProjects()
    }

    return(
        <div className="container home-wrapper">

            <div className="select-finder"> 
                Search for...
                <label htmlFor="project">Projects</label>
                <input type="radio" name="select" id='project' checked />
                <label htmlFor="freelancer">Frelancers</label>
                <input type="radio" name="select" id='freelancer' />
            </div>

            <div className="search-wrap">
                <form onSubmit={handleSearch}>
                <input type="search" placeholder="Find projects..." className="search" onChange={changeSearch} />
                <button type="submit">Search</button>
                </form>
            </div>
           
            <div className="projects-wrapper">
            <div className="projects">
            {props.size ? <div><strong>{props.size}</strong> projects found</div> : null}
            {props.projects ? Object.entries(props.projects).map(([key, value], i) => 
            <NavLink to={"/project/" + key} key={i}>
            <div className="project-block">
                <div className="project-block__title"><h3>{value.title}</h3></div> 
                <div className="project-block__description">{value.description}</div> 
                <div className="project-price">{value.price} {value.currency}</div>
                <br/><br/>
                {value.createdAt ? new Date(Math.abs(value.createdAt)).toString() : null}
            </div>
            </NavLink>
            ): null}
            {props.lastItemId ? <button className="btn project-load_more" onClick={loadMore}>Load More</button> : null}
            </div>
            </div>
            
        </div>
    )
}

let mapStateToProps = (state) => {
    return {
        size: state.allProjects.size,
        projects: state.allProjects.projects,
        lastItemId: state.allProjects.lastItemId
    }
}


export default connect(mapStateToProps, {
    getAllProjects,
    getSearchResults,
    loadMoreProjects
})(Home);