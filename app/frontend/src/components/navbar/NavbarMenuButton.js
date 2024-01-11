import { useNavigate } from 'react-router-dom';

function NavbarMenuButton(props) {
    const navigate = useNavigate();

    const navigateToPage = () => {
        navigate(props.page);
    }

    return (
        <div className='navbar-menu-button'>

            <button onClick={navigateToPage}><div className='hover-modifier' />{props.contents}</button>

        </div>
    );
}

export default NavbarMenuButton;