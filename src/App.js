import React from 'react';
import logo from './logo.svg';
import { BrowserRouter, Route, Link } from "react-router-dom";
import './App.scss';
import Home from './Components/home/Home';
import Login from './Components/auth/Login';
import Register from './Components/auth/Register';
import AddProject from './Components/addProject/AddProject'
import ProjectDetail from './Components/projectDetail/ProjectDetail'
import Sidebar from './Components/sidebar/Sidebar';
import Logo from './Components/logo/Logo';
import Messages from './Components/messages/Messages';
import Dialog from './Components/messages/Dialog';


const App = () => {  

return (
  <BrowserRouter>
    <Sidebar />
    <div className="main">
    <Logo />
    <Route exact path="/" component={Home} />
    <Route exact path="/login" component={Login}/>
    <Route exact path="/project/:projectId?" component={ProjectDetail}/>
    <Route exact path="/register" component={Register} />
    <Route exact path="/add-project" component={AddProject} />
    <Route exact path="/messages" component={Messages} />
    <Route exact path="/message/:dialogId?" component={Dialog} />
    </div>
  </BrowserRouter>
)
  
}

export default App;
