import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import GradientButton from './GradientButton';

function Navbar() {
    return (
        <div className='navbar'>

            <GradientButton contents={<><FontAwesomeIcon icon='fa-solid fa-plus' className='fa-icon' /> New Task</>} onClick={() => console.log('Clicked!')} />

        </div>
    );
}

export default Navbar;