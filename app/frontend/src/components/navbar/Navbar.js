import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createRepair as createRepairAction } from '../../reducers/repairs/repairsSlice';
import { createCustomer as createCustomerAction } from '../../reducers/customers/customersSlice';
import { createInstrument as createInstrumentAction } from '../../reducers/instruments/instrumentsSlice';
import axios from 'axios';
import moment from 'moment';

import GradientButton from './GradientButton';
import NavbarMenu from './NavbarMenu';

function Navbar() {
    const [newMenuActive, setNewMenuActive] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleNewMenu = () => {
        setNewMenuActive(1 - newMenuActive);
    }

    const getDate = () => {
        const date = new Date();
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    }

    const getNextRepairId = (previousId) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear().toString().slice(2);
        const currentWeek = moment(currentDate).format('W').toString().padStart(2, '0');

        const weekCode = currentYear + currentWeek;
        
        if (previousId && previousId.length >= 4) {
        const lastWeekCode = previousId.slice(0, 4);

        if (weekCode === lastWeekCode) {
            const previousJobCode = parseInt(previousId.slice(4));
            const currentJobCode = ('00' + (previousJobCode + 1).toString()).slice(-3);
            const currentJobNumber = weekCode + currentJobCode;
            return currentJobNumber;
        }
        }

        const currentJobCode = '001';
        const currentJobNumber = (weekCode + currentJobCode).toString();

        return currentJobNumber;
    }

    const createRepair = () => {
        axios.get('/api/repairs/getLastRepairId').then(resp => {
            const repairId = getNextRepairId(resp.data[0].maxId);
            dispatch(createRepairAction({ id: repairId, date_created: getDate() }));
            navigate(`/repairs/repair/${repairId}`);
            toggleNewMenu();
        })
    }

    const createCustomer = () => {
        dispatch(createCustomerAction({ firstname: '', surname: '', telephone: '', email: '', address: '' })).then((resp) => {
            navigate(`/customer/${resp.payload}`);

        });
    }

    const createInstrument = () => {
        dispatch(createInstrumentAction({ type: '', manufacturer: '', model: '', serial_number: '' })).then((resp) => {
            navigate(`/instrument/${resp.payload}`);
        });
    }

    return (
        <div className='navbar'>

            <GradientButton contents={<><FontAwesomeIcon icon='fa-solid fa-plus' className='fa-icon' /> Add New</>} onClick={toggleNewMenu} />
            {newMenuActive ? 
            <div className='add-new-menu'>
                <button onClick={createRepair}>Repair</button>
                <button onClick={createCustomer}>Customer</button>
                <button onClick={createInstrument} style={{borderBottom: 'none'}}>Instrument</button>
            </div>
            : null}

            <NavbarMenu />

        </div>
    );
}

export default Navbar;