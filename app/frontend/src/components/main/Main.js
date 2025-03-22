import { Routes, Route } from 'react-router-dom';

import Repair from './Repair/Repair';
import Calendar from './Calendar/Calendar';
import Settings from './Settings/Settings';

import './Main.css';

function Main() {
    return (
        <div className='Main'>

            <Routes>

                <Route path='/' element={<Calendar />} />
                <Route path='/repair/:id' element={<Repair />} />
                <Route path='/settings' element={<Settings />} />

            </Routes>
            
        </div>
    );
}

export default Main;