import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadCustomer, unloadCustomer, editCustomer } from '../../../reducers/customers/customersSlice';
import axios from 'axios';

import PageTitle from '../../common/PageTitle';
import ActionButton from '../../common/ActionButton';
import BlockTitle from '../../common/BlockTitle';

function Customer() {
    const { id } = useParams()

    const [customer, setCustomer] = useState(null);

    const [editMode, setEditMode] = useState(false);

    const [firstname, setFirstname] = useState('');
    const [surname, setSurname] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    const [repairHistory, setRepairHistory] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const customersLoading = useSelector(state => {
        return state.activeCustomers.customersLoading;
    });

    const loadingCustomer = useSelector(state => {
        return state.activeCustomers.loadingCustomer;
    })

    const activeCustomer = useSelector(state => {
        const customer = state.activeCustomers.activeCustomers.find(customer => customer.id === id);
        return customer ? customer : null;
    });

    const loadedCustomer = useSelector(state => {
        const loadedCustomer = state.activeCustomers.loadedCustomer;
        return loadedCustomer ? loadedCustomer : null;
    })

    useEffect(() => {
        setCustomer(activeCustomer)
    }, [activeCustomer])

    useEffect(() => {
        if (!customersLoading && activeCustomer === null) {
            dispatch(loadCustomer(id))
        }
        else {
            setCustomer(activeCustomer);
        }
    }, [customersLoading])

    useEffect(() => {
        if (loadedCustomer) setCustomer(loadedCustomer);
    }, [loadingCustomer, loadedCustomer])

    useEffect(() => {
        if (customer === null) return;
        axios.get(`/api/repairs/getRepairsOfCustomer/${customer.id}`).then(resp => {
            setRepairHistory(resp.data);
        })
        if (customer.firstname === '' && !editMode) {
            toggleEditCustomer();
        }
    }, [customer])

    useEffect(() => {
        return  () => {
            dispatch(unloadCustomer());
        }
    }, [])

    const statusColours = ['red', 'orange', 'limegreen', 'darkgrey'];

    const renderedRepairHistory = repairHistory ? repairHistory.map(repair => {
        return (
            <div className='history-list-repair' onClick={() => navigate(`/repairs/repair/${repair.id}`)}>

                <div className='status' style={{backgroundColor: statusColours[repair.status]}} />
                <p className='instrument-type'>{repair.instrument_id !== -1 ? repair.type : 'No Instrument'}</p>
                <p className='instrument-model'>{repair.instrument_id !== -1 ? repair.manufacturer : null} {repair.instrument_id !== -1 ? repair.model : null}</p>
                <p className='instrument-serial'>{repair.instrument_id !== -1 ? repair.serial_number : null}</p>
                <p className='job-number'>{repair.id}</p>
                <p className='date-created'>Created: {repair.date_created}</p>
                <p className='deadline'>Deadline: {repair.deadline !== null ? repair.deadline : 'Not Set'}</p>

            </div>
        );
    }) : null;

    const toggleEditCustomer = () => {
        if (editMode) {
            setFirstname('');
            setSurname('');
            setTelephone('');
            setEmail('');
            setAddress('');
        }
        else {
            setFirstname(customer.firstname);
            setSurname(customer.surname);
            setTelephone(customer.telephone);
            setEmail(customer.email);
            setAddress(customer.address);
        }
        setEditMode(!editMode)
    };

    const saveEdit = () => {
        dispatch(editCustomer({ id: id, firstname: firstname, surname: surname, telephone: telephone, email: email, address: address }));
        toggleEditCustomer();
    };

    const deleteCustomer = () => {
        alert('Not Yet Implemented')
    }

    return (
        <div className='customer-page'>
            <div className='title'>
                <PageTitle title={customer === null ? 'Error' : `${customer.firstname} ${customer.surname}`} />
                {customer ? <>
                <div className='action-buttons'>
                    <ActionButton onClick={deleteCustomer} className='delete-customer' contents='Delete Customer' />
                </div>
                </> : null }
            </div>
            
            <div className='customer-info'>
                <div className='customer-info-box'>
                    <BlockTitle title='Info' />
                    {editMode ? 
                    <>
                    <label className='firstname-label'>Firstname: </label><input type='text' value={firstname} onChange={(e) => setFirstname(e.target.value)} /><br />
                    <label className='surname-label'>Surname: </label><input type='text' value={surname} onChange={(e) => setSurname(e.target.value)} /><br />
                    <label className='email-label'>Email: </label><input className='wide' type='text' value={email} onChange={(e) => setEmail(e.target.value)} /><br />
                    <label className='telephone-label'>Telephone: </label><input className='wide' type='text' value={telephone} onChange={(e) => setTelephone(e.target.value)} /><br />
                    <label className='address-label'>Address: </label><textarea value={address} onChange={(e) => setAddress(e.target.value)} /><br />

                    <div className='buttons-holder'>
                        <ActionButton contents={'Cancel'} onClick={toggleEditCustomer} />
                        <ActionButton contents={'Save'} onClick={saveEdit} />
                    </div>
                    </>
                    :

                    customersLoading || loadingCustomer ? <div className='customer-error-message'>Loading...</div> :

                    customer === null ? <div className='customer-error-message'>Customer doesn't exist.</div> : 

                    <>
                    <p className='customer-name'>{customer.firstname} {customer.surname}</p>
                    <p className='customer-detail'>{customer.telephone}</p>
                    <p className='customer-detail'>{customer.email}</p>
                    <p className='customer-detail'>{customer.address}</p>

                    <div className='buttons-holder'>
                        <ActionButton contents={'Edit Customer'} onClick={toggleEditCustomer} />
                    </div>
                    </>

                    }
                </div>
            </div>

            <div className='customer-repairs-history'>
                <BlockTitle title='Repair History' />
                {renderedRepairHistory}
            </div>

            <div>

            </div>
        </div>
    );
}

export default Customer;