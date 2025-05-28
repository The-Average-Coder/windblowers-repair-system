import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchBar from './SearchBar/SearchBar';
import HeaderButton from './HeaderButton';

import SettingsModal from '../../features/SettingsModal/SettingsModal';
import CreateRepairModal from '../../features/CreateRepairModal/CreateRepairModal';

import './Header.css'

import brandRed from '../../images/brandRed.png'
import brandWhite from '../../images/brandWhite.png'

import settingsLight from '../../images/settings-icon/settingsLight.png';
import settingsDark from '../../images/settings-icon/settingsDark.png';

import plusThickLight from '../../images/plus-icon/plusThickLight.png';
import plusThickDark from '../../images/plus-icon/plusThickDark.png';

function Header() {

    const navigate = useNavigate();

    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const [createRepairModalOpen, setCreateRepairModalOpen] = useState(false);

    return (
        <div className='Header'>

            <img className='brand red' src={brandRed} alt='brand' onClick={() => navigate('/')} />
            <img className='brand white' src={brandWhite} alt='brand' onClick={() => navigate('/')} />

            <SearchBar />

            <HeaderButton className='settings-button' light={settingsLight} dark={settingsDark} onClick={() => setSettingsModalOpen(true)} />
            <HeaderButton className='new-repair-button' light={plusThickLight} dark={plusThickDark} onClick={() => setCreateRepairModalOpen(true)} />

            {settingsModalOpen && <SettingsModal closeFunction={() => setSettingsModalOpen(false)} />}
            {createRepairModalOpen && <CreateRepairModal closeFunction={() => setCreateRepairModalOpen(false)} />}

        </div>
    );
}

export default Header;