import { Routes, Route } from 'react-router-dom';

import Dashboard from './dashboard/Dashboard';
import Repairs from './repairs/Repairs';
import Repair from './repairs/repair/Repair';
import Calendar from './calendar/Calendar';
import Customer from './customer/Customer';
import Instrument from './instrument/Instrument';
import SearchResults from './search_results/SearchResults';
import Settings from './settings/Settings';

function Main(props) {
    return (
    <div className='main'>
        <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/repairs' element={<Repairs />} />
            <Route path='/repairs/repair/:id' element={<Repair />} />
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/customer/:id' element={<Customer />} />
            <Route path='/instrument/:id' element={<Instrument />} />
            <Route path='/search/:query' element={<SearchResults />} />
            <Route path='/settings' element={<Settings logout={props.logout} />} />
        </Routes>
    </div>
    );
}

export default Main;