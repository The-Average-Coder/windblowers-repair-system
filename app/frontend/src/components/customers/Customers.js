import PageTitle from '../common/PageTitle';
import CustomerListCustomer from './CustomerListCustomer';

function Customers() {
    return (
        <div className='customers'>

            <PageTitle title='Customers' />

            <div className='customer-list'>
                
                <div className='column-header'>
                    <p className='name'>Name</p>
                    <p className='info'>Info</p>
                </div>

                <CustomerListCustomer />
                <CustomerListCustomer />

            </div>

        </div>
    );
}

export default Customers;