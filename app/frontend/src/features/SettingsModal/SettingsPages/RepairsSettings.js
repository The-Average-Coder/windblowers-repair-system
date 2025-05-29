import { useState } from 'react';

import BlockTitle from '../../../components/Text/BlockTitle';
import BlockText from '../../../components/Text/BlockText';
import ActionButton from '../../../components/Buttons/ActionButton';
import TextInput from '../../../components/Inputs/TextInput';
import TextAreaInput from '../../../components/Inputs/TextAreaInput';

import './RepairsSettings.css';

import plusWhite from '../../../images/plus-icon/plusWhite.png';

import axios from 'axios';

function RepairsSettings(props) {

    // #### STATE VARIABLES
    const [editingJobType, setEditingJobType] = useState({});
    const [creatingJobType, setCreatingJobType] = useState(false);
    const [newJobTypeName, setNewJobTypeName] = useState('');
    const [newJobTypeNotes, setNewJobTypeNotes] = useState('');

    const [editingInstrumentStatus, setEditingInstrumentStatus] = useState({});
    const [creatingInstrumentStatus, setCreatingInstrumentStatus] = useState(false);
    const [newInstrumentStatus, setNewInstrumentStatus] = useState('');


    // #### COMMON JOB MANAGEMENT FUNCTIONS
    const saveJobTypeEdit = () => {
        const newJobTypes = [...props.jobTypes]
        const updatedJobType = newJobTypes.find(job => job.id === editingJobType.id)
        updatedJobType.name = editingJobType.name;
        updatedJobType.notes = editingJobType.notes;
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
        setCreatingJobType(false);
    }
    const addNewJobType = () => {
        if (newJobTypeName === '') return;
        
        axios.post('/api/settings/addJobType', {name: newJobTypeName, notes: newJobTypeNotes})
            .then(response => {
                props.updateJobTypes([...props.jobTypes, {
                    id: response.data.insertId,
                    name: newJobTypeName,
                    notes: newJobTypeNotes
                }]);

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
        if (newInstrumentStatus === '') return;
        
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
        props.updateHourlyRate(value);

        axios.put('/api/settings/updateHourlyRate', {new_rate: value})
            .catch(error => console.log(error));
    }


    // #### RENDERED SETTINGS CONTENT
    const renderedJobTypes = <div className='job-types'>
        <BlockTitle className='name'>Name</BlockTitle>
        <BlockTitle className='notes'>Notes</BlockTitle>
        <div />
        <div />
        {props.jobTypes.length === 0 && !creatingJobType && 'No Job Types'}
        {props.jobTypes.map(job => editingJobType.id !== undefined && editingJobType.id === job.id ? <>
            <TextInput value={editingJobType.name} onChange={(value) => setEditingJobType({...editingJobType, name: value})} />
            <TextAreaInput value={editingJobType.notes} onChange={(value) => setEditingJobType({...editingJobType, notes: value})} />
            <ActionButton onClick={() => setEditingJobType({})}>Cancel</ActionButton>
            <ActionButton onClick={saveJobTypeEdit}>Save</ActionButton>
            </> : <>
            <BlockText>{job.name}</BlockText>
            <BlockText>{job.notes}</BlockText>
            <ActionButton onClick={() => setEditingJobType(props.jobTypes.find(jobType => jobType.id === job.id))}>Edit</ActionButton>
            <ActionButton onClick={() => deleteJobType(job.id)}>Delete</ActionButton>
            </>
        )}
        {creatingJobType && <>
            <TextInput value={newJobTypeName} onChange={(value) => setNewJobTypeName(value)} />
            <TextAreaInput value={newJobTypeNotes} onChange={(value) => setNewJobTypeNotes(value)} />
            <ActionButton onClick={cancelNewJobType}>Cancel</ActionButton>
            <ActionButton onClick={addNewJobType}>Save</ActionButton>
        </>}
    </div>

    const renderedInstrumentStatuses = <div className='instrument-statuses'>
        {props.instrumentStatuses.length === 0 && !creatingInstrumentStatus && 'No Statuses'}
        {props.instrumentStatuses.map(status => editingInstrumentStatus.id !== undefined && editingInstrumentStatus.id === status.id ? <>
            <TextInput value={editingInstrumentStatus.status} onChange={(value) => setEditingInstrumentStatus({...editingInstrumentStatus, status: value})} />
            <ActionButton onClick={() => setEditingInstrumentStatus({})}>Cancel</ActionButton>
            <ActionButton onClick={saveInstrumentStatusEdit}>Save</ActionButton>
            </> : <>
            <BlockText>{status.status}</BlockText>
            <ActionButton onClick={() => setEditingInstrumentStatus(props.instrumentStatuses.find(instrumentStatus => instrumentStatus.id === status.id))}>Edit</ActionButton>
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