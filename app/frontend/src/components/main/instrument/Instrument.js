import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadInstrument, unloadInstrument, editInstrument, deleteInstrument as deleteInstrumentAction } from '../../../reducers/instruments/instrumentsSlice';
import axios from 'axios';

import PageTitle from '../../common/PageTitle';
import ActionButton from '../../common/ActionButton';
import BlockTitle from '../../common/BlockTitle';

function Instrument(props) {
    const { id } = useParams()

    const [instrument, setInstrument] = useState(null);

    const [editMode, setEditMode] = useState(false);

    const [type, setType] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [model, setModel] = useState('');
    const [serialNumber, setSerialNumber] = useState('');

    const [repairHistory, setRepairHistory] = useState([]);

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
            dispatch(loadInstrument(id))
        }
        else {
            setInstrument(activeInstrument);
        }
    }, [instrumentsLoading])

    useEffect(() => {
        if (loadedInstrument) setInstrument(loadedInstrument);
    }, [loadingInstrument, loadedInstrument])

    useEffect(() => {
        if (instrument === null) return;
        axios.get(`/api/repairs/getRepairsOfInstrument/${instrument.id}`).then(resp => {
            setRepairHistory(resp.data);
            console.log(resp.data)
        })
    }, [instrument])

    useEffect(() => {
        return  () => {
            dispatch(unloadInstrument());
        }
    }, [])

    const statusColours = ['red', 'orange', 'limegreen', 'darkgrey'];

    const renderedRepairHistory = repairHistory ? repairHistory.map(repair => {
        return (
            <div className='history-list-repair' onClick={() => navigate(`/repairs/repair/${repair.id}`)}>

                <div className='status' style={{backgroundColor: statusColours[repair.status]}} />
                <p className='job-number'>{repair.id}</p>
                <p className='date-created'>Created: {repair.date_created}</p>
                <p className='deadline'>Deadline: {repair.deadline !== null ? repair.deadline : 'Not Set'}</p>
                <p className='customer-name'>{repair.customer_id !== -1 ? repair.firstname : 'No Customer'} {repair.customer_id !== -1 ? repair.surname : null}</p>

            </div>
        );
    }) : null;

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
        dispatch(editInstrument({ id: props.id, type: type, manufacturer: manufacturer, model: model, serial_number: serialNumber }))
        toggleEditInstrument();
    }

    const deleteInstrument = () => {
        if (prompt("Type 'CONFIRM' to confirm.") === 'CONFIRM') {
            dispatch(deleteInstrumentAction(id));
            navigate('/');
        }
    }

    return (
        <div className='instrument-page'>
            <div className='title'>
                <PageTitle title={instrument === null ? 'Error' : `${instrument.type} ${instrument.serial_number}`} />
                {instrument ? <>
                <div className='action-buttons'>
                    <ActionButton onClick={deleteInstrument} className='delete-instrument' contents='Delete Instrument' />
                </div>
                </> : null }
            </div>
            
            <div className='instrument-info'>
                <div className='instrument-info-box'>
                    <BlockTitle title='Info' />
                    {editMode ? 
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

                    instrumentsLoading || loadingInstrument ? <div className='instrument-error-message'>Loading...</div> : 

                    instrument === null ? <div className='instrument-error-message'>Instrument Deleted</div> : 
                
                    <>
                    <p className='instrument-type'>{instrument.type}</p>
                    <p className='instrument-detail'>{instrument.manufacturer} {instrument.model}</p>
                    <p className='instrument-detail'>{instrument.serial_number}</p>

                    <div className='buttons-holder'>
                        <ActionButton contents={'Edit Instrument'} onClick={toggleEditInstrument} />
                    </div>
                    </>
                    }
                </div>
            </div>

            <div className='instrument-repairs-history'>
                <BlockTitle title='Repair History' />
                {renderedRepairHistory}
            </div>

            <div>

            </div>
        </div>
    );
}

export default Instrument;