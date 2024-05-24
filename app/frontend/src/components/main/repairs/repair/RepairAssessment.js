import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { updateAssessment as updateAssessmentAction, deleteAssessment as deleteAssessmentAction } from '../../../../reducers/repairs/repairsSlice';

import ActionButton from '../../../common/ActionButton';

function RepairAssessment(props) {
    const [open, setOpen] = useState(props.open);
    const [editMode, setEditMode] = useState(false);

    const [time, setTime] = useState(0);
    const [timeCost, setTimeCost] = useState(0);
    const [materials, setMaterials] = useState('');
    const [materialCost, setMaterialCost] = useState(0);
    const [materialCostCustomer, setMaterialCostCustomer] = useState(0);
    const [notes, setNotes] = useState('');

    const dispatch = useDispatch();

    const toggleEditAssessment = () => {
        if (editMode) {
            setTime(0);
            setTimeCost(0);
            setMaterials('');
            setMaterialCost(0);
            setMaterialCostCustomer(0);
            setNotes('');
        }
        else {
            setTime(props.assessment.time);
            setTimeCost(props.assessment.time_cost);
            setMaterials(props.assessment.materials);
            setMaterialCost(props.assessment.material_cost);
            setMaterialCostCustomer(props.assessment.material_cost_customer);
            setNotes(props.assessment.notes);
        }
        setEditMode(!editMode)
    }

    const saveEdit = () => {
        dispatch(updateAssessmentAction({ id: props.assessment.id, repair_id: props.repairId, time: time, time_cost: timeCost,
            materials: materials, material_cost: materialCost, material_cost_customer: materialCostCustomer, notes: notes }))
        toggleEditAssessment();
    }

    const updateTime = (hours, minutes) => {
        const newTime = hours * 60 + minutes
        setTime(newTime)
        setTimeCost(newTime * 3 / 4)
    }

    const deleteAssessment = () => {
        dispatch(deleteAssessmentAction({ id: props.repairId, assessment_id: props.assessment.id }));
    }

    return (
        <div className='repair-assessment' style={open === 1 ? null : {minHeight: '0', height: '50px'}}>

            <p className='assessment-title' onClick={() => { if (!editMode) setOpen((open + 1) % 2) }}>Assessment {props.assessment.date_created}</p>
            
            <div className='assessment-details'>
                {editMode ? <>
                <div className='time-column'>
                    <div>
                        <label className='time-title'>Time:</label>
                        <select className='time-hours' value={Math.floor(time / 60)} onChange={(e) => updateTime(parseInt(e.target.value), time % 60)}>
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
                        <select className='time-minutes' value={time % 60} onChange={(e) => updateTime(Math.floor(time / 60), parseInt(e.target.value))}>
                            <option value='0' selected>0 Minutes</option>
                            <option value='15'>15 Minutes</option> 
                            <option value='30'>30 Minutes</option> 
                            <option value='45'>45 Minutes</option>
                        </select>
                    </div>

                    <div>
                        <label className='time-cost-title'>Time Cost:</label>
                        <input type='text' value={`£${timeCost}`} onChange={(e) => setTimeCost(e.target.value.slice(1))} />
                    </div>
                </div>
                    
                <div className='materials-column'>
                    <div>
                        <label className='materials-title'>Materials:</label>
                        <textarea value={materials} onChange={(e) => setMaterials(e.target.value)} />
                    </div>

                    <div>
                        <label className='material-cost-title'>Materials Cost:</label>
                        <input type='text' value={`£${materialCost}`} onChange={(e) => setMaterialCost(e.target.value.slice(1))} />
                    </div>

                    <div>
                        <label className='material-cost-customer-title'>Materials Cost For Customer:</label>
                        <input type='text' value={`£${materialCostCustomer}`} onChange={(e) => setMaterialCostCustomer(e.target.value.slice(1))} />
                    </div>
                </div>

                <div className='notes-column'>
                    <label className='notes-title'>Notes:</label>
                    <textarea className='notes' value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
                </> : <>
                <div className='time-column'>
                    <div>
                        <p className='time-title'>Time:</p>
                        <p className='detail'>{Math.floor(props.assessment.time / 60)} Hour {props.assessment.time % 60} Minutes</p>
                    </div>

                    <div>
                        <p className='time-cost-title'>Time Cost:</p>
                        <p className='detail'>£{props.assessment.time_cost}</p>
                    </div>
                </div>
                    
                <div className='materials-column'>
                    <div>
                        <p className='materials-title'>Materials:</p>
                        <p className='detail'>{props.assessment.materials}</p>
                    </div>

                    <div>
                        <p className='material-cost-title'>Materials Cost:</p>
                        <p className='detail'>£{props.assessment.material_cost}</p>
                    </div>

                    <div>
                        <p className='material-cost-customer-title'>Materials Cost For Customer:</p>
                        <p className='detail'>£{props.assessment.material_cost_customer}</p>
                    </div>
                </div>

                <div className='notes-column'>
                    <p className='notes-title'>Notes:</p>
                    <p className='detail notes'>{props.assessment.notes}</p>
                </div>
                </>}
            </div>

            {open === 1 ? editMode ? <>
            <ActionButton className='cancel-edit-button' contents='Cancel' onClick={toggleEditAssessment} />
            <ActionButton className='save-edit-button' contents='Save' onClick={saveEdit} />
            </> : <> 
            <ActionButton className='delete-assessment-button' contents='Delete Assessment' onClick={deleteAssessment} />
            <ActionButton className='edit-assessment-button' contents='Edit Assessment' onClick={toggleEditAssessment} />
            </> : null }

        </div>
    );
}

export default RepairAssessment;