import React, {useState} from 'react';
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
import DialogWindow from './Components/messages/DialogWindow';
import Splash from './Components/splash/Splash';
import Contacts from './Components/contacts/Contacts';
import Video from './Components/video/Video';
import Header from './Components/header/Header';

const App = () => {  

  const [password, setPassword] = useState(null)
  const [checkPassword, setCheckPassword] = useState(true)
  const [wrong, setWrong] = useState(false)
  const [pass, setPass] = useState(false)
  const [close, setClose] = useState(false)

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  const closePasswordPage = () => {
    setTimeout(() => {
      setClose(true)
    }, 1000);

    setTimeout(() => {
      setCheckPassword(true)
    }, 3000);
  }

  const handleCheckPassword = (e) => {
    if (password === 'perfectpassword123') {
      setPass(true)
      closePasswordPage()
    } else {
      setWrong(true)
    }
  }

return (
  <BrowserRouter>
    {checkPassword ? null : 
    <div className={"password_page " + (close && 'close')}>
        <div className="password">
            <h1>Enter the website using password</h1>
            <div className={pass && 'pass'}>
                <input className={wrong && 'wrong'} onChange={handlePassword} type="password"/>
                <button onClick={handleCheckPassword}>Enter</button>
            </div>
        </div>
    </div>
    }
    {checkPassword ? 
    <>
    <Splash /> 
    <Video />

    <Header />
    <div className="wrapper">
    <Sidebar />
    <div className="main">
    <Route exact path="/" component={Home} />
    <Route exact path="/login" component={Login}/>
    <Route exact path="/project/:projectId?" component={ProjectDetail}/>
    <Route exact path="/register" component={Register} />
    <Route exact path="/add-project" component={AddProject} />
    {/* <Route exact path="/messages" component={Messages} /> */}
    <Route exact path="/message/:dialogId?" component={DialogWindow} />
    <Route exact path="/contacts" component={Contacts} />
    </div>

    {/* <Route exact path="/video" component={Video} /> */}
  
    </div>
    </> : null }
  </BrowserRouter>
)
  
}

export default App;
