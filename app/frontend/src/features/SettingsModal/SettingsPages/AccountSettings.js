import { useState } from 'react';

import BlockTitle from '../../../components/Text/BlockTitle';
import BlockText from '../../../components/Text/BlockText';
import TextInput from '../../../components/Inputs/TextInput';
import ActionButton from '../../../components/Buttons/ActionButton';

import './AccountSettings.css';

import eventBus from '../../../utils/eventBus';

function AccountSettings() {

    const [newPassword, setNewPassword] = useState();
    const [newPasswordRepeat, setNewPasswordRepeat] = useState();

    const updatePassword = () => {
        // Validate, ask for confirmation then update password
    }

    const logout = () => {
        eventBus.emit('logout');
    }

    return (
        <div className='AccountSettings'>
            <BlockTitle>Account</BlockTitle>
            <BlockText>Change password and logout.</BlockText>

            <div className='new-password-form'>
                <TextInput password='true' placeholder='Enter New Password' value={newPassword} onChange={setNewPassword} />
                <TextInput password='true' placeholder='Enter New Password Again' value={newPasswordRepeat} onChange={setNewPasswordRepeat} />
                <ActionButton colored='true' onClick={updatePassword}>Update Password</ActionButton>
            </div>

            <ActionButton className='logout-button' onClick={logout}>Logout</ActionButton>
        </div>
    );
}

export default AccountSettings;