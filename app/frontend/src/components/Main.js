import { Routes, Route } from 'react-router-dom';

import Dashboard from './dashboard/Dashboard'

function Main() {
    return (
    <div className='main'>
        <Routes>
            <Route path='/' element={<Dashboard />} />
        </Routes>
    </div>
    );
}

export default Main;