import { useLocation, useNavigate } from 'react-router-dom';

import NavigationCalendar from '../Calendar/NavigationCalendar';
import NavigationButton from './NavigationButton';

import './Sidebar.css';

import settingsLight from '../../images/settings-icon/settingsLight.png';
import settingsDark from '../../images/settings-icon/settingsDark.png';
import logoutLight from '../../images/logout-icon/logoutLight.png';
import logoutDark from '../../images/logout-icon/logoutDark.png';

function Sidebar() {
    
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className='Sidebar'>

            <NavigationCalendar />

            <div className='gap' />

            <NavigationButton className={`bottom ${location.pathname === '/settings' ? 'active' : null}`} onClick={() => navigate('/settings')} lightIcon={settingsLight} darkIcon={settingsDark}>Settings</NavigationButton>
            <NavigationButton className='bottom' lightIcon={logoutLight} darkIcon={logoutDark}>Logout</NavigationButton>

        </div>
    );
}

export default Sidebar;