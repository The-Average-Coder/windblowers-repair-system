import { Routes, Route } from 'react-router-dom';

import Header from './pages/Header/Header';
import Calendar from './pages/Calendar/Calendar';
import Repair from './pages/Repair/Repair';
import Settings from './features/Settings/Settings';

import eventBus from './utils/eventBus';

import './App.css';

function App() {

  // Emit event when site is clicked so popovers can close
  const emitClickEvent = () => {
    eventBus.emit('click');
  }

  return (
    <div className='App' onClick={emitClickEvent}>

      <Header />

      <div className='page'>

        <Routes>

            <Route path='/' element={<Calendar />} />
            <Route path='/repair/:id' element={<Repair />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/search_results/:query' element={<p>search results</p>} />

        </Routes>

      </div>

    </div>
  );
}

export default App;
