import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { loadRepair, unloadRepair, loadRepairAssessments, editNotes, addAssessment, incrementStatus, decrementStatus, toggleArchive as toggleArchiveAction, deleteRepair, completeJob, uncompleteJob, collectJob, uncollectJob } from '../../../../reducers/repairs/repairsSlice';
import { createActivity, deleteActivityOfRepair } from '../../../../reducers/activity/activitySlice';
import { addCustomerToActiveCustomers, unloadCustomer } from '../../../../reducers/customers/customersSlice';
import { addInstrumentToActiveInstruments, unloadInstrument } from '../../../../reducers/instruments/instrumentsSlice';

import repairStatuses from '../../../../enums/repairStatuses';
import activityTypes from '../../../../enums/activityTypes';
import PageTitle from '../../../common/PageTitle';
import ActionButton from '../../../common/ActionButton';
import BlockTitle from '../../../common/BlockTitle';
import RepairCustomer from './RepairCustomer';
import RepairInstrument from './RepairInstrument';
import RepairAssessment from './RepairAssessment';
import RepairOpenDetails from './RepairOpenDetails';
import { deleteCalendarEventsOfRepair, updateRepairStatus } from '../../../../reducers/calendar_events/calendarEventsSlice';
import calendarEventColours from '../../../../enums/calendarEventColours';

function Repair() {
    const { id } = useParams();

    const [repair, setRepair] = useState(null);

    const [editingNotes, setEditingNotes] = useState(false);
    const [notes, setNotes] = useState('');

    const [creatingAssessment, setCreatingAssessment] = useState(false);
    const [assessmentTime, setAssessmentTime] = useState(0);
    const [assessmentTimeCost, setAssessmentTimeCost] = useState(0);
    const [assessmentMaterials, setAssessmentMaterials] = useState('');
    const [assessmentMaterialCost, setAssessmentMaterialCost] = useState(0);
    const [assessmentMaterialCostCustomer, setAssessmentMaterialCostCustomer] = useState(0);
    const [assessmentNotes, setAssessmentNotes] = useState('');

    const [openedJob, setOpenedJob] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const repairsLoading = useSelector(state => {
        return state.activeRepairs.repairsLoading;
    })

    const loadingRepair = useSelector(state => {
        return state.activeRepairs.loadingRepair;
    })

    const loadingRepairAssessments = useSelector(state => {
        return state.activeRepairs.loadingRepairAssessments;
    })

    const assessmentsLoading = useSelector(state => {
        return state.activeRepairs.assessmentsLoading;
    })

    const activeRepair = useSelector(state => {
        const repair = state.activeRepairs.activeRepairs.find(repair => repair.id === id);
        return repair ? repair : null;
    })

    const loadedRepair = useSelector(state => {
        const loadedRepair = state.activeRepairs.loadedRepair;
        return loadRepair ? loadedRepair : null;
    })

    useEffect(() => {
        setRepair(activeRepair)
    }, [activeRepair])

    useEffect(() => {
        if (!repairsLoading && activeRepair === null) {
            dispatch(loadRepair(id))
            dispatch(loadRepairAssessments(id))
        }
        else {
            setRepair(activeRepair);
        }
    }, [repairsLoading])

    useEffect(() => {
        if (loadedRepair) setRepair(loadedRepair);
    }, [loadingRepair, loadingRepairAssessments, loadedRepair])

    useEffect(() => {
        return  () => {
            dispatch(unloadRepair());
            dispatch(unloadCustomer());
            dispatch(unloadInstrument());
        }
    }, [])

    const renderedAssessments = repair ? repair.assessments.map(assessment => {
        const maxId = repair.assessments.reduce((maxId, assessment) => Math.max(assessment.id, maxId), -1);
        const openAssessment = assessment.id === maxId ? 1 : 0;
        return <RepairAssessment assessment={assessment} open={openAssessment} repairId={id} />
    }) : null;

    const getDate = () => {
        const date = new Date();
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    }

    const toggleEditNotes = () => {
        if (editingNotes) setNotes('');
        else setNotes(repair.notes);
        setEditingNotes(!editingNotes);
    }

    const saveEditNotes = () => {
        dispatch(editNotes({ id: id, notes: notes }));
        toggleEditNotes();
    }

    const createAssessment = () => {
        setCreatingAssessment(true);
    }

    const cancelCreateAssessment = () => {
        setAssessmentTime(0);
        setAssessmentTimeCost(0);
        setAssessmentMaterials('');
        setAssessmentMaterialCost(0);
        setAssessmentMaterialCostCustomer(0);
        setAssessmentNotes('');
        setCreatingAssessment(false);
    }

    const submitCreateAssessment = () => {
        dispatch(addAssessment({ repair_id: id, date_created: getDate(), time: assessmentTime, time_cost: assessmentTimeCost, materials: assessmentMaterials,
            material_cost: assessmentMaterialCost, material_cost_customer: assessmentMaterialCostCustomer, notes: assessmentNotes }))
        dispatch(createActivity({ repair_id: id, type: activityTypes.ASSESSED }));
        setAssessmentTime(0);
        setAssessmentTimeCost(0);
        setAssessmentMaterials('');
        setAssessmentMaterialCost(0);
        setAssessmentMaterialCostCustomer(0);
        setAssessmentNotes('');
        setCreatingAssessment(false);
    }

    const updateAssessmentTime = (hours, minutes) => {
        const newTime = hours * 60 + minutes
        setAssessmentTime(newTime)
        setAssessmentTimeCost(newTime * 2 / 3)
    }

    const openJob = () => {
        dispatch(incrementStatus(id));
        setOpenedJob(true);
    }

    const finishJob = () => {
        dispatch(incrementStatus(id));
        dispatch(completeJob(id));
        dispatch(createActivity({ repair_id: id, type: activityTypes.COMPLETED }));
        dispatch(updateRepairStatus({ repair_id: id, color: calendarEventColours.COMPLETED }));
    }

    const reOpenJob = () => {
        dispatch(decrementStatus(id));
        dispatch(uncompleteJob(id));
        dispatch(updateRepairStatus({ repair_id: id, color: calendarEventColours.OPEN }));
    }

    const instrumentCollected = () => {
        dispatch(collectJob(id));
        dispatch(incrementStatus(id));
    }

    const instrumentUncollected = () => {
        dispatch(uncollectJob(id));
        dispatch(decrementStatus(id));
        dispatch(addCustomerToActiveCustomers(repair.customer_id));
        dispatch(addInstrumentToActiveInstruments(repair.instrument_id));
    }

    const toggleArchive = () => {
        dispatch(toggleArchiveAction(id))
    }

    const deleteJob = () => {
        if (prompt("Type 'CONFIRM' to confirm.") === 'CONFIRM') {
            dispatch(deleteCalendarEventsOfRepair(id));
            dispatch(deleteActivityOfRepair(id));
            dispatch(deleteRepair(id));
            navigate('/repairs');
        }
    }

    const statusInfo = [
        { color: 'red', title: 'Assessment' },
        { color: 'orange', title: 'Open' },
        { color: 'limegreen', title: 'Complete' },
        { color: 'black', title: 'Collected' },
    ]

    return (
        <div className='repair'>
            <div className='title'>
                <PageTitle title={`Repair ${id}`} />
                {repair ? <>
                <div className='status' style={{backgroundColor: repair.archived === 1 ? 'darkgrey' : statusInfo[repair.status].color}}>
                    {repair.archived === 1 ? 'Archived' : statusInfo[repair.status].title}
                </div>
                <div className='action-buttons'>
                    <ActionButton onClick={toggleArchive} className='archive-job'
                        contents={repair.archived ? 'Unarchive Job' : 'Archive Job'} />
                    <ActionButton onClick={deleteJob} className='delete-job' contents='Delete Job' />
                </div>
                </> : null }
            </div>

            {repairsLoading || loadingRepair ? <div className='repair-error-message'>Loading...</div> :
            
            repair === null ? <div className='repair-error-message'>No Repair Found - Invalid Job Number</div> :

            <div className='repair-content'>
                <div className='repair-details'>
                    <RepairCustomer id={repair.customer_id} repairId={id} />
                    <RepairInstrument id={repair.instrument_id} repairId={id} />
                    <div className='repair-notes'>
                        <div className='notes-contents'>

                        <BlockTitle title='Notes' />
                            
                            {editingNotes ? 
                            <><textarea className='notes-edit' value={notes} onChange={(e) => setNotes(e.target.value)} />
                            <div className='edit-notes-button'>
                                <ActionButton contents='Cancel' onClick={toggleEditNotes} />
                                <ActionButton contents='Save' onClick={saveEditNotes} />
                            </div></>
                            :
                            <><p className='notes'>{repair.notes}</p>
                            <div className='edit-notes-button'><ActionButton contents='Edit Notes' onClick={toggleEditNotes} /></div></>
                            }
                            
                        </div>
                    </div>
                </div>

                <div className='repair-assessments'>
                <BlockTitle title='Assessment' />
                    {assessmentsLoading ? <p className='assessments-loading-message'>Loading...</p> :
                    
                    renderedAssessments.length === 0 && !creatingAssessment ?
                    <div className='no-assessment-button'>
                        <ActionButton onClick={createAssessment} contents={<><FontAwesomeIcon icon='fas fa-plus-circle' className='fa-icon' /><br />Create New Assessment</>} />
                    </div>
                    : <>
                    {renderedAssessments}
                    {creatingAssessment ? null :
                    <div className='create-button'>
                        <ActionButton onClick={createAssessment} contents={<><FontAwesomeIcon icon='fa-solid fa-plus' className='fa-icon' /> New Assessment</>} />
                    </div>
                    }
                    </>
                    }
                    {creatingAssessment ? <>
                    <p className='create-assessment-title'>Create New Assessment</p>
                    <div className='create-assessment-form'>
                        <div className='time-column'>
                            <div>
                                <label className='time-title'>Time:</label>
                                <select className='time-hours' value={Math.floor(assessmentTime / 60)} onChange={(e) => updateAssessmentTime(parseInt(e.target.value), assessmentTime % 60)}>
                                    <option value='0' selected>0 Hours</option>
                                    <option value='1'>1 Hour</option> 
                                    <option value='2'>2 Hours</option> 
                                    <option value='3'>3 Hours</option> 
                                    <option value='4'>4 Hours</option>
                                    <option value='5'>5 Hours</option>
                                    <option value='6'>6 Hours</option>
                                    <option value='7'>7 Hours</option>
                                    <option value='8'>8 Hours</option>
                                    <option value='9'>9 Hours</option>
                                    <option value='10'>10 Hours</option>
                                    <option value='11'>11 Hours</option>
                                    <option value='12'>12 Hours</option>
                                    <option value='13'>13 Hours</option>
                                    <option value='14'>14 Hours</option>
                                    <option value='15'>15 Hours</option>
                                    <option value='16'>16 Hours</option>
                                    <option value='17'>17 Hours</option>
                                    <option value='18'>18 Hours</option>
                                    <option value='19'>19 Hours</option>
                                    <option value='20'>20 Hours</option>
                                    <option value='21'>21 Hours</option>
                                    <option value='22'>22 Hours</option>
                                    <option value='23'>23 Hours</option>
                                    <option value='24'>24 Hours</option>
                                </select>
                                <select className='time-minutes' value={assessmentTime % 60} onChange={(e) => updateAssessmentTime(Math.floor(assessmentTime / 60), parseInt(e.target.value))}>
                                    <option value='0' selected>0 Minutes</option>
                                    <option value='15'>15 Minutes</option> 
                                    <option value='30'>30 Minutes</option> 
                                    <option value='45'>45 Minutes</option>
                                </select>
                            </div>

                            <div>
                                <label className='time-cost-title'>Time Cost:</label>
                                <input type='text' value={`£${assessmentTimeCost}`} onChange={(e) => setAssessmentTimeCost(e.target.value.slice(1))} />
                            </div>
                        </div>
                            
                        <div className='materials-column'>
                            <div>
                                <label className='materials-title'>Materials:</label>
                                <textarea value={assessmentMaterials} onChange={(e) => setAssessmentMaterials(e.target.value)} />
                            </div>

                            <div>
                                <label className='material-cost-title'>Materials Cost:</label>
                                <input type='text' value={`£${assessmentMaterialCost}`} onChange={(e) => setAssessmentMaterialCost(e.target.value.slice(1))} />
                            </div>

                            <div>
                                <label className='material-cost-customer-title'>Materials Cost For Customer:</label>
                                <input type='text' value={`£${assessmentMaterialCostCustomer}`} onChange={(e) => setAssessmentMaterialCostCustomer(e.target.value.slice(1))} />
                            </div>
                        </div>

                        <div className='notes-column'>
                            <label className='notes-title'>Notes:</label>
                            <textarea className='notes' value={assessmentNotes} onChange={(e) => setAssessmentNotes(e.target.value)} />
                        </div>
                        <ActionButton className='cancel-create-assessment-button' contents='Cancel' onClick={cancelCreateAssessment} />
                        <ActionButton className='submit-create-assessment-button' contents='Save' onClick={submitCreateAssessment} />
                    </div>
                    
                    </> : null}
                    
                </div>

                {repair.status >= repairStatuses.OPEN ?
                <RepairOpenDetails repair={repair} finishJob={finishJob} reOpenJob={reOpenJob} instrumentCollected={instrumentCollected}
                    instrumentUncollected={instrumentUncollected} editing={openedJob} />
                :
                <ActionButton onClick={openJob} className='open-job-button' contents='Open Job' />
                }

            </div>

            }

        </div>
    );
}

export default Repair;