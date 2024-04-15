import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createCustomerOnRepair, editCustomer, loadCustomer } from '../../../../reducers/customers/customersSlice';
import { addCustomer, removeCustomer as removeCustomerAction } from '../../../../reducers/repairs/repairsSlice';
import axios from 'axios';

import ActionButton from '../../../common/ActionButton';
import BlockTitle from '../../../common/BlockTitle';

function RepairCustomer(props) {
    const [customer, setCustomer] = useState(null);

    const [editMode, setEditMode] = useState(false);

    const [firstname, setFirstname] = useState('');
    const [surname, setSurname] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    const [searchMode, setSearchMode] = useState(false);

    const [searchValue, setSearchValue] = useState('')
    const [searchedCustomers, setSearchedCustomers] = useState();
    const [selectedCustomer, setSelectedCustomer] = useState();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const customersLoading = useSelector(state => {
        return state.activeCustomers.customersLoading;
    });

    const loadingCustomer = useSelector(state => {
        return state.activeCustomers.loadingCustomer;
    })

    const activeCustomer = useSelector(state => {
        const customer = state.activeCustomers.activeCustomers.find(customer => customer.id === props.id);
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
            dispatch(loadCustomer(props.id))
        }
        else {
            setCustomer(activeCustomer);
        }
    }, [customersLoading])

    useEffect(() => {
        if (loadedCustomer) setCustomer(loadedCustomer);
    }, [loadingCustomer, loadedCustomer])

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
        if (props.id === -1) {
            dispatch(createCustomerOnRepair({ repair_id: props.repairId, customer:
                { firstname: firstname, surname: surname, email: email, telephone: telephone, address: address } }))
        }
        else {
            dispatch(editCustomer({ id: props.id, firstname: firstname, surname: surname, telephone: telephone, email: email, address: address }));
        }
        toggleEditCustomer();
    };

    const removeCustomer = () => {
        dispatch(removeCustomerAction(props.repairId));
    };

    const createNewCustomer = () => {
        setFirstname('');
        setSurname('');
        setTelephone('');
        setEmail('');
        setAddress('');
        setEditMode(true);
    }

    const toggleSearchCustomer = () => {
        setSearchMode(!searchMode);
        setSearchedCustomers([]);
        setSelectedCustomer(0);
        setSearchValue('');
    }

    const setSearch = (searchTerms) => {
        setSearchValue(searchTerms);
        setSearchedCustomers([]);
        if (searchTerms.length > 0)
            axios.post('/api/customers/searchCustomers', { searchTerms: JSON.stringify(searchTerms.split(' ')) }).then(resp => setSearchedCustomers(resp.data))
    }

    const submitSearch = () => {
        dispatch(addCustomer({ id: props.repairId, customer_id: selectedCustomer }))
        toggleSearchCustomer();
    }

    return (
        <div className='repair-customer'>
            <div className='customer-box'>
            <BlockTitle title='Customer' />
                {

                searchMode ?
                <>
                <input type='text' className='customer-search' placeholder='Search...' value={searchValue} onChange={(e) => setSearch(e.target.value)} /><br />
                
                <div className='search-results'>
                    {searchedCustomers ? searchedCustomers.map(customer => {
                        return (
                            <div className={`customer-result ${selectedCustomer === customer.id ? 'selected': ''}`} onClick={() => {setSelectedCustomer(customer.id)}}>
                                <p className='name'>{customer.firstname} {customer.surname}</p>
                                <p className='email'>{customer.email}</p>
                            </div>
                        )
                    }) : null}
                </div>

                <div className='buttons-holder'>
                    <ActionButton contents={'Cancel'} onClick={toggleSearchCustomer} />
                    <ActionButton contents={'Save'} onClick={submitSearch} />
                </div>
                </>
                :

                editMode ? 
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
                
                props.id === -1 ? 
                <div className='no-customer-buttons'>
                    <ActionButton onClick={toggleSearchCustomer} contents={<><FontAwesomeIcon icon='fas fa-user-circle' className='fa-icon' /> Add Existing Customer</>} />
                    <ActionButton onClick={createNewCustomer} contents={<><FontAwesomeIcon icon='fas fa-plus-circle' className='fa-icon' /> Create New Customer</>} />
                </div>
                :

                customersLoading || loadingCustomer ? <div className='customer-error-message'>Loading...</div> :

                customer === null ? <div className='customer-error-message'>Customer Deleted</div> : 
            
                
                <>
                <p className='customer-name'>{customer.firstname} {customer.surname}</p>
                <p className='customer-detail'>{customer.telephone}</p>
                <p className='customer-detail'>{customer.email}</p>
                <p className='customer-detail'>{customer.address}</p>

                <div className='buttons-holder'>
                    <ActionButton contents={'Edit Customer'} onClick={toggleEditCustomer} />
                    <ActionButton contents={'Remove Customer'} onClick={removeCustomer} />
                </div>

                <FontAwesomeIcon icon="fas fa-expand-alt" className='expand-button' onClick={() => {navigate(`/customer/${props.id}`)}} />
                </>
                

                }
            </div>
        </div>
    );
}

export default RepairCustomer;