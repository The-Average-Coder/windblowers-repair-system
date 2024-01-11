import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import GradientButton from './GradientButton';
import NavbarMenu from './NavbarMenu';

function Navbar() {
    const [newMenuActive, setNewMenuActive] = useState(0);

    const toggleNewMenu = () => {
        setNewMenuActive(1 - newMenuActive);
    }

    return (
        <div className='navbar'>

            <GradientButton contents={<><FontAwesomeIcon icon='fa-solid fa-plus' className='fa-icon' /> Add New</>} onClick={toggleNewMenu} />
            {newMenuActive ? 
            <div className='add-new-menu'>
                <button>Repair</button>
                <button>Customer</button>
                <button style={{borderBottom: 'none'}}>Instrument</button>
            </div>
            : null}

            <NavbarMenu />

        </div>
    );
}

export default Navbar;