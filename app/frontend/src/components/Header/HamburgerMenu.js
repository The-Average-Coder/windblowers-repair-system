import { useLocation, useNavigate } from 'react-router-dom';

import NavigationCalendar from '../Sidebar/NavigationCalendar';
import NavigationButton from '../Sidebar/NavigationButton';

import './HamburgerMenu.css';

import settingsLight from '../../images/settings-icon/settingsLight.png';
import settingsDark from '../../images/settings-icon/settingsDark.png';
import logoutLight from '../../images/logout-icon/logoutLight.png';
import logoutDark from '../../images/logout-icon/logoutDark.png';

function HamburgerMenu(props) {
    const location = useLocation();
    const navigate = useNavigate();

    return (<div className='HamburgerMenu'>
        <div className='menu'>
            <div className='calendar'>
                <NavigationCalendar closeFunction={props.closeFunction} />
            </div>
            <div className='navigation-buttons'>
                <NavigationButton className={location.pathname === '/settings' ? 'active' : ''} onClick={() => {navigate('/settings');props.closeFunction();}} lightIcon={settingsLight} darkIcon={settingsDark}>Settings</NavigationButton>
                <NavigationButton lightIcon={logoutLight} darkIcon={logoutDark}>Logout</NavigationButton>
            </div>
        </div>
    </div>);
}

export default HamburgerMenu;