import { useState } from 'react';

import BlockTitle from '../../../components/Text/BlockTitle';
import BlockText from '../../../components/Text/BlockText';
import ActionButton from '../../../components/Buttons/ActionButton';
import TextInput from '../../../components/Inputs/TextInput';
import TextAreaInput from '../../../components/Inputs/TextAreaInput';
import HoursDropdownSelect from '../../../components/Inputs/HoursDropdownSelect';
import MinutesDropdownSelect from '../../../components/Inputs/MinutesDropdownSelect';

import './RepairsSettings.css';

import plusWhite from '../../../images/plus-icon/plusWhite.png';

import deleteRed from '../../../images/delete-icon/deleteRed.png';

import axios from 'axios';
import DropdownSelect from '../../../components/Inputs/DropdownSelect';

function RepairsSettings(props) {

    // #### STATE VARIABLES
    const [editingJobType, setEditingJobType] = useState({});
    const [creatingJobType, setCreatingJobType] = useState(false);
    const [newJobTypeName, setNewJobTypeName] = useState('');
    const [newJobTypeNotes, setNewJobTypeNotes] = useState('');
    const [newJobTypeMaterials, setNewJobTypeMaterials] = useState([]);
    const [newJobTypeTime, setNewJobTypeTime] = useState('0');

    const [editingInstrumentStatus, setEditingInstrumentStatus] = useState({});
    const [creatingInstrumentStatus, setCreatingInstrumentStatus] = useState(false);
    const [newInstrumentStatus, setNewInstrumentStatus] = useState('');


    // #### COMMON JOB MANAGEMENT FUNCTIONS
    const updateJobTypeMaterialQuantity = (id, quantity) => {
        const newMaterials = [...editingJobType.materials];
        const updatedMaterial = newMaterials.find(material => material.id === id);
        updatedMaterial.quantity = quantity.split('').filter(char => char >= '0' && char <= '9').join('');
        setEditingJobType({...editingJobType, materials: newMaterials});
    }
    const updateNewJobTypeMaterialQuantity = (id, quantity) => {
        const newMaterials = [...newJobTypeMaterials];
        const updatedMaterial = newMaterials.find(material => material.id === id);
        updatedMaterial.quantity = quantity.split('').filter(char => char >= '0' && char <= '9').join('');
        setNewJobTypeMaterials(newMaterials);
    }

    const saveJobTypeEdit = () => {
        const newJobTypes = [...props.jobTypes];
        const updatedJobType = newJobTypes.find(job => job.id === editingJobType.id)
        updatedJobType.name = editingJobType.name;
        updatedJobType.notes = editingJobType.notes;
        updatedJobType.time = editingJobType.time;
        updatedJobType.materials = editingJobType.materials;
        props.updateJobTypes(newJobTypes)

        axios.put('/api/settings/updateJobType', updatedJobType)
            .catch(error => console.log(error));

        setEditingJobType({})
    }
    const deleteJobType = (id) => {
        if (prompt(`Type 'CONFIRM' to confirm deletion of job type '${props.jobTypes.find(jobType => jobType.id === id).name}'`) !== 'CONFIRM') return;
        
        props.updateJobTypes(props.jobTypes.filter(job => job.id !== id));

        axios.delete(`/api/settings/deleteJobType/${id}`)
            .catch(error => console.log(error));
    }
    const cancelNewJobType = () => {
        setNewJobTypeName('');
        setNewJobTypeNotes('');
        setNewJobTypeMaterials([]);
        setNewJobTypeTime('0');
        setCreatingJobType(false);
    }
    const addNewJobType = () => {
        if (newJobTypeName.trim() === '') return;

        const newJob = {
            name: newJobTypeName,
            notes: newJobTypeNotes,
            materials: newJobTypeMaterials,
            time: newJobTypeTime
        }

        axios.post('/api/settings/addJobType', newJob)
            .then(response => {
                props.updateJobTypes([...props.jobTypes, {...newJob, id: response.data.insertId}]);

                setNewJobTypeName('');
                setNewJobTypeNotes('');
                setCreatingJobType(false);
            })
            .catch(error => console.log(error));
    }


    // #### STATUS MANAGEMENT FUNCTIONS
    const saveInstrumentStatusEdit = () => {
        const newStatuses = [...props.instrumentStatuses]
        const updatedStatus = newStatuses.find(status => status.id === editingInstrumentStatus.id)
        updatedStatus.status = editingInstrumentStatus.status;
        props.updateInstrumentStatuses(newStatuses)

        axios.put('/api/settings/updateInstrumentStatus', updatedStatus)
            .catch(error => console.log(error));

        setEditingInstrumentStatus({})
    }
    const deleteInstrumentStatus = (id) => {
        if (prompt(`Type 'CONFIRM' to confirm deletion of instrument status '${props.instrumentStatuses.find(status => status.id === id).status}'`) !== 'CONFIRM') return;
        
        props.updateInstrumentStatuses(props.instrumentStatuses.filter(status => status.id !== id));

        axios.delete(`/api/settings/deleteInstrumentStatus/${id}`)
            .catch(error => console.log(error));
    }
    const cancelNewInstrumentStatus = () => {
        setNewInstrumentStatus('');
        setCreatingInstrumentStatus(false);
    }
    const addNewInstrumentStatus = () => {
        if (newInstrumentStatus.trim() === '') return;
        
        axios.post('/api/settings/addInstrumentStatus', {status: newInstrumentStatus})
            .then(response => {
                props.updateInstrumentStatuses([...props.instrumentStatuses, {
                    id: response.data.insertId,
                    status: newInstrumentStatus
                }]);
        
                setNewInstrumentStatus('');
                setCreatingInstrumentStatus(false);
            })
            .catch(error => console.log(error));
    }


    // #### HOURLY RATE MANAGEMENT FUNCTIONS
    const updateHourlyRate = (value) => {
        const numberValue = value.split('').filter(char => char >= '0' && char <= '9' || char == '.').join('')
        props.updateHourlyRate(numberValue);

        axios.put('/api/settings/updateHourlyRate', {new_rate: numberValue})
            .catch(error => console.log(error));
    }


    // #### RENDERED SETTINGS CONTENT
    const renderedJobTypes = <div className='job-types'>
        <BlockTitle className='name'>Name</BlockTitle>
        <BlockTitle className='notes'>Notes</BlockTitle>
        <BlockTitle className='notes'>Materials</BlockTitle>
        <BlockTitle className='notes'>Time</BlockTitle>
        <div />
        <div />
        {props.jobTypes ? props.jobTypes.length === 0 && !creatingJobType && 'No Job Types' : 'Loading'}
        {props.jobTypes && props.jobTypes.map(job => editingJobType.id !== undefined && editingJobType.id === job.id ? <>
            <TextInput value={editingJobType.name} onChange={(value) => setEditingJobType({...editingJobType, name: value})} />
            <TextAreaInput value={editingJobType.notes} onChange={(value) => setEditingJobType({...editingJobType, notes: value})} />
            
            <div className='materials-input'>
                {editingJobType.materials.map(material => <div className='material-input'>
                    <BlockText>{props.materials.find(otherMaterial => otherMaterial.id === parseInt(material.id)).name}</BlockText>
                    <TextInput value={material.quantity} onChange={(value) => updateJobTypeMaterialQuantity(material.id, value)} />
                    <ActionButton onClick={() => setEditingJobType({...editingJobType, materials: editingJobType.materials.filter(otherMaterial => otherMaterial.id !== material.id)})}><img src={deleteRed} /></ActionButton>
                </div>)}
                <DropdownSelect options={props.materials.map(materialOption => {return {name: materialOption.name, value: materialOption.id}})} placeholder='Select Material' value={''} onChange={(value) => editingJobType.materials.find(otherMaterial => otherMaterial.id === value) || setEditingJobType({...editingJobType, materials: [...editingJobType.materials, {id: value, quantity: 0}]})} />
            </div>
            
            <div className='time-inputs'>
                <HoursDropdownSelect value={Math.floor(editingJobType.time / 60)} onChange={(updatedHours) => setEditingJobType({...editingJobType, time: updatedHours * 60 + editingJobType.time % 60})} />
                <MinutesDropdownSelect value={editingJobType.time % 60} onChange={(updatedMinutes) => setEditingJobType({...editingJobType, time: Math.floor(editingJobType.time / 60) * 60 + parseInt(updatedMinutes)})} />
            </div>

            <ActionButton onClick={() => setEditingJobType({})}>Cancel</ActionButton>
            <ActionButton onClick={saveJobTypeEdit}>Save</ActionButton>
            </> : <>
            <BlockText>{job.name}</BlockText>
            <BlockText>{job.notes}</BlockText>
            <div>{job.materials.map(material => <BlockText>{props.materials.find(otherMaterial => otherMaterial.id === parseInt(material.id)).name} <strong>x{material.quantity}</strong></BlockText>)}</div>
            <BlockText>{Math.floor(job.time / 60)} Hrs {job.time % 60} Mins</BlockText>
            <ActionButton onClick={() => setEditingJobType(job)}>Edit</ActionButton>
            <ActionButton onClick={() => deleteJobType(job.id)}>Delete</ActionButton>
            </>
        )}
        {creatingJobType && <>
            <TextInput value={newJobTypeName} onChange={(value) => setNewJobTypeName(value)} />
            <TextAreaInput value={newJobTypeNotes} onChange={(value) => setNewJobTypeNotes(value)} />
            
            <div className='materials-input'>
                {newJobTypeMaterials.map(material => <div className='material-input'>
                    <BlockText>{props.materials.find(otherMaterial => otherMaterial.id === parseInt(material.id)).name}</BlockText>
                    <TextInput value={material.quantity} onChange={(value) => updateNewJobTypeMaterialQuantity(material.id, value)} />
                    <ActionButton onClick={() => setNewJobTypeMaterials(newJobTypeMaterials.filter(otherMaterial => otherMaterial.id !== material.id))}><img src={deleteRed} /></ActionButton>
                </div>)}
                <DropdownSelect options={props.materials.map(materialOption => {return {name: materialOption.name, value: materialOption.id}})} placeholder='Select Material' value={''} onChange={(value) => newJobTypeMaterials.find(otherMaterial => otherMaterial.id === value) || setNewJobTypeMaterials([...newJobTypeMaterials, {id: value, quantity: 0}])} />
            </div>
            
            <div className='time-inputs'>
                <HoursDropdownSelect value={Math.floor(newJobTypeTime / 60)} onChange={(updatedHours) => setNewJobTypeTime(updatedHours * 60 + (newJobTypeTime % 60))} />
                <MinutesDropdownSelect value={newJobTypeTime % 60} onChange={(updatedMinutes) => setNewJobTypeTime(Math.floor(newJobTypeTime / 60) * 60 + parseInt(updatedMinutes))} />
            </div>
            
            <ActionButton onClick={cancelNewJobType}>Cancel</ActionButton>
            <ActionButton onClick={addNewJobType}>Save</ActionButton>
        </>}
    </div>

    const renderedInstrumentStatuses = <div className='instrument-statuses'>
        {props.instrumentStatuses ? props.instrumentStatuses.length === 0 && !creatingInstrumentStatus && 'No Statuses' : 'Loading'}
        {props.instrumentStatuses && props.instrumentStatuses.map(status => editingInstrumentStatus.id !== undefined && editingInstrumentStatus.id === status.id ? <>
            <TextInput value={editingInstrumentStatus.status} onChange={(value) => setEditingInstrumentStatus({...editingInstrumentStatus, status: value})} />
            <ActionButton onClick={() => setEditingInstrumentStatus({})}>Cancel</ActionButton>
            <ActionButton onClick={saveInstrumentStatusEdit}>Save</ActionButton>
            </> : <>
            <BlockText>{status.status}</BlockText>
            <ActionButton onClick={() => setEditingInstrumentStatus(status)}>Edit</ActionButton>
            <ActionButton onClick={() => deleteInstrumentStatus(status.id)}>Delete</ActionButton>
            </>
        )}
        {creatingInstrumentStatus && <>
            <TextInput value={newInstrumentStatus} onChange={(value) => setNewInstrumentStatus(value)} />
            <ActionButton onClick={cancelNewInstrumentStatus}>Cancel</ActionButton>
            <ActionButton onClick={addNewInstrumentStatus}>Save</ActionButton>
        </>}
    </div>


    // #### RETURNED COMPONENT
    return (
        <div className='RepairsSettings'>

            {/* Job Types Section */}
            <div className='section-title'>
                <div>
                    <BlockTitle>Job Types</BlockTitle>
                    <BlockText>Add common jobs to quickly fill assessment notes.</BlockText>
                </div>
                <ActionButton colored='true' onClick={() => setCreatingJobType(true)}><img src={plusWhite} />Add Job Type</ActionButton>
            </div>
            
            {renderedJobTypes}

            <div className='divider' />

            {/* Instrument Statuses Section */}
            <div className='section-title'>
                <div>
                    <BlockTitle>Instrument Statuses</BlockTitle>
                    <BlockText>Set possible statuses of instruments.</BlockText>
                </div>
                <ActionButton colored='true' onClick={() => setCreatingInstrumentStatus(true)}><img src={plusWhite} />Add Instrument Status</ActionButton>
            </div>

            {renderedInstrumentStatuses}

            <div className='divider' />

            {/* Hourly Rate Section */}
            <BlockTitle>Hourly Rate</BlockTitle>
            <BlockText>Set the default hourly rate for repair quotes.</BlockText>
            <div className='hourly-rate'>
                <TextInput value={`£${props.hourlyRate}`} onChange={(value) => updateHourlyRate(value.slice(1))} />
                <p>per hour</p>
            </div>
        </div>
    );
}

export default RepairsSettings