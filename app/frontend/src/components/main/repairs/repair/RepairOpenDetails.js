import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { editOpenJobDetails } from '../../../../reducers/repairs/repairsSlice';

import repairStatuses from '../../../../enums/repairStatuses';
import ActionButton from '../../../common/ActionButton';
import BlockTitle from '../../../common/BlockTitle';
import RepairTimer from './RepairTimer';

function RepairOpenDetails(props) {
    const [beginEditing, setBeginEditing] = useState(props.editing);
    const [editMode, setEditMode] = useState(false);
    const [deadline, setDeadline] = useState('');
    const [editingRepairer, setEditingRepairer] = useState('');

    const dispatch = useDispatch();

    const repairers = useSelector(state => {
        return state.repairers.repairers;
    })

    const repairer = useSelector(state => {
        const repairer = state.repairers.repairers.find(repairer => repairer.id === props.repair.repairer_id);
        return repairer ? repairer : null;
    })

    const toggleEdit = () => {
        if (editMode) {
            setDeadline('');
            setEditingRepairer('');
        }
        else {
            setDeadline(props.repair.deadline);
            setEditingRepairer(repairer !== null ? repairer.id : -1)
        }
        if (beginEditing) setBeginEditing(false);
        else setEditMode(!editMode);
    }

    const saveEdit = () => {
        const formattedDeadline = deadline ? `${deadline.slice(8, 10)}-${deadline.slice(5, 7)}-${deadline.slice(0, 4)}` : null;
        dispatch(editOpenJobDetails({ id: props.repair.id, repairer_id: editingRepairer, deadline: formattedDeadline }));
        toggleEdit();
    }

    return (
        <div className='repair-open-details'>

            <BlockTitle title='Open Repair Details' />

            <div className='open-details'>

                <div className='details'>
                    {editMode || beginEditing ? <>
                    <div>
                        <label className='repairer-title'>Repairer:</label>
                        <select className='repairer-title-select' value={editingRepairer} onChange={(e) => setEditingRepairer(parseInt(e.target.value))}>
                            <option value='-1'>Select Repairer</option>
                            {repairers.map(repairer => <option value={repairer.id}>{repairer.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className='repair-deadline-title'>Deadline:</label>
                        <input type='date' className='repair-deadline-input' value={deadline} onChange={(e) => {setDeadline(e.target.value)}} />
                    </div>
                    <div>
                        <p className='repair-dates-title'>Repair Dates:</p>
                        <p>Not Set</p>
                    </div>
                    {beginEditing ? null : <ActionButton onClick={toggleEdit} className='cancel-edit-button' contents='Cancel' />}
                    <ActionButton onClick={saveEdit} className='save-details-button' contents='Save' />
                    </> : <>
                    <div>
                        <p className='repairer-title'>Repairer:</p>
                        <p>{repairer !== null ? repairer.name : 'Not Set'}</p>
                    </div>
                    <div>
                        <p className='repair-deadline-title'>Deadline:</p>
                        <p>{props.repair.deadline !== null ? props.repair.deadline : 'Not Set'}</p>
                    </div>
                    <div>
                        <p className='repair-dates-title'>Repair Dates:</p>
                        <p>Not Set</p>
                    </div>
                    {props.repair.status === repairStatuses.OPEN ? <>
                    <ActionButton onClick={toggleEdit} className='edit-details-button' contents='Edit Details' />
                    <ActionButton onClick={props.finishJob} className='finish-job-button' contents='Finish Job' />
                    </> : props.repair.status === repairStatuses.COMPLETED ? <>
                    <ActionButton onClick={props.reOpenJob} className='edit-details-button' contents='Re-Open Job' />
                    <ActionButton onClick={props.instrumentCollected} className='finish-job-button' contents='Instrument Collected' />
                    </> : <>
                    <ActionButton onClick={props.instrumentUncollected} className='finish-job-button' contents='Undo Instrument Collected' />
                    </>}
                    </>}
                    
                </div>

                <RepairTimer />

            </div>

        </div>
    );
}

export default RepairOpenDetails;