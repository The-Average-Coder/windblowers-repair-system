import { useEffect, useState, useRef } from 'react';

import './SearchPopup.css';

function SearchPopup(props) {

    const [focusedIndex, setFocusedIndex] = useState(0);
    const itemsRef = useRef([]);

    const hasQuery = props.query.trim() !== "";

    const repairResults = (props.repairResults || []).map(repair =>
        ({ type: "repair", id: repair.id, label: `${repair.id} ${repair.instrument.manufacturer} ${repair.instrument.model} ${repair.instrument.type}` }))
    const customerResults = (props.customerResults || []).map(customer =>
        ({ type: "customer", id: customer.id, label: `${customer.firstname} ${customer.surname}` }))
    const instrumentResults = (props.instrumentResults || []).map(instrument =>
        ({ type: 'instrument', id: instrument.id, label: `${instrument.serial_number} ${instrument.manufacturer} ${instrument.model} ${instrument.type}` }))
    
    const combinedResults = [...repairResults, ...customerResults, ...instrumentResults];

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
            {!hasQuery && (props.recentSearches.length > 0 ? (
                <div className="recent-section">
                <p className="section-title">Recent Searches</p>
                <ul className="recent-list">
                    {props.recentSearches.map((item, index) => (
                        <li onClick={() => props.selectResult(item)} key={index} >{item.label}</li>
                    ))}
                </ul>
                </div>
            )
            :
            <p className='no-results'>No Recent Searches</p>
            )}

            {hasQuery && repairResults.length > 0 && (
                <div className="results-section">
                    <p className="section-title">Repairs</p>
                    <ul className="result-list">
                        {repairResults.map((item, index) => (
                        <li
                            key={index}
                            ref={(el) => itemsRef.current[index] = el}
                            className={focusedIndex === index ? "focused" : ""}
                        >
                            <div onClick={() => props.selectResult(item)} className="result-main">{item.label}</div>
                        </li>
                        ))}
                    </ul>
                </div>
            )}

            {hasQuery && customerResults.length > 0 && (
                <div className="results-section">
                    <p className="section-title">Customers</p>
                    <ul className="result-list">
                        {customerResults.map((item, index) => (
                        <li
                            key={index}
                            ref={(el) => itemsRef.current[index] = el}
                            className={focusedIndex === index + repairResults.length ? "focused" : ""}
                        >
                            <div onClick={() => props.selectResult(item)} className="result-main">{item.label}</div>
                        </li>
                        ))}
                    </ul>
                </div>
            )}

            {hasQuery && instrumentResults.length > 0 && (
                <div className="results-section">
                    <p className="section-title">Instruments</p>
                    <ul className="result-list">
                        {instrumentResults.map((item, index) => (
                        <li
                            key={index}
                            ref={(el) => itemsRef.current[index] = el}
                            className={focusedIndex === index + repairResults.length + customerResults.length ? "focused" : ""}
                        >
                            <div onClick={() => props.selectResult(item)} className="result-main">{item.label}</div>
                        </li>
                        ))}
                    </ul>
                </div>
            )}

            {hasQuery && combinedResults.length === 0 && (
                <p className='no-results'>No Results Found</p>
            )}
        </div>
    );
}

export default SearchPopup;