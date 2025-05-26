import { useState } from 'react';

import PageTitle from '../../components/Text/PageTitle';
import ContentBlock from '../../components/Containers/ContentBlock';

import SettingsMenu from './SettingsMenu';
import RepairersSettings from './RepairersSettings';
import RepairsSettings from './RepairsSettings';
import CalendarSettings from './CalendarSettings';
import AppearanceSettings from './AppearanceSettings';

import './Settings.css';

function Settings() {

    const pages = ['Repairers', 'Repairs', 'Materials', 'Calendar', 'Appearance', 'Account'];

    const [currentPage, setCurrentPage] = useState(0)

    return (
        <div className='Settings'>

            <PageTitle>Settings</PageTitle>

            <ContentBlock>
                <SettingsMenu pages={pages} currentPage={currentPage} setCurrentPage={(page) => setCurrentPage(page)} />

                <div className='settings-content'>
                {pages[currentPage] === 'Repairers' ? <RepairersSettings />
                : pages[currentPage] === 'Repairs' ? <RepairsSettings />
                : pages[currentPage] === 'Calendar' ? <CalendarSettings />
                : pages[currentPage] === 'Appearance' ? <AppearanceSettings />
                : null}
                </div>
                
            </ContentBlock>

        </div>
    );
}

export default Settings;