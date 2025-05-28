import { useState } from 'react';

import ModalWindow from '../../components/Containers/ModalWindow';
import ModalTitle from '../../components/Text/ModalTitle';

import SettingsMenu from './SettingsMenu';
import RepairersSettings from './SettingsPages/RepairersSettings';
import RepairsSettings from './SettingsPages/RepairsSettings';
import CalendarSettings from './SettingsPages/CalendarSettings';
import AppearanceSettings from './SettingsPages/AppearanceSettings';
import AccountSettings from './SettingsPages/AccountSettings';

import './SettingsModal.css';

function SettingsModal(props) {

    const pages = ['Repairers', 'Repairs', 'Materials', 'Calendar', 'Appearance', 'Account'];

    const [currentPage, setCurrentPage] = useState(0)

    return (
        <ModalWindow className='SettingsModal' closeFunction={props.closeFunction}>

            <ModalTitle>Settings</ModalTitle>

            <SettingsMenu pages={pages} currentPage={currentPage} setCurrentPage={(page) => setCurrentPage(page)} />

            <div className='settings-content'>
            {pages[currentPage] === 'Repairers' ? <RepairersSettings />
            : pages[currentPage] === 'Repairs' ? <RepairsSettings />
            : pages[currentPage] === 'Calendar' ? <CalendarSettings />
            : pages[currentPage] === 'Appearance' ? <AppearanceSettings />
            : pages[currentPage] === 'Account' ? <AccountSettings />
            : null}
            </div>

        </ModalWindow>
    );
}

export default SettingsModal;