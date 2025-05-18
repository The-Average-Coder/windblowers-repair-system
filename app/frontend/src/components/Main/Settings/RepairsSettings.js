import { useState } from 'react';

import BlockTitle from '../../Common/Text/BlockTitle';
import BlockText from '../../Common/Text/BlockText';
import ActionButton from '../../Common/Buttons/ActionButton';
import TextInput from '../../Common/Inputs/TextInput';
import TextAreaInput from '../../Common/Inputs/TextAreaInput';
import ModalWindow from '../../Common/Containers/ModalWindow';
import ModalTitle from '../../Common/Text/ModalTitle';

import './RepairsSettings.css';

import plusWhite from '../../../images/plus-icon/plusWhite.png';

function RepairsSettings() {

    const [commonJobs, setCommonJobs] = useState([
        { id: 0, name: 'Repad', notes: 'bla bla bla' },
        { id: 1, name: 'Clean', notes: 'whish whosh whish whosh' },
        { id: 2, name: 'Wax', notes: 'wax on wax off, wax on wax off' },
    ]);

    const [instrumentStatuses, setInstrumentStatuses] = useState([
        { id: 1, status: 'Not Yet Dropped Off' },
        { id: 2, status: 'In Workshop' }
    ]);

    const [hourlyRate, setHourlyRate] = useState(45);

    const [editingCommonJob, setEditingCommonJob] = useState({})
    const [creatingCommonJob, setCreatingCommonJob] = useState(false);
    const [newCommonJobName, setNewCommonJobName] = useState('');
    const [newCommonJobNotes, setNewCommonJobNotes] = useState('');

    const [editingStatus, setEditingStatus] = useState({})
    const [creatingStatus, setCreatingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    const deleteCommonJob = (id) => {
        setCommonJobs(commonJobs.filter(job => job.id !== id));
    }

    const saveCommonJobEdit = () => {
        const newCommonJobs = [...commonJobs]
        const updatedCommonJob = newCommonJobs.find(job => job.id === editingCommonJob.id)
        updatedCommonJob.name = editingCommonJob.name;
        updatedCommonJob.notes = editingCommonJob.notes;
        setCommonJobs(newCommonJobs)

        setEditingCommonJob({})
    }

    const cancelNewCommonJob = () => {
        setNewCommonJobName('');
        setNewCommonJobNotes('');
        setCreatingCommonJob(false);
    }

    const addNewCommonJob = () => {
        if (newCommonJobName !== '') {
            setCommonJobs([...commonJobs, { id: 3, name: newCommonJobName, notes: newCommonJobNotes }]);
        }
        setNewCommonJobName('');
        setNewCommonJobNotes('');
        setCreatingCommonJob(false);
    }

    const deleteStatus = (id) => {
        setInstrumentStatuses(instrumentStatuses.filter(status => status.id !== id));
    }

    const saveStatusEdit = () => {
        const newStatuses = [...instrumentStatuses]
        const updatedStatus = newStatuses.find(status => status.id === editingStatus.id)
        updatedStatus.status = editingStatus.status;
        setInstrumentStatuses(newStatuses)

        setEditingStatus({})
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

    const renderedCommonJobs = <div className='common-jobs'>
        <BlockTitle className='name'>Name</BlockTitle>
        <BlockTitle className='notes'>Notes</BlockTitle>
        <div />
        <div />
        {commonJobs.length === 0 ? 'No Common Jobs' : null}
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
    </div>

    const renderedInstrumentStatuses = <div className='instrument-statuses'>
        {instrumentStatuses.length === 0 ? 'No Statuses' : null}
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
    </div>

    return (
        <div className='RepairsSettings'>
            <div className='section-title'>
                <div>
                    <BlockTitle>Common Jobs</BlockTitle>
                    <BlockText>Add common jobs to quickly fill repair notes.</BlockText>
                </div>
                <ActionButton colored='true' onClick={() => setCreatingCommonJob(true)}><img src={plusWhite} />Add Common Job</ActionButton>
            </div>
            
            {renderedCommonJobs}

            <div className='divider' />

            <div className='section-title'>
                <div>
                    <BlockTitle>Instrument Statuses</BlockTitle>
                    <BlockText>Set possible statuses of instruments.</BlockText>
                </div>
                <ActionButton colored='true' onClick={() => setCreatingStatus(true)}><img src={plusWhite} />Add Instrument Status</ActionButton>
            </div>

            {renderedInstrumentStatuses}

            <div className='divider' />

            <BlockTitle>Hourly Rate</BlockTitle>
            <BlockText>Set the default hourly rate for repair quotes.</BlockText>
            <div className='hourly-rate'>
                <TextInput value={`£${hourlyRate}`} onChange={(value) => setHourlyRate(value.slice(1))} />
                <p>per hour</p>
            </div>

            {creatingCommonJob ? <ModalWindow className='add-common-job-window' closeFunction={cancelNewCommonJob}>
                <ModalTitle>Add Common Job</ModalTitle>
                <div className='details'>
                    <TextInput placeholder='Name' value={newCommonJobName} onChange={setNewCommonJobName} />
                    <TextAreaInput placeholder='Notes' value={newCommonJobNotes} onChange={setNewCommonJobNotes} disableAutoResize />
                </div>
                <div className='buttons'>
                    <ActionButton onClick={cancelNewCommonJob}>Cancel</ActionButton>
                    <ActionButton colored='true' onClick={addNewCommonJob}>Save</ActionButton>
                </div>
            </ModalWindow> : null}

            {creatingStatus ? <ModalWindow className='add-instrument-status-window' closeFunction={cancelNewStatus}>
                <ModalTitle>Add Instrument Status</ModalTitle>
                <div className='details'>
                    <TextInput placeholder='Name' value={newStatus} onChange={setNewStatus} />
                </div>
                <div className='buttons'>
                    <ActionButton onClick={cancelNewStatus}>Cancel</ActionButton>
                    <ActionButton colored='true' onClick={addNewStatus}>Save</ActionButton>
                </div>
            </ModalWindow> : null}
        </div>
    );
}

export default RepairsSettings