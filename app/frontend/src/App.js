import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/Login/LoginPage';

import Header from './pages/Header/Header';
import Calendar from './pages/Calendar/Calendar';
import Repair from './pages/Repair/Repair';

import eventBus from './utils/eventBus';

import './App.css';

import axios from 'axios';

function App() {

  // #### STATE VARIABLES
  const [loggedIn, setLoggedIn] = useState(false);


  // #### MISCELLANEOUS INITIALISATION
  const navigate = useNavigate();


  // Emit event when site is clicked so popovers can close
  const emitClickEvent = () => {
    eventBus.emit('click');
  }

  // #### AUTHENTICATION
  const readCookie = () => {
    axios.get('/read-cookie').then((response) => {
      if (response.data === 'user') {
        setLoggedIn(true);
      }
    });
  }

  function login() {
    setLoggedIn(true);
  }

  function logout() {
    axios.get('/clear-cookie').then((response) => {
      setLoggedIn(false);
      navigate('/')
    })
  }

  useEffect(() => {
    readCookie();
    
    eventBus.on('logout', logout);
    return () => eventBus.off('logout', logout);
  }, [])

  return (
    <div className='App' onClick={emitClickEvent}>

      {loggedIn ? <>

      <Header />

      <div className='page'>

        <Routes>

            <Route path='/' element={<Calendar />} />
            <Route path='/repair/:id' element={<Repair />} />
            <Route path='/search_results/:query' element={<p>search results</p>} />

        </Routes>

      </div>

      </> : <LoginPage login={login} />}

    </div>
  );
}

export default App;
