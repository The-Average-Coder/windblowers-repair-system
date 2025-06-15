import { useState } from 'react';

import BlockTitle from '../../../components/Text/BlockTitle';
import BlockText from '../../../components/Text/BlockText';
import HoursDropdownSelect from '../../../components/Inputs/HoursDropdownSelect';
import ActionButton from '../../../components/Buttons/ActionButton';
import TextInput from '../../../components/Inputs/TextInput';

import './RepairersSettings.css';

import plusWhite from '../../../images/plus-icon/plusWhite.png';

import deleteRed from '../../../images/delete-icon/deleteRed.png';

import axios from 'axios';

function RepairersSettings(props) {

    // #### STATE VARIABLES
    const [creatingRepairer, setCreatingRepairer] = useState(false);
    const [newRepairerName, setNewRepairerName] = useState('');


    // #### REPAIRER MANAGEMENT FUNCTIONS
    const updateHours = (value, index, repairerId) => {
        const newRepairers = [...props.repairers];
        const updatedRepairer = newRepairers.find(repairer => repairer.id === repairerId)
        updatedRepairer.hours[index] = value;
        props.updateRepairers(newRepairers);

        axios.put('/api/repairers/update', updatedRepairer)
            .catch(error => console.log(error));
    }

    const deleteRepairer = (repairerId) => {
        if (prompt(`Type 'CONFIRM' to confirm deletion of repairer '${props.repairers.find(repairer => repairer.id === repairerId).name}'`) !== 'CONFIRM') return;
        
        props.updateRepairers(props.repairers.filter(repairer => repairer.id !== repairerId));

        axios.delete(`/api/repairers/delete/${repairerId}`)
            .catch(error => console.log(error));
    }

    const addNewRepairer = () => {
        if (newRepairerName.trim() === '') return;

        axios.post('/api/repairers/create', {name: newRepairerName, hours: [0, 0, 0, 0, 0]})
            .then(response => {
                props.updateRepairers([
                    ...props.repairers,
                    { id: response.data.insertId, name: newRepairerName, hours: [0, 0, 0, 0, 0] }
                ]);
                
                setCreatingRepairer(false);
                setNewRepairerName('');
            })
    }

    const cancelNewRepairer = () => {
        setCreatingRepairer(false);
        setNewRepairerName('');
    }


    // #### RENDERED SETTINGS CONTENT
    const renderedRepairers = props.repairers.length !== 0 ? <div className='repairers-grid'>
        <p />
        <p>Tuesday</p>
        <p>Wednesday</p>
        <p>Thursday</p>
        <p>Friday</p>
        <p>Saturday</p>
        <p />
        {props.repairers.map(repairer => <>
            <p>{repairer.name}</p>
            {repairer.hours.map((hours, index) => <div><HoursDropdownSelect value={hours} onChange={(value) => updateHours(value, index, repairer.id)} /></div>)}

            <div className='delete-button'>
                <ActionButton onClick={() => deleteRepairer(repairer.id)}><img src={deleteRed} /></ActionButton>
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

            {creatingRepairer && <div className='new-repairer-form'>
            <TextInput value={newRepairerName} onChange={(value) => setNewRepairerName(value)} />
                <ActionButton onClick={cancelNewRepairer}>Cancel</ActionButton>
                <ActionButton onClick={addNewRepairer}>Save</ActionButton>
            </div>}

        </div>
    );
}

export default RepairersSettings;