import { useEffect, useState } from 'react';

import ModalWindow from '../../components/Containers/ModalWindow';
import ModalTitle from '../../components/Text/ModalTitle';

import SettingsMenu from './SettingsMenu';
import RepairersSettings from './SettingsPages/RepairersSettings';
import RepairsSettings from './SettingsPages/RepairsSettings';
import CalendarSettings from './SettingsPages/CalendarSettings';
import AppearanceSettings from './SettingsPages/AppearanceSettings';
import AccountSettings from './SettingsPages/AccountSettings';

import './SettingsModal.css';

import axios from 'axios';
import MaterialsSettings from './SettingsPages/MaterialsSettings';

function SettingsModal(props) {

    // #### DATA
    const [settings, setSettings] = useState({});
    const [repairers, setRepairers] = useState([]);


    // #### DATABASE FETCH
    useEffect(() => {
        axios.get('/api/repairers/get')
            .then(response => setRepairers(response.data))
            .catch(error => console.log(error));

        axios.get('/api/settings/get')
            .then(response => {setSettings(response.data);console.log(response.data.job_types)})
            .catch(error => console.log(error));
    }, [])

    
    // #### SETTINGS MANAGEMENT FUNCTIONS
    const updateJobTypes = (jobTypes) => {
        setSettings({...settings, job_types: jobTypes});
    }
    const updateInstrumentStatuses = (instrumentStatuses) => {
        setSettings({...settings, instrument_statuses: instrumentStatuses});
    }
    const updateMaterials = (materials) => {
        setSettings({...settings, materials: materials});
    }
    const updateCalendarDetailsSettings = (calendarDetailsSettings) => {
        setSettings({...settings, calendar_details_settings: calendarDetailsSettings});
    }
    const updateRepairers = (repairers) => {
        setRepairers(repairers);
    }
    const updateHourlyRate = (rate) => {
        setSettings({...settings, hourly_rate: rate});
    }

    const pages = ['Repairers', 'Repairs', 'Materials', 'Calendar', 'Appearance', 'Account'];

    const [currentPage, setCurrentPage] = useState(0)

    return (
        <ModalWindow className='SettingsModal' closeFunction={props.closeFunction}>

            <ModalTitle>Settings</ModalTitle>

            <SettingsMenu pages={pages} currentPage={currentPage} setCurrentPage={(page) => setCurrentPage(page)} />

            <div className='settings-content'>
            {pages[currentPage] === 'Repairers' ? <RepairersSettings repairers={repairers} updateRepairers={updateRepairers} />
            : pages[currentPage] === 'Repairs' ? <RepairsSettings jobTypes={settings.job_types} updateJobTypes={updateJobTypes} materials={settings.materials} instrumentStatuses={settings.instrument_statuses} updateInstrumentStatuses={updateInstrumentStatuses} hourlyRate={settings.hourly_rate} updateHourlyRate={updateHourlyRate} />
            : pages[currentPage] === 'Materials' ? <MaterialsSettings materials={settings.materials} updateMaterials={updateMaterials} />
            : pages[currentPage] === 'Calendar' ? <CalendarSettings calendarDetailsSettings={settings.calendar_details_settings} updateCalendarDetailsSettings={updateCalendarDetailsSettings} />
            : pages[currentPage] === 'Appearance' ? <AppearanceSettings />
            : pages[currentPage] === 'Account' ? <AccountSettings />
            : null}
            </div>

        </ModalWindow>
    );
}

export default SettingsModal;