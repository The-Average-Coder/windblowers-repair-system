import { useNavigate } from 'react-router-dom';

function CustomerListCustomer(props) {
    const navigate = useNavigate();

    const navigateToCustomer = () => {
        navigate(`/customers/customer/${props.id}`)
    }

    return (
        <div className='customer-list-customer' onClick={navigateToCustomer}>

            <p className='name'>Joshua Cox</p>
            <p className='phone-number'>07796593187</p>
            <p className='email'>joshuajosephcox@gmail.com</p>
            <p className='address'>10 Cross Hill Close</p>

        </div>
    );
}

export default CustomerListCustomer;