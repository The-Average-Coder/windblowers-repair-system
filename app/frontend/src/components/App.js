import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faHouse, faTasks, faUsers, faGear, faList, faCalendar, faCircleCheck,
  faCirclePlay, faCirclePause, faRotateLeft, faUserCircle, faPlusCircle, faExpandAlt,
  faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import Header from './header/Header';
import Navbar from './navbar/Navbar';
import Main from './main/Main';
import Login from './login/Login';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchActiveRepairs } from '../reducers/repairs/repairsSlice';
import { fetchActiveCustomers } from '../reducers/customers/customersSlice';
import { fetchActiveInstruments } from '../reducers/instruments/instrumentsSlice';
import { fetchActiveAssessments } from '../reducers/repairs/repairsSlice';
import { fetchRepairers } from '../reducers/repairers/repairersSlice';
import { fetchActivity } from '../reducers/activity/activitySlice';
import { fetchRecentCalendarEvents } from '../reducers/calendar_events/calendarEventsSlice';

library.add(faPlus, faHouse, faTasks, faUsers, faGear, faList, faCalendar, faCircleCheck,
  faCirclePlay, faCirclePause, faRotateLeft, faUserCircle, faPlusCircle, faExpandAlt,
  faCaretUp, faCaretDown);

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    readCookie();
  }, [])

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
    if (!loggedIn) return;
    dispatch(fetchActiveRepairs());
    dispatch(fetchActiveCustomers());
    dispatch(fetchActiveInstruments());
    dispatch(fetchActiveAssessments());
    dispatch(fetchRepairers());
    dispatch(fetchActivity());
    dispatch(fetchRecentCalendarEvents());
  }, [loggedIn])

  return (
  <div className='app'>
    {loggedIn ? <>
      <Header />
      <div className='body'>
        <Navbar />
        <Main logout={logout} />
      </div>
    </> :
    <Login login={login} />
    }
  </div>
  );
}

export default App;
