import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addRepairer, editRepairer, deleteRepairer as deleteRepairerAction } from '../../../reducers/repairers/repairersSlice';

import PageTitle from '../../common/PageTitle';
import ActionButton from '../../common/ActionButton';

function Settings(props) {
    const [newRepairer, setNewRepairer] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const dispatch = useDispatch();

    const { repairersLoading, repairers } = useSelector(state => {
        return state.repairers;
    })

    const settings = useSelector(state => {
        return state.settings;
    })

    const renderedRepairers = repairers.map(repairer => {
        return (
            <div className='repairer'>
                <p>{repairer.name}</p>
                <ActionButton className='delete' contents='Delete' onClick={() => deleteRepairer(repairer.id)} />
            </div>
        );
    })

    const addNewRepairer = () => {
        if (newRepairer.length === 0) return;
        dispatch(addRepairer(newRepairer))
        setNewRepairer('');
    }

    const deleteRepairer = (id) => {
        dispatch(deleteRepairerAction(id))
    }

    return (
        <div className='settings'>
            
            <div className='title'>
                <PageTitle title='Settings' />
            </div>

            <div className='repairers-box'>

                <p className='setting-title'>Repairers</p>

                {renderedRepairers}

                <div className='new-repairer'>
                    <input type='text' placeholder='Add New Repairer' value={newRepairer} onChange={(e) => setNewRepairer(e.target.value)} />
                    <ActionButton className='add-button' contents='Add' onClick={addNewRepairer} />
                </div>

            </div>

            <div className='account-settings'>

                <div className='password-box'>
                    <p className='setting-title'>Password</p>

                    <div className='change-password'>
                        <div>
                            <p>Change Password:</p>
                            <input type='password' placeholder='New Password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            <input type='password' placeholder='Confirm New Password' value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                            <ActionButton className='submit' contents='Submit' />
                        </div>
                    </div>
                </div>

                <div className='account-box'>
                    <p className='setting-title'>Account</p>

                    <div className='logout'>
                        <div>
                            <ActionButton className='logout-button' contents='Logout' onClick={props.logout} />
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Settings;