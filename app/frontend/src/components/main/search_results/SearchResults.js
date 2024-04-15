import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import PageTitle from '../../common/PageTitle';
import RepairListRepair from '../repairs/RepairListRepair';
import CustomerListCustomer from './CustomerListCustomer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InstrumentListInstrument from './InstrumentListInstrument';

function SearchResults() {
    const { query } = useParams();

    const [renderedRepairs, setRenderedRepairs] = useState([]);
    const [renderedCustomers, setRenderedCustomers] = useState([]);
    const [renderedInstruments, setRenderedInstruments] = useState([]);

    useEffect(() => {
        setRenderedRepairs([]);
        setRenderedCustomers([]);
        setRenderedInstruments([]);
        axios.post('/api/repairs/searchRepairs', { searchTerms: JSON.stringify(query.split(' ')) }).then(resp => {
            setRenderedRepairs(resp.data.map(repair => {
                const customer = { firstname: repair.firstname, surname: repair.surname }
                const instrument = { type: repair.type, manufacturer: repair.manufacturer, model: repair.model, serial_number: repair.serial_number }
                return <RepairListRepair repair={repair} customer={customer} instrument={instrument} />
            }))
        });
        axios.post('/api/customers/searchCustomers', { searchTerms: JSON.stringify(query.split(' ')) }).then(resp => {
            setRenderedCustomers(resp.data.map(customer => {
                return <CustomerListCustomer customer={customer} />
            }))
        });
        axios.post('/api/instruments/searchInstruments', { searchTerms: JSON.stringify(query.split(' ')) }).then(resp => {
            setRenderedInstruments(resp.data.map(instrument => {
                return <InstrumentListInstrument instrument={instrument} />
            }))
        });
    }, [query])

    return (
        <div className='search-results'>
            <PageTitle title={`Results For '${query}'`} />

            
            {renderedRepairs.length !== 0 ? 
            <div className='repair-list'>
                <div className='column-header'>
                    <FontAwesomeIcon icon='fa-solid fa-circle-check' className='fa-icon' />
                    <p className='instrument'>Instrument</p>
                    <p className='repair-info'>Repair Info</p>
                    <p className='customer'>Customer</p>
                </div>
                {renderedRepairs}
            </div>
            : null }

            {renderedCustomers.length !== 0 ?
            <div className='customer-list'>
                
                <div className='column-header'>
                    <p className='name'>Name</p>
                    <p className='info'>Info</p>
                </div>

                {renderedCustomers}

            </div>
            : null }

            {renderedInstruments.length !== 0 ?
            <div className='customer-list'>
                
                <div className='column-header'>
                    <p className='instrument'>Instrument</p>
                    <p className='serial'>Serial</p>
                </div>

                {renderedInstruments}

            </div>
            : null }
            
        </div>
    );
}

export default SearchResults;