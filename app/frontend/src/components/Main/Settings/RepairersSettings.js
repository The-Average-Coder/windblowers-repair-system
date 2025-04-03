import { useState } from 'react';

import BlockTitle from '../../Common/Text/BlockTitle';
import BlockText from '../../Common/Text/BlockText';
import HoursDropdownSelect from '../../Common/Inputs/HoursDropdownSelect';
import ActionButton from '../../Common/Buttons/ActionButton';
import ModalWindow from '../../Common/Containers/ModalWindow';
import ModalTitle from '../../Common/Text/ModalTitle';
import TextInput from '../../Common/Inputs/TextInput';

import './RepairersSettings.css';

import plusWhite from '../../../images/plus-icon/plusWhite.png';

function RepairersSettings() {

    const [repairers, setRepairers] = useState([
        { id: 1, name: 'Purple', hours: [8, 8, 8, 8, 4] },
        { id: 2, name: 'Ryan', hours: [0, 0, 8, 8, 0] }
    ])

    const [creatingRepairer, setCreatingRepairer] = useState(false);
    const [newRepairerName, setNewRepairerName] = useState('');

    const updateHours = (value, index, repairerId) => {
        const newRepairers = [...repairers]
        newRepairers.find(repairer => repairer.id === repairerId).hours[index] = value;
        setRepairers(newRepairers)
    }

    const deleteRepairer = (repairerId) => {
        setRepairers(repairers.filter(repairer => repairer.id !== repairerId));
    }

    const addNewRepairer = () => {
        setRepairers([...repairers, { id: 3, name: newRepairerName, hours: [0, 0, 0, 0, 0] }])
        setCreatingRepairer(false);
        setNewRepairerName('');
    }

    const cancelNewRepairer = () => {
        setCreatingRepairer(false);
        setNewRepairerName('');
    }

    const renderedRepairers = repairers.length !== 0 ? <div className='repairers-grid'>
        <p />
        <p>Tuesday</p>
        <p>Wednesday</p>
        <p>Thursday</p>
        <p>Friday</p>
        <p>Saturday</p>
        <p />
        {repairers.map(repairer => <>
            <p>{repairer.name}</p>
            {repairer.hours.map((hours, index) => <div><HoursDropdownSelect value={hours} onChange={(value) => updateHours(value, index, repairer.id)} /></div>)}

            <div className='delete-button'>
                <ActionButton onClick={() => deleteRepairer(repairer.id)}>Delete</ActionButton>
            </div>
        </>)}
    </div> : <p>No Repairers Found</p>

    return (
        <div className='RepairersSettings'>
            <div className='repairers-title'>
                <div>
                    <BlockTitle>Repairers</BlockTitle>
                    <BlockText>Add repairers and set work times.</BlockText>
                </div>
                <ActionButton colored='true' onClick={() => setCreatingRepairer(true)}><img src={plusWhite} />Add Repairer</ActionButton>
            </div>

            {renderedRepairers}

            {creatingRepairer ? <ModalWindow className='add-repairer-window' closeFunction={cancelNewRepairer}>
                <ModalTitle>Add Repairer</ModalTitle>
                <div className='details'>
                    <TextInput placeholder='Name' value={newRepairerName} onChange={setNewRepairerName} />
                </div>
                <div className='buttons'>
                    <ActionButton onClick={cancelNewRepairer}>Cancel</ActionButton>
                    <ActionButton colored='true' onClick={addNewRepairer}>Save</ActionButton>
                </div>
            </ModalWindow> : null}
        </div>
    );
}

export default RepairersSettings;