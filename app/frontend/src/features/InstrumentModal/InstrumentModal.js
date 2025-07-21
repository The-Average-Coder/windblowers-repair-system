import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ModalWindow from '../../components/Containers/ModalWindow';
import ModalTitle from '../../components/Text/ModalTitle';
import BlockTitle from '../../components/Text/BlockTitle';
import BlockText from '../../components/Text/BlockText';
import TextInput from '../../components/Inputs/TextInput';
import DropdownSelect from '../../components/Inputs/DropdownSelect';
import ActionButton from '../../components/Buttons/ActionButton';
import BlockTopRightButton from '../../components/Buttons/BlockTopRightButton';

import './InstrumentModal.css';

import editLight from '../../images/edit-icon/editLight.png';
import editHoverLight from '../../images/edit-icon/editHoverLight.png';
import editDark from '../../images/edit-icon/editDark.png';
import editHoverDark from '../../images/edit-icon/editHoverDark.png';

import axios from 'axios';

function InstrumentModal(props) {

    // #### CONSTANTS
    const INSTRUMENT_TYPE_OPTIONS = [
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
            {name: 'Brass (Other)', value: 'Brass (Other)'}
        ]},
        {name: 'Other', value: 'Other'}
    ]

    // #### DATA
    const [statusOptions, setStatusOptions] = useState([]);

    // #### STATE VARIABLES
    const [editMode, setEditMode] = useState(false);
    const [tempInstrument, setTempInstrument] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const [repairHistory, setRepairHistory] = useState([]);

    const navigate = useNavigate();

    // #### DATABASE FETCH
    useEffect(() => {
        axios.get('/api/settings/getInstrumentStatuses')
            .then(response => setStatusOptions([{name: 'Not Set', value: 0},
                                        ...response.data.map(status => {return {name: status.status, value: status.id}})]))
            .catch(error => console.log(error));
        

        if (props.instrument.id === undefined) return;

        axios.get(`/api/instruments/getRepairHistory/${props.instrument.id}`)
            .then(response => setRepairHistory(response.data))
            .catch(error => console.log(error));
    }, [])


    // #### EDIT FUNCTIONS
    const isInstrumentValid = () => {
        if (tempInstrument.serial_number.trim() === '') {
            setErrorMessage('Serial number required');
            return false;
        }
        if (tempInstrument.manufacturer.trim() === '') {
            setErrorMessage('Manufacturer required');
            return false;
        }
        if (tempInstrument.model.trim() === '') {
            setErrorMessage('Model required');
            return false;
        }

        setErrorMessage('');
        return true;
    }

    const toggleEditMode = () => {
        setTempInstrument(props.instrument)
        setEditMode(!editMode);
    }

    const saveEdit = () => {
    
        if (!isInstrumentValid()) return;

        axios.put('/api/instruments/update', tempInstrument)
            .catch((error) => console.log(error));

        props.updateInstrument(tempInstrument);
        toggleEditMode();
    }

    const updateType = (value) => {
        setTempInstrument({...tempInstrument, type: value})
    }

    const updateManufacturer = (value) => {
        setTempInstrument({...tempInstrument, manufacturer: value})
    }

    const updateModel = (value) => {
        setTempInstrument({...tempInstrument, model: value})
    }

    const updateSerialNumber = (value) => {
        setTempInstrument({...tempInstrument, serial_number: value})
    }

    const updateStatus = (value) => {
        setTempInstrument({...tempInstrument, status_id: parseInt(value)})
    }

    const navigateToRepair = (id) => {
        navigate(`/repair/${id}`);
        props.closeFunction();
    }

    return (
        <ModalWindow className='InstrumentModal' closeFunction={props.closeFunction}>

            {
            editMode ?
            <div className='serial-edit'>
            <BlockTitle>Serial Number</BlockTitle>
            <TextInput value={tempInstrument.serial_number} onChange={updateSerialNumber} placeholder='Serial Number' />
            </div>
            :
            <ModalTitle>Serial {props.instrument.serial_number}</ModalTitle>
            }

            <div className='basic-info'>
                <span>
                    <BlockTitle>Model</BlockTitle>
                    {
                    editMode ?
                    <div className='text-inputs'>
                    <DropdownSelect value={tempInstrument.type} onChange={updateType} options={INSTRUMENT_TYPE_OPTIONS} placeholder='Instrument Type' />
                    <TextInput value={tempInstrument.manufacturer} onChange={updateManufacturer} placeholder='Manufacturer' />
                    <TextInput value={tempInstrument.model} onChange={updateModel} placeholder='Model' />
                    </div>
                    :
                    <>
                    <BlockText className='detail'>{props.instrument.type}</BlockText>
                    <BlockText className='detail'>{props.instrument.manufacturer} {props.instrument.model}</BlockText>
                    </>
                    }
                </span>

                <div className='divider' />

                <span>
                    <BlockTitle>Status</BlockTitle>
                    {
                    editMode ?
                    <div className='text-inputs'>
                    <DropdownSelect value={tempInstrument.status_id} onChange={updateStatus} options={statusOptions} placeholder='Status' />
                    </div>
                    :
                    <BlockText className='detail'>{props.instrument.status_id < 1 ? 'Not Set' : statusOptions.length > 0 && statusOptions.find(status => status.value === props.instrument.status_id).name}</BlockText>
                    }
                </span>

                {editMode && <>
                <p className='error-message'>{errorMessage}</p>
                <div className='buttons'>
                    <ActionButton onClick={toggleEditMode}>Cancel</ActionButton>
                    <ActionButton onClick={saveEdit} colored='true'>Save</ActionButton>
                </div>
                </>}

            </div>            

            <div className='repair-history'>
                <BlockTitle>Repair History</BlockTitle>
                {repairHistory.length > 0 ? repairHistory.map(repair => 
                <div className='repair' onClick={() => navigateToRepair(repair.id)}>
                    <div className='details-flex-container'>
                        <p className='job-number'>{repair.id}</p>
                        <p className='customer'>{repair.customer.firstname} {repair.customer.surname}</p>
                    </div>
                </div>) :
                <BlockText>No Repair History</BlockText>}
            </div>

            {
            editMode ? null :
            <BlockTopRightButton className='edit-button' onClick={toggleEditMode} light={editLight} lightHover={editHoverLight} dark={editDark} darkHover={editHoverDark} />
            }

        </ModalWindow>
    );
}

export default InstrumentModal;