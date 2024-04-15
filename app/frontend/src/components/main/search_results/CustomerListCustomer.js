import { useNavigate } from 'react-router-dom';

function CustomerListCustomer(props) {
    const navigate = useNavigate();

    const navigateToCustomer = () => {
        navigate(`/customer/${props.customer.id}`)
    }

    return (
        <div className='customer-list-customer' onClick={navigateToCustomer}>

            <p className='name'>{props.customer.firstname} {props.customer.surname}</p>
            <p className='phone-number'>{props.customer.telephone}</p>
            <p className='email'>{props.customer.email}</p>
            <p className='address'>{props.customer.address}</p>

        </div>
    );
}

export default CustomerListCustomer;