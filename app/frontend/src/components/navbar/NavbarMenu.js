import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavbarMenuButton from './NavbarMenuButton';

function NavbarMenu() {
    const currentPage = useLocation().pathname;

    const [activeModifierPosition, setActiveModifierPosition] = useState();

    const updateActiveModifier = () => {
        if (currentPage.startsWith('/repairs')) setActiveModifierPosition(176);
        else if (currentPage.startsWith('/calendar')) setActiveModifierPosition(220);
        else if (currentPage.startsWith('/settings')) setActiveModifierPosition(264);
        else setActiveModifierPosition(132);
    }    

    useEffect(updateActiveModifier, [currentPage]);

    return (
        <div className='navbar-menu'>

            <p className='title'>Menu</p>

            <NavbarMenuButton page='/' contents={<><FontAwesomeIcon icon='fa-solid fa-house' className='fa-icon' /> <div className='text'>Dashboard</div></>} />
            <NavbarMenuButton page='/repairs' contents={<><FontAwesomeIcon icon='fa-solid fa-tasks' className='fa-icon' /> <div className='text'>Repairs</div></>} />
            <NavbarMenuButton page='/calendar' contents={<><FontAwesomeIcon icon='fa-solid fa-calendar' className='fa-icon' /> <div className='text'>Calendar</div></>} />
            <NavbarMenuButton page='/settings' contents={<><FontAwesomeIcon icon='fa-solid fa-gear' className='fa-icon' /> <div className='text'>Settings</div></>} />

            <div className='active-modifier' style={{top: `${activeModifierPosition}px`}} />

        </div>
    );
}

export default NavbarMenu;