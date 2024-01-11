import { Routes, Route } from 'react-router-dom';

import Dashboard from './dashboard/Dashboard';
import Repairs from './repairs/Repairs';
import Calendar from './calendar/Calendar';
import Customers from './customers/Customers';
import Settings from './settings/Settings';

function Main() {
    return (
    <div className='main'>
        <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/repairs' element={<Repairs />} />
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/customers' element={<Customers />} />
            <Route path='/settings' element={<Settings />} />
        </Routes>
    </div>
    );
}

export default Main;