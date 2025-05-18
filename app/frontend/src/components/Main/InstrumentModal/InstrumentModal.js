import { useState } from 'react';

import ModalWindow from '../../Common/Containers/ModalWindow';
import ModalTitle from '../../Common/Text/ModalTitle';
import BlockTitle from '../../Common/Text/BlockTitle';
import BlockText from '../../Common/Text/BlockText';
import TextInput from '../../Common/Inputs/TextInput';
import DropdownSelect from '../../Common/Inputs/DropdownSelect';
import ActionButton from '../../Common/Buttons/ActionButton';
import BlockTopRightButton from '../../Common/Buttons/BlockTopRightButton';

import './InstrumentModal.css';

import editLight from '../../../images/edit-icon/editLight.png';
import editHoverLight from '../../../images/edit-icon/editHoverLight.png';
import editDark from '../../../images/edit-icon/editDark.png';
import editHoverDark from '../../../images/edit-icon/editHoverDark.png';

function InstrumentModal(props) {

    const [editMode, setEditMode] = useState(false);
    const [tempInstrument, setTempInstrument] = useState({});

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

    const statuses = [
        'Not Set', 'Not Yet Dropped Off', 'In Workshop'
    ]

    const statusOptions = statuses.map((status, index) => {return {name: status, value: index}})

    const toggleEditMode = () => {
        setTempInstrument(props.instrument)
        setEditMode(!editMode);
    }

    const saveEdit = () => {
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
        setTempInstrument({...tempInstrument, status: value})
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
                    <DropdownSelect value={tempInstrument.type} onChange={updateType} options={instrumentTypeOptions} placeholder='Instrument Type' />
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
                    <DropdownSelect value={tempInstrument.status} onChange={updateStatus} options={statusOptions} placeholder='Status' />
                    </div>
                    :
                    <BlockText className='detail'>{statuses[props.instrument.status]}</BlockText>
                    }
                </span>

                {
                editMode ?
                <div className='buttons'>
                    <ActionButton onClick={toggleEditMode}>Cancel</ActionButton>
                    <ActionButton onClick={saveEdit} colored='true'>Save</ActionButton>
                </div>
                :
                null
                }

            </div>            

            <div className='repair-history'>
                <BlockTitle>Repair History</BlockTitle>
                <BlockText>No Repair History</BlockText>
            </div>

            {
            editMode ? null :
            <BlockTopRightButton className='edit-button' onClick={toggleEditMode} light={editLight} lightHover={editHoverLight} dark={editDark} darkHover={editHoverDark} />
            }

        </ModalWindow>
    );
}

export default InstrumentModal;