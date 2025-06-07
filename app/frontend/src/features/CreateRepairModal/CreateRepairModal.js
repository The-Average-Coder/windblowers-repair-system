import { useEffect, useState } from 'react';

import ActionButton from '../../components/Buttons/ActionButton';
import ModalWindow from '../../components/Containers/ModalWindow';
import TextInput from '../../components/Inputs/TextInput';
import TextAreaInput from '../../components/Inputs/TextAreaInput';
import DropdownSelect from '../../components/Inputs/DropdownSelect';
import BlockTitle from '../../components/Text/BlockTitle';
import ModalTitle from '../../components/Text/ModalTitle';

import './CreateRepairModal.css';

import axios from 'axios';

function CreateRepairModal(props) {

    

    // #### DATA
    const [instrumentStatuses, setInstrumentStatuses] = useState([]);

    const instrumentTypeOptions = [
        {group: 'Flute Family', options: [
            {name: 'Flute', value: 'Flute'},
            {name: 'Piccolo', value: 'Piccolo'},
            {name: 'Alto Flute', value: 'Alto Flute'},
            {name: 'Bass Flute', value: 'Bass Flute'},
            {name: 'Flute (Other)', value: 'Flute (Other)'},
        ]},
        {group: 'Clarinet Family', options: [
            {name: 'B♭ Clarinet', value: 'B♭ Clarinet'},
            {name: 'A Clarinet', value: 'A Clarinet'},
            {name: 'E♭ Clarinet', value: 'E♭ Clarinet'},
            {name: 'Alto Clarinet', value: 'Alto Clarinet'},
            {name: 'Bass Clarinet', value: 'Bass Clarinet'},
            {name: 'Contrabass Clarinet', value: 'Contrabass Clarinet'},
            {name: 'Clarinet (Other)', value: 'Clarinet (Other)'},
        ]},
        {group: 'Saxophone Family', options: [
            {name: 'Soprano Saxophone', value: 'Soprano Saxophone'},
            {name: 'Alto Saxophone', value: 'Alto Saxophone'},
            {name: 'Tenor Saxophone', value: 'Tenor Saxophone'},
            {name: 'Baritone Saxophone', value: 'Baritone Saxophone'},
            {name: 'Bass Saxophone', value: 'Bass Saxophone'},
            {name: 'Saxophone (Other)', value: 'Saxophone (Other)'},
        ]},
        {group: 'Oboe Family', options: [
            {name: 'Oboe', value: 'Oboe'},
            {name: 'Cor Anglais', value: 'Cor Anglais'},
            {name: 'Oboe (Other)', value: 'Oboe (Other)'},
        ]},
        {group: 'Bassoon Family', options: [
            {name: 'Bassoon', value: 'Bassoon'},
            {name: 'Bassoon (Other)', value: 'Bassoon (Other)'}
        ]},
        {group: 'Recorder Family', options: [
            {name: 'Soprano Recorder', value: 'Soprano Recorder'},
            {name: 'Alto Recorder', value: 'Alto Recorder'},
            {name: 'Tenor Recorder', value: 'Tenor Recorder'},
            {name: 'Bass Recorder', value: 'Bass Recorder'},
            {name: 'Recorder (Other)', value: 'Recorder (Other)'},
        ]},
        {group: 'Brass Family', options: [
            {name: 'Trumpet', value: 'Trumpet'},
            {name: 'Cornet', value: 'Cornet'},
            {name: 'Trombone', value: 'Trombone'},
            {name: 'French Horn', value: 'French Horn'},
        ]},
        {name: 'Other', value: 'Other'}
    ]

    // #### DATABASE FETCH DATA
    useEffect(() => {
        axios.get('/api/settings/getInstrumentStatuses')
            .then(response => setInstrumentStatuses(response.data))
            .catch(error => console.log(error));
    }, [])

    // #### STATE VARIABLES
    const [customerSearch, setCustomerSearch] = useState('')
    const [customerSearchResults, setCustomerSearchResults] = useState(null);
    const [creatingNewCustomer, setCreatingNewCustomer] = useState(false);

    const [instrumentSearch, setInstrumentSearch] = useState('')
    const [instrumentSearchResults, setInstrumentSearchResults] = useState(null);
    const [creatingNewInstrument, setCreatingNewInstrument] = useState(false);

    const [customer, setCustomer] = useState({});
    const [inHouseCustomer, setInHouseCustomer] = useState(false);
    const [instrument, setInstrument] = useState({});
    const [notes, setNotes] = useState('');

    const [errorMessage, setErrorMessage] = useState('');


    // #### SEARCH FUNCTIONS
    const searchCustomer = (query) => {
        setCustomerSearch(query);
        setCustomerSearchResults(null);

        if (query.trim() === '') return;

        axios.get(`/api/customers/search/${query}`)
            .then(response => setCustomerSearchResults(response.data))
            .catch(error => console.log(error));
    }

    const searchInstrument = (query) => {
        setInstrumentSearch(query);
        setInstrumentSearchResults(null);

        if (query.trim() === '') return;

        axios.get(`/api/instruments/search/${query}`)
            .then(response => setInstrumentSearchResults(response.data))
            .catch(error => console.log(error));
    }


    // #### CREATE FUNCTIONS
    const createNewCustomer = () => {
        setInHouseCustomer(false);
        setCustomer({
            firstname: customerSearch.split(' ').length === 2 ? customerSearch.split(' ')[0] : '',
            surname: customerSearch.split(' ').length === 1 ? customerSearch.split(' ')[0] : customerSearch.split(' ').length === 2 ? customerSearch.split(' ')[1] : '',
            email: '',
            phone: '',
            address: '',
            status: 0
        });
        setCreatingNewCustomer(true);
    }
    const createNewInstrument = () => {
        setInstrument({
            type: '',
            manufacturer: '',
            model: '',
            serial_number: instrumentSearch,
            status: 0
        });
        setCreatingNewInstrument(true);
    }

    const createRepair = () => {
        if (!isValidRepair()) return;
        
        
    }

    const isValidRepair = () => {
        if (!inHouseCustomer) {
            if (customer.surname === undefined) {
                setErrorMessage('Customer required');
                return false;
            }
            if (customer.surname === '') {
                setErrorMessage('Customer surname required');
                return false;
            }
            if (customer.firstname === '') {
                setErrorMessage('Customer firstname required');
                return false;
            }
            if (customer.email === '' && customer.phone === '') {
                setErrorMessage('Customer contact method required');
                return false;
            }
        }
        
        if (instrument.serial_number === undefined) {
            setErrorMessage('Instrument required');
            return false;
        }
        if (instrument.serial_number.trim() === '') {
            setErrorMessage('Instrument serial number required');
            return false;
        }
        if (instrument.type.trim() === '') {
            setErrorMessage('Instrument type required');
            return false;
        }
        if (instrument.manufacturer.trim() === '') {
            setErrorMessage('Instrument manufacturer required');
            return false;
        }
        if (instrument.model.trim() === '') {
            setErrorMessage('Instrument model required');
            return false;
        }
        if (instrument.status_id === undefined) {
            setErrorMessage('Status required');
            return false;
        }

        setErrorMessage('');
        return true;
    }

    return (<ModalWindow className='CreateRepairWindow' closeFunction={props.closeFunction}>
        <ModalTitle>Create Repair</ModalTitle>
        <div className='details'>

            {/* Customer */}
            <div className='customer-details'>
                <BlockTitle>Customer</BlockTitle>

                {creatingNewCustomer ? <>

                {/* Create New Customer Form */}
                <div className='new-customer-name'>
                    <TextInput value={customer.firstname} onChange={(value) => setCustomer({...customer, firstname: value})} placeholder='Firstname' />
                    <TextInput value={customer.surname} onChange={(value) => setCustomer({...customer, surname: value})} placeholder='Surname' />
                </div>

                <div className='basic-info'>
                    <span>
                        <BlockTitle>Contact Information</BlockTitle>
                        <div className='text-inputs'>
                        <TextInput value={customer.email} onChange={(value) => setCustomer({...customer, email: value})} placeholder='Email' />
                        <TextInput value={customer.phone} onChange={(value) => setCustomer({...customer, phone: value})} placeholder='Phone Number' />
                        </div>
                    </span>

                    <div className='divider' />

                    <span>
                        <BlockTitle>Address</BlockTitle>
                        <div className='text-inputs'>
                        <TextAreaInput value={customer.address} onChange={(value) => setCustomer({...customer, address: value})} placeholder='Address' />
                        </div>
                    </span>

                </div>

                </> :

                customer.id ? <>
                <p>{customer.firstname} {customer.surname}</p>
                <p>{customer.telephone}</p>
                <p>{customer.email}</p>
                <p>{customer.address}</p>
                </>
                
                : <>

                {/* Search Customer */}
                <TextInput className='name-search' value={customerSearch} onChange={searchCustomer} placeholder='Search Name' />
                <input className='in-house-repair-checkbox' type='checkbox' onChange={(e) => setInHouseCustomer(e.target.checked)} /><label>In House Repair</label>
                
                {/* Search Loading */}
                {customerSearch && !customerSearchResults && !inHouseCustomer && <>
                    <p className='search-results'>Loading</p>
                </>}

                {/* Search Results */}
                {customerSearchResults && !inHouseCustomer && <>

                    <div className='search-results'>
                    {customerSearchResults.length > 0 ? customerSearchResults.map(customer => 
                        <div className='search-result' onClick={() => setCustomer(customer)}>
                            <div className='details-flex-container'>
                                <p className='name'>{customer.firstname} {customer.surname}</p>
                                {customer.telephone && <p className='telephone'>{customer.telephone}</p>}
                                {customer.email && <p className='email'>{customer.email}</p>}
                                <div className='blankspace' />
                            </div>
                        </div>
                    )
                    : 'No Results Found'}
                    </div>

                    <ActionButton className='create-new-customer-button' onClick={createNewCustomer}>Create New Customer</ActionButton>
                </>}

                </>}
                

            </div>

            {/* Instrument */}
            {(customer.surname !== undefined || inHouseCustomer) && <div className='instrument-details'>
                <BlockTitle>Instrument</BlockTitle>

                {creatingNewInstrument ? <>
                <TextInput value={instrument.serial_number} onChange={(value) => setInstrument({...instrument, serial_number: value})} placeholder='Serial Number' />

                <div className='basic-info'>
                    <span>
                        <BlockTitle>Model</BlockTitle>
                        <div className='text-inputs'>
                            <DropdownSelect value={instrument.type} onChange={(value) => setInstrument({...instrument, type: value})} options={instrumentTypeOptions} placeholder='Instrument Type' />
                            <TextInput value={instrument.manufacturer} onChange={(value) => setInstrument({...instrument, manufacturer: value})} placeholder='Manufacturer' />
                            <TextInput value={instrument.model} onChange={(value) => setInstrument({...instrument, model: value})} placeholder='Model' />
                        </div>
                    </span>

                    <div className='divider' />

                    <span>
                        <BlockTitle>Status</BlockTitle>
                        <div className='text-inputs'>
                            <DropdownSelect value={instrument.status_id} onChange={(value) => setInstrument({...instrument, status_id: value})} options={instrumentStatuses.map(status => {return {name: status.status, value: status.id}})} placeholder='Status' />
                        </div>
                    </span>

                </div>

                </> :
                
                instrument.serial_number ? <>
                <p>{instrument.serial_number}</p>
                <p>{instrument.type}</p>
                <p>{instrument.manufacturer} {instrument.model}</p>
                <DropdownSelect value={instrument.status_id} onChange={(value) => setInstrument({...instrument, status_id: value})} options={instrumentStatuses.map(status => {return {name: status.status, value: status.id}})} placeholder='Status' />
                </>
                
                : <>

                {/* Search Instrument */}
                <TextInput className='serial-number-search' value={instrumentSearch} onChange={searchInstrument} placeholder='Search Serial Number' />
                
                {/* Search Loading */}
                {instrumentSearch && !instrumentSearchResults && <>
                    <p className='search-results'>Loading</p>
                </>}

                {/* Search Results */}
                {instrumentSearchResults && <>

                <div className='search-results'>
                    {instrumentSearchResults.length > 0 ? instrumentSearchResults.map(instrument => 
                        <div className='search-result' onClick={() => setInstrument(instrument)}>
                            <div className='details-flex-container'>
                                <p className='serial-number'>{instrument.serial_number}</p>
                                <p className='type'>{instrument.type}</p>
                                <p className='instrument'>{instrument.manufacturer} {instrument.model}</p>
                                <div className='blankspace' />
                            </div>
                        </div>
                    )
                    : 'No Results Found'}
                </div>

                <ActionButton className='create-new-instrument-button' onClick={createNewInstrument}>Create New Instrument</ActionButton>
                </>}

                </>}
            </div>}

            {/* Job Type and Notes */}
            {instrument.serial_number !== undefined && (customer.surname !== undefined || inHouseCustomer) ? <div className='notes'>
                <BlockTitle>Job Type and Notes</BlockTitle>
                <DropdownSelect options={[]} placeholder='Job Type' />
                <TextAreaInput value={notes} onChange={setNotes} placeholder='Notes' />
            </div> : null}

        </div>

        <p className='error-message'>{errorMessage}</p>

        <div className='buttons'>
            <ActionButton onClick={props.closeFunction}>Cancel</ActionButton>
            <ActionButton onClick={createRepair} colored='true'>Create</ActionButton>
        </div>
    </ModalWindow>);
}

export default CreateRepairModal;