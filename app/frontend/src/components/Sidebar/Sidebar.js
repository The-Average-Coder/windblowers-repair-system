import { useLocation, useNavigate } from 'react-router-dom';

import NavigationCalendar from './NavigationCalendar';
import NavigationButton from './NavigationButton';

import './Sidebar.css';

import plusLight from '../../images/plus-icon/plusLight.png';
import settingsLight from '../../images/settings-icon/settingsLight.png';
import settingsDark from '../../images/settings-icon/settingsDark.png';
import logoutLight from '../../images/logout-icon/logoutLight.png';
import logoutDark from '../../images/logout-icon/logoutDark.png';
import ActionButton from '../Common/Buttons/ActionButton';

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