import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'

import SearchPopup from './SearchPopup';

import CustomerModal from '../../../features/CustomerModal/CustomerModal';
import InstrumentModal from '../../../features/InstrumentModal/InstrumentModal';

import './SearchBar.css';

import axios from 'axios';

function SearchBar() {

    // #### STATE VARIABLES
    const [recentSearches, setRecentSearches] = useState([]);

    const [repairResults, setRepairResults] = useState([]);
    const [customerResults, setCustomerResults] = useState([]);
    const [instrumentResults, setInstrumentResults] = useState([]);

    const [query, setQuery] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const inputRef = useRef();
    const [timeoutId, setTimeoutId] = useState();

    const [selectedCustomer, setSelectedCustomer] = useState({});
    const [selectedInstrument, setSelectedInstrument] = useState({});


    // #### MISCELLANEOUS INITIALISATION
    const navigate = useNavigate()


    // #### SEARCH FUNCTIONS
    async function searchQuery(query) {
        setQuery(query);
        setShowPopup(true)

        if (query.trim() === '') return;

        await axios.get(`/api/repairs/search/${query.trim()}`)
            .then(response => {
                setRepairResults(response.data || []);
            })
            .catch(error => console.log(error));
        
        await axios.get(`/api/customers/search/${query.trim()}`)
            .then(response => {
                setCustomerResults(response.data || []);
            })
            .catch(error => console.log(error));
        
        await axios.get(`/api/instruments/search/${query.trim()}`)
            .then(response => {
                setInstrumentResults(response.data || []);
            })
            .catch(error => console.log(error));
    }

    const selectResult = (result) => {
        setQuery('');
        
        setRecentSearches([result, ...recentSearches.filter(search => search.type !== result.type || search.id !== result.id)]);

        if (result.type === 'repair') {
            navigate(`/repair/${result.id}`);
        }

        else if (result.type === 'customer') {
            axios.get(`/api/customers/get/${result.id}`)
                .then(response => setSelectedCustomer(response.data))
                .catch(error => console.log(error));
        }

        else if (result.type === 'instrument') {
            axios.get(`/api/instruments/get/${result.id}`)
                .then(response => setSelectedInstrument(response.data))
                .catch(error => console.log(error));
        }

        setTimeoutId(setTimeout(() => setShowPopup(false), 100));
    }

    return (<div className='SearchBar'>
        <input className='search-bar' list='suggested-search-results' type='text' placeholder='Search' value={query} onChange={(e) => searchQuery(e.target.value)} onFocus={() => setShowPopup(true)} onBlur={() => setTimeoutId(setTimeout(() => setShowPopup(false), 200))} ref={inputRef} />

        {showPopup && <SearchPopup query={query} repairResults={repairResults} customerResults={customerResults} instrumentResults={instrumentResults} recentSearches={recentSearches} onClick={() => {clearTimeout(timeoutId)}} selectResult={selectResult} />}
    
        {selectedCustomer.id && <CustomerModal customer={selectedCustomer} closeFunction={() => setSelectedCustomer({})} updateCustomer={setSelectedCustomer} />}
        {selectedInstrument.id && <InstrumentModal instrument={selectedInstrument} closeFunction={() => setSelectedInstrument({})} updateInstrument={setSelectedInstrument} />}
    </div>
    );
}

export default SearchBar;