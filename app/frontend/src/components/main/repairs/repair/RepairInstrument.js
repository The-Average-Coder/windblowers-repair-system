import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createInstrumentOnRepair, editInstrument, loadInstrument } from '../../../../reducers/instruments/instrumentsSlice';
import { addInstrument, removeInstrument as removeInstrumentAction } from '../../../../reducers/repairs/repairsSlice';
import axios from 'axios';

import ActionButton from '../../../common/ActionButton';
import BlockTitle from '../../../common/BlockTitle';

function RepairInstrument(props) {
    const [instrument, setInstrument] = useState(null);

    const [editMode, setEditMode] = useState(false);

    const [type, setType] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [model, setModel] = useState('');
    const [serialNumber, setSerialNumber] = useState('');

    const [searchMode, setSearchMode] = useState(false);

    const [searchValue, setSearchValue] = useState('')
    const [searchedInstruments, setSearchedInstruments] = useState();
    const [selectedInstrument, setSelectedInstrument] = useState();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const instrumentsLoading = useSelector(state => {
        return state.activeInstruments.instrumentsLoading;
    });

    const loadingInstrument = useSelector(state => {
        return state.activeInstruments.loadingInstrument;
    })

    const activeInstrument = useSelector(state => {
        const instrument = state.activeInstruments.activeInstruments.find(instrument => instrument.id === props.id);
        return instrument ? instrument : null;
    });

    const loadedInstrument = useSelector(state => {
        const loadedInstrument = state.activeInstruments.loadedInstrument;
        return loadedInstrument ? loadedInstrument : null;
    })

    useEffect(() => {
        setInstrument(activeInstrument)
    }, [activeInstrument])

    useEffect(() => {
        if (!instrumentsLoading && activeInstrument === null) {
            dispatch(loadInstrument(props.id))
        }
        else {
            setInstrument(activeInstrument);
        }
    }, [instrumentsLoading])

    useEffect(() => {
        if (loadedInstrument) setInstrument(loadedInstrument);
    }, [loadingInstrument, loadedInstrument])

    const toggleEditInstrument = () => {
        if (editMode) {
            setType('');
            setManufacturer('');
            setModel('');
            setSerialNumber('');
        }
        else {
            setType(instrument.type);
            setManufacturer(instrument.manufacturer);
            setModel(instrument.model);
            setSerialNumber(instrument.serial_number);
        }
        setEditMode(!editMode)
    }

    const saveEdit = () => {
        if (props.id === -1) {
            dispatch(createInstrumentOnRepair({ repair_id: props.repairId, instrument:
                { type: type, manufacturer: manufacturer, model: model, serial_number: serialNumber }  }));
        }
        else {
            dispatch(editInstrument({ id: props.id, type: type, manufacturer: manufacturer, model: model, serial_number: serialNumber }))
        }
        toggleEditInstrument();
    }

    const removeInstrument = () => {
        dispatch(removeInstrumentAction(props.repairId));
    }

    const createNewInstrument = () => {
        setType('');
        setManufacturer('');
        setModel('');
        setSerialNumber('');
        setEditMode(true);
    }

    const toggleSearchCustomer = () => {
        setSearchMode(!searchMode);
        setSearchedInstruments([]);
        setSelectedInstrument(0);
        setSearchValue('');
    }

    const setSearch = (searchTerms) => {
        setSearchValue(searchTerms);
        setSearchedInstruments([]);
        if (searchTerms.length > 0)
            axios.post('/api/instruments/searchInstruments', { searchTerms: JSON.stringify(searchTerms.split(' ')) }).then(resp => setSearchedInstruments(resp.data))
    }

    const submitSearch = () => {
        dispatch(addInstrument({ id: props.repairId, instrument_id: selectedInstrument }))
        toggleSearchCustomer();
    }

    return (
        <div className='repair-instrument'>
            <div className='instrument-box'>
                <BlockTitle title='Instrument' />
                {

                searchMode ?
                <>
                <input type='text' className='instrument-search' placeholder='Search...' value={searchValue} onChange={(e) => setSearch(e.target.value)} /><br />

                <div className='search-results'>
                    {searchedInstruments ? searchedInstruments.map(instrument => {
                        return (
                            <div className={`instrument-result ${selectedInstrument === instrument.id ? 'selected': ''}`} onClick={() => {setSelectedInstrument(instrument.id)}}>
                                <p className='serial'>{instrument.serial_number}</p>
                                <p className='info'>{instrument.manufacturer} {instrument.model}</p>
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
                <label className='instrument-label'>Instrument: </label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="" selected disabled hidden>Select Instrument</option>
                    <optgroup label='Flute Family'>
                    <option value="Flute">Flute</option>
                    <option value="Piccolo">Piccolo</option> 
                    <option value="Alto Flute">Alto Flute</option> 
                    <option value="Bass Flute">Bass Flute</option> 
                    <option value="Flute (Other)">Flute (Other)</option> 
                    </optgroup>
                    <optgroup label='Clarinet Family'>
                    <option value="B♭ Clarinet">B♭ Clarinet</option>
                    <option value="A Clarinet">A Clarinet</option> 
                    <option value="E♭ Clarinet">E♭ Clarinet</option> 
                    <option value="Alto Clarinet">Alto Clarinet</option> 
                    <option value="Bass Clarinet">Bass Clarinet</option> 
                    <option value="Contrabass Clarinet">Contrabass Clarinet</option> 
                    <option value="Clarinet (Other)">Clarinet (Other)</option> 
                    </optgroup>
                    <optgroup label='Saxophone Family'>
                    <option value="Soprano Saxophone">Soprano Saxophone</option> 
                    <option value="Alto Saxophone">Alto Saxophone</option> 
                    <option value="Tenor Saxophone">Tenor Saxophone</option> 
                    <option value="Baritone Saxophone">Baritone Saxophone</option> 
                    <option value="Bass Saxophone">Bass Saxophone</option> 
                    <option value="Saxophone (Other)">Saxophone (Other)</option> 
                    </optgroup>
                    <optgroup label='Oboe Family'>
                    <option value="Oboe">Oboe</option>
                    <option value="Cor Anglais">Cor Anglais</option>
                    <option value="Oboe (Other)">Oboe (Other)</option>
                    </optgroup>
                    <optgroup label='Bassoon Family'>
                    <option value="Bassoon">Bassoon</option>
                    <option value="Bassoon (Other)">Bassoon (Other)</option>
                    </optgroup>
                    <optgroup label='Recorder Family'>
                    <option value='Soprano Recorder'>Soprano Recorder</option>
                    <option value='Alto Recorder'>Alto Recorder</option>
                    <option value='Tenor Recorder'>Tenor Recorder</option>
                    <option value='Bass Recorder'>Bass Recorder</option>
                    <option value='Recorder (Other)'>Recorder (Other)</option>
                    </optgroup>
                    <optgroup label='Other'>
                    <option value='Other'>Other</option>
                    </optgroup>
                </select>
                <br />
                <label className='manufacturer-label'>Manufacturer: </label><input type='text' value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} /><br />
                <label className='model-label'>Model: </label><input className='wide' type='text' value={model} onChange={(e) => setModel(e.target.value)} /><br />
                <label className='serial-label'>Serial Number: </label><input className='wide' type='text' value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} /><br />

                <div className='buttons-holder'>
                    <ActionButton contents={'Cancel'} onClick={toggleEditInstrument} />
                    <ActionButton contents={'Save'} onClick={saveEdit} />
                </div>
                </>
                :
                
                props.id === -1 ? 
                <div className='no-instrument-buttons'>
                    <ActionButton onClick={toggleSearchCustomer} contents={<><FontAwesomeIcon icon='fas fa-user-circle' className='fa-icon' /> Add Existing Instrument</>} />
                    <ActionButton onClick={createNewInstrument} contents={<><FontAwesomeIcon icon='fas fa-plus-circle' className='fa-icon' /> Create New Instrument</>} />
                </div>
                :

                instrumentsLoading || loadingInstrument ? <div className='instrument-error-message'>Loading...</div> : 

                instrument === null ? <div className='instrument-error-message'>Instrument Deleted</div> : 
            
                <>
                <p className='instrument-type'>{instrument.type}</p>
                <p className='instrument-detail'>{instrument.manufacturer} {instrument.model}</p>
                <p className='instrument-detail'>{instrument.serial_number}</p>

                <div className='buttons-holder'>
                    <ActionButton contents={'Edit Instrument'} onClick={toggleEditInstrument} />
                    <ActionButton contents={'Remove Instrument'} onClick={removeInstrument} />
                </div>

                <FontAwesomeIcon icon="fas fa-expand-alt" className='expand-button' onClick={() => {navigate(`/instrument/${props.id}`)}} />
                </>
                }
            </div>
        </div>
    );
}

export default RepairInstrument;