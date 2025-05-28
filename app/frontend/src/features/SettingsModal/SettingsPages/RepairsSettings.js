import { useState } from 'react';

import BlockTitle from '../../../components/Text/BlockTitle';
import BlockText from '../../../components/Text/BlockText';
import ActionButton from '../../../components/Buttons/ActionButton';
import TextInput from '../../../components/Inputs/TextInput';
import TextAreaInput from '../../../components/Inputs/TextAreaInput';

import './RepairsSettings.css';

import plusWhite from '../../../images/plus-icon/plusWhite.png';

function RepairsSettings() {

    // #### RAW TEST DATA
    const [commonJobs, setCommonJobs] = useState([
        { id: 1, name: 'Repad', notes: 'bla bla bla' },
        { id: 2, name: 'Clean', notes: 'whish whosh whish whosh' },
        { id: 3, name: 'Wax', notes: 'wax on wax off, wax on wax off' },
    ]);

    const [instrumentStatuses, setInstrumentStatuses] = useState([
        { id: 1, status: 'Not Yet Dropped Off' },
        { id: 2, status: 'In Workshop' }
    ]);


    // #### STATE VARIABLES
    const [hourlyRate, setHourlyRate] = useState(45);

    const [editingCommonJob, setEditingCommonJob] = useState({})
    const [creatingCommonJob, setCreatingCommonJob] = useState(false);
    const [newCommonJobName, setNewCommonJobName] = useState('');
    const [newCommonJobNotes, setNewCommonJobNotes] = useState('');

    const [editingStatus, setEditingStatus] = useState({})
    const [creatingStatus, setCreatingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState('');


    // #### COMMON JOB MANAGEMENT FUNCTIONS
    const saveCommonJobEdit = () => {
        const newCommonJobs = [...commonJobs]
        const updatedCommonJob = newCommonJobs.find(job => job.id === editingCommonJob.id)
        updatedCommonJob.name = editingCommonJob.name;
        updatedCommonJob.notes = editingCommonJob.notes;
        setCommonJobs(newCommonJobs)

        setEditingCommonJob({})
    }

    const deleteCommonJob = (id) => {
        setCommonJobs(commonJobs.filter(job => job.id !== id));
    }

    const cancelNewCommonJob = () => {
        setNewCommonJobName('');
        setNewCommonJobNotes('');
        setCreatingCommonJob(false);
    }

    const addNewCommonJob = () => {
        if (newCommonJobName !== '') {
            setCommonJobs([...commonJobs, { id: 4, name: newCommonJobName, notes: newCommonJobNotes }]);
        }
        setNewCommonJobName('');
        setNewCommonJobNotes('');
        setCreatingCommonJob(false);
    }


    // #### STATUS MANAGEMENT FUNCTIONS
    const saveStatusEdit = () => {
        const newStatuses = [...instrumentStatuses]
        const updatedStatus = newStatuses.find(status => status.id === editingStatus.id)
        updatedStatus.status = editingStatus.status;
        setInstrumentStatuses(newStatuses)

        setEditingStatus({})
    }

    const deleteStatus = (id) => {
        setInstrumentStatuses(instrumentStatuses.filter(status => status.id !== id));
    }

    const cancelNewStatus = () => {
        setNewStatus('');
        setCreatingStatus(false);
    }

    const addNewStatus = () => {
        if (newStatus !== '') {
            setInstrumentStatuses([...instrumentStatuses, { id: 3, status: newStatus }]);
        }
        setNewStatus('');
        setCreatingStatus(false);
    }


    // #### RENDERED SETTINGS CONTENT
    const renderedCommonJobs = <div className='common-jobs'>
        <BlockTitle className='name'>Name</BlockTitle>
        <BlockTitle className='notes'>Notes</BlockTitle>
        <div />
        <div />
        {commonJobs.length === 0 && !creatingCommonJob && 'No Common Jobs'}
        {commonJobs.map(job => editingCommonJob.id !== undefined && editingCommonJob.id === job.id ? <>
            <TextInput value={editingCommonJob.name} onChange={(value) => setEditingCommonJob({...editingCommonJob, name: value})} />
            <TextAreaInput value={editingCommonJob.notes} onChange={(value) => setEditingCommonJob({...editingCommonJob, notes: value})} />
            <ActionButton onClick={() => setEditingCommonJob({})}>Cancel</ActionButton>
            <ActionButton onClick={saveCommonJobEdit}>Save</ActionButton>
            </> : <>
            <BlockText>{job.name}</BlockText>
            <BlockText>{job.notes}</BlockText>
            <ActionButton onClick={() => setEditingCommonJob(commonJobs.find(commonJob => commonJob.id === job.id))}>Edit</ActionButton>
            <ActionButton onClick={() => deleteCommonJob(job.id)}>Delete</ActionButton>
            </>
        )}
        {creatingCommonJob && <>
            <TextInput value={newCommonJobName} onChange={(value) => setNewCommonJobName(value)} />
            <TextAreaInput value={newCommonJobNotes} onChange={(value) => setNewCommonJobNotes(value)} />
            <ActionButton onClick={cancelNewCommonJob}>Cancel</ActionButton>
            <ActionButton onClick={addNewCommonJob}>Save</ActionButton>
        </>}
    </div>

    const renderedInstrumentStatuses = <div className='instrument-statuses'>
        {instrumentStatuses.length === 0 && !creatingStatus && 'No Statuses'}
        {instrumentStatuses.map(status => editingStatus.id !== undefined && editingStatus.id === status.id ? <>
            <TextInput value={editingStatus.status} onChange={(value) => setEditingStatus({...editingStatus, status: value})} />
            <ActionButton onClick={() => setEditingStatus({})}>Cancel</ActionButton>
            <ActionButton onClick={saveStatusEdit}>Save</ActionButton>
            </> : <>
            <BlockText>{status.status}</BlockText>
            <ActionButton onClick={() => setEditingStatus(instrumentStatuses.find(instrumentStatus => instrumentStatus.id === status.id))}>Edit</ActionButton>
            <ActionButton onClick={() => deleteStatus(status.id)}>Delete</ActionButton>
            </>
        )}
        {creatingStatus && <>
            <TextInput value={newStatus} onChange={(value) => setNewStatus(value)} />
            <ActionButton onClick={cancelNewStatus}>Cancel</ActionButton>
            <ActionButton onClick={addNewStatus}>Save</ActionButton>
        </>}
    </div>

    return (
        <div className='RepairsSettings'>

            {/* Common Jobs Section */}
            <div className='section-title'>
                <div>
                    <BlockTitle>Common Jobs</BlockTitle>
                    <BlockText>Add common jobs to quickly fill assessment notes.</BlockText>
                </div>
                <ActionButton colored='true' onClick={() => setCreatingCommonJob(true)}><img src={plusWhite} />Add Common Job</ActionButton>
            </div>
            
            {renderedCommonJobs}

            <div className='divider' />

            {/* Instrument Statuses Section */}
            <div className='section-title'>
                <div>
                    <BlockTitle>Instrument Statuses</BlockTitle>
                    <BlockText>Set possible statuses of instruments.</BlockText>
                </div>
                <ActionButton colored='true' onClick={() => setCreatingStatus(true)}><img src={plusWhite} />Add Instrument Status</ActionButton>
            </div>

            {renderedInstrumentStatuses}

            <div className='divider' />

            {/* Hourly Rate Section */}
            <BlockTitle>Hourly Rate</BlockTitle>
            <BlockText>Set the default hourly rate for repair quotes.</BlockText>
            <div className='hourly-rate'>
                <TextInput value={`£${hourlyRate}`} onChange={(value) => setHourlyRate(value.slice(1))} />
                <p>per hour</p>
            </div>
        </div>
    );
}

export default RepairsSettings