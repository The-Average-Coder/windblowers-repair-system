import { useEffect, useState, useRef } from 'react';

import './SearchPopup.css';

function SearchPopup(props) {

    const [filters, setFilters] = useState({
        type: 'Repair', // 'repair' or 'customer'
        status: 'Open', // 'assessment', 'open', etc.
        instrument: 'Flute',
    });

    const [focusedIndex, setFocusedIndex] = useState(0);
    const itemsRef = useRef([]);

    const hasQuery = props.query.trim() !== "";

    const repairResults = (props.results.repairs || []).map(r => ({ type: "repair", label: `Repair ${r.id} ${r.instrument.serial_number}` }))
    const customerResults = (props.results.customers || []).map(c => ({ type: "customer", label: `Customer ${c.firstname} ${c.surname}` }))
    const combinedResults = [...repairResults, ...customerResults];

    const recentSearches = [
        ...(props.recentSearches.repairs || []).map(r => ({ type: "repair", label: `Repair ${r.id} ${r.instrument.serial_number}` })),
        ...(props.recentSearches.customers || []).map(c => ({ type: "customer", label: `Customer ${c.firstname} ${c.surname}` }))
    ]

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            setFocusedIndex(i => (i + 1) % (combinedResults.length || 1));
        }
        else if (e.key === "ArrowUp") {
            setFocusedIndex(i => (i - 1 + (combinedResults.length || 1)) % (combinedResults.length || 1));
        }
    };

    useEffect(() => {
        setFocusedIndex(-1);
    }, [props.query]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    });

    return (
        <div className='SearchPopup' onClick={props.onClick}>
            <div className="search-filters">
                {Object.entries(filters).map(([key, value]) => (
                <span className="filter-tag">
                    {value} <button className="remove" onClick={() => setFilters({...filters, key: null})}>×</button>
                </span>
                ))}
                <button className="clear-filters" onClick={() => setFilters({})}>Clear</button>
            </div>

            {!hasQuery && recentSearches.length > 0 && (
                <div className="recent-section">
                <p className="section-title">Recent Searches</p>
                <ul className="recent-list">
                    {recentSearches.map((text, i) => (
                        <li key={i} >{text.label}</li>
                    ))}
                </ul>
                </div>
            )}

            {hasQuery && repairResults.length > 0 && (
                <div className="results-section">
                <p className="section-title">Repairs</p>
                <ul className="result-list">
                    {repairResults.map((item, i) => (
                    <li
                        key={i}
                        ref={(el) => itemsRef.current[i] = el}
                        className={focusedIndex === i ? "focused" : ""}
                    >
                        <div className="result-main">{item.label}</div>
                    </li>
                    ))}
                </ul>
                </div>
            )}

            {hasQuery && customerResults.length > 0 && (
                <div className="results-section">
                    <p className="section-title">Customers</p>
                    <ul className="result-list">
                        {customerResults.map((item, i) => (
                        <li
                            key={i}
                            ref={(el) => itemsRef.current[i] = el}
                            className={focusedIndex === i + repairResults.length ? "focused" : ""}
                        >
                            <div className="result-main">{item.label}</div>
                        </li>
                        ))}
                    </ul>
                </div>
            )}

            {hasQuery && combinedResults.length === 0 && (
                <div className="empty-state">
                    <p>No results found</p>
                    <button className="create-btn">+ Create New Repair</button>
                </div>
            )}
        </div>
    );
}

export default SearchPopup;