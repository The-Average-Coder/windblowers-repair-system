import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addRepairer, changeColor, deleteRepairer as deleteRepairerAction } from '../../../reducers/repairers/repairersSlice';
import { repairerColorChanged } from '../../../reducers/calendar_events/calendarEventsSlice';

import PageTitle from '../../common/PageTitle';
import ActionButton from '../../common/ActionButton';

function Settings(props) {
    const [newRepairer, setNewRepairer] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [popUpShowing, setPopUpShowing] = useState(false);
    const [popUpPosition, setPopUpPosition] = useState([]);
    const [popUpWidth, setPopUpWidth] = useState(200);
    const [popUpRepairer, setPopUpRepairer] = useState();

    const popUpRef = useRef(null);

    const dispatch = useDispatch();

    const { repairersLoading, repairers } = useSelector(state => {
        return state.repairers;
    })

    const settings = useSelector(state => {
        return state.settings;
    })

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    })

    const showPopUp = (e, repairer) => {
        const rect = e.target.getBoundingClientRect()
        setPopUpShowing(true);
        setPopUpPosition([rect.left + window.scrollX, rect.top + window.scrollY]);
        setPopUpRepairer(repairer);
    }

    const handleOutsideClick = (e) => {
        if (popUpRef.current && !popUpRef.current.contains(e.target))  {
            setPopUpShowing(false);
        }
    }

    const renderedRepairers = repairers.map(repairer => {
        return (
            <div className='repairer'>
                <p>{repairer.name}</p>
                <button className='color-palette' style={{backgroundColor: repairer.color}} onClick={(e) => showPopUp(e, repairer.id)} />
                <ActionButton className='delete' contents='Delete' onClick={() => deleteRepairer(repairer.id)} />
            </div>
        );
    })

    const addNewRepairer = () => {
        if (newRepairer.length === 0) return;
        dispatch(addRepairer({name: newRepairer, color: '#3788D8'}))
        setNewRepairer('');
    }

    const changeRepairerColor = (color) => {
        dispatch(changeColor({id: popUpRepairer, color: color}))
        dispatch(repairerColorChanged({repairer_id: popUpRepairer, color: color}))
        setPopUpShowing(false);
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

            {popUpShowing ? 
            <div className='color-palette-popup' ref={popUpRef} style={{top: popUpPosition[1], left: popUpPosition[0], width: `${popUpWidth}px`}}>
                <div className='arrow' />
                <div className='color-grid'>
                    <button className='blue' onClick={() => changeRepairerColor('#3788D8')} />
                    <button className='red' onClick={() => changeRepairerColor('#E24646')} />
                    <button className='green' onClick={() => changeRepairerColor('#13942B')} />
                    <button className='gold' onClick={() => changeRepairerColor('#E69914')} />
                    <button className='pink' onClick={() => changeRepairerColor('#E6179A')} />
                    <button className='purple' onClick={() => changeRepairerColor('#9414DE')} />
                    <button className='orange' onClick={() => changeRepairerColor('#FF7316')} />
                    <button className='dark-blue' onClick={() => changeRepairerColor('#0F38A8')} />
                    <button className='dark-red' onClick={() => changeRepairerColor('#A80E08')} />
                    <button className='light-green' onClick={() => changeRepairerColor('#9BC007')} />
                </div>
            </div>
            : null}

        </div>
    );
}

export default Settings;