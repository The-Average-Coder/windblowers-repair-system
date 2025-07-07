import { useState, useRef } from 'react';

import SearchPopup from './SearchPopup';

import './SearchBar.css';

import repairStatuses from '../../../enums/repairStatuses';

function SearchBar() {

    const [query, setQuery] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const inputRef = useRef();
    const [timeoutId, setTimeoutId] = useState();

    // Simulated data
    const [recentSearches, setRecentSearches] = useState({
        repairs: [],
        customers: [],
        instruments: []
    });
    const allResults = {
        repairs: [
            {
                id: 2508004,
                status: repairStatuses.OPEN,
                instrument: {
                    type: 'Flute',
                    manufacturer: 'Pearl',
                    model: '505',
                    serial_number: 'ABC123',
                    status: 1,
                },
                customer: {
                    firstname: 'Josh',
                    surname: 'Cox',
                    email: 'joshuajosephcox@gmail.com',
                    phone: '07796593187',
                    address: '10 Cross Hill Close, LE12 6UJ'
                },
            },
            {
                id: 2509002,
                status: repairStatuses.OPEN,
                customer: {
                    firstname: 'Richard',
                    surname: 'Cox',
                    email: 'richardphilipcox@gmail.com',
                    phone: '07740300368',
                    address: '10 Cross Hill Close, LE12 6UJ'
                },
                instrument: {
                    type: 'Alto Saxophone',
                    manufacturer: 'Yamaha',
                    model: 'YAS-280',
                    serial_number: 'DEF456',
                    status: 1,
                }
            }
        ],
        customers: [
            {
                firstname: 'Josh',
                surname: 'Cox',
                email: 'joshuajosephcox@gmail.com',
                phone: '07796593187',
                address: '10 Cross Hill Close, LE12 6UJ'
            },
            {
                firstname: 'Richard',
                surname: 'Cox',
                email: 'richardphilipcox@gmail.com',
                phone: '07740300368',
                address: '10 Cross Hill Close, LE12 6UJ'
            }
        ]
    };

    const filteredResults = query.trim() ? {
        repairs: allResults.repairs,
        customers: allResults.customers
    } : { repairs: [], customers: [] };

    return (<div className='SearchBar'>
        <input list='suggested-search-results' type='text' placeholder='Search' value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setShowPopup(true)} onBlur={() => setTimeoutId(setTimeout(() => setShowPopup(false), 100))} ref={inputRef} />

        {showPopup && <SearchPopup query={query} results={filteredResults} recentSearches={recentSearches} onClick={() => {clearTimeout(timeoutId);inputRef.current.focus()}} />}
    </div>
    );
}

export default SearchBar;