import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import GradientButton from './GradientButton';
import NavbarMenu from './NavbarMenu';

function Navbar() {
    return (
        <div className='navbar'>

            <GradientButton contents={<><FontAwesomeIcon icon='fa-solid fa-plus' className='fa-icon' /> New Task</>} onClick={() => console.log('Clicked!')} />

            <NavbarMenu />

        </div>
    );
}

export default Navbar;