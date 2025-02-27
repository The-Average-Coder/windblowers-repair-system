import { useState } from 'react';

import PageTitle from '../../Common/Text/PageTitle';
import ContentBlock from '../../Common/Containers/ContentBlock';
import BlockTitle from '../../Common/Text/BlockTitle';
import BlockText from '../../Common/Text/BlockText';

import './Repair.css';

import repairStatuses from '../../../enums/repairStatuses';

function Repair() {
    const [repair, setRepair] = useState({
        id: 2508004,
        status: repairStatuses.ASSESSMENT,
        customer: {
            firstname: 'Josh',
            surname: 'Cox',
            email: 'joshuajosephcox@gmail.com',
            phone: '07796593187',
            postcode: 'LE12 6UJ',
            address: '10 Cross Hill Close'
        },
        instrument: {
            type: 'Flute',
            manufacturer: 'Pearl',
            model: '505',
            serial_number: 'ABC123'
        },
        notes: 'Some assorted notes'
    })

    const statuses = ['Assessment', 'Open', 'Completed', 'Collected']
    const statusColors = ['red', 'orange', 'green', 'black']

    return (
        <div className='Repair'>
            
            <PageTitle>Repair 0101001 <span className={`status ${statusColors[repair.status]}`}>{statuses[repair.status]}</span></PageTitle>

            <div className='basic-details'>

                <ContentBlock className='details'>
                    <div>
                        <BlockTitle>Customer</BlockTitle>
                        <BlockText className='detail'>{repair.customer.firstname} {repair.customer.surname}</BlockText>
                    </div>

                    <div className='divider' />
                    
                    <div>
                        <BlockTitle>Instrument</BlockTitle>
                        <BlockText className='detail'>{repair.instrument.manufacturer} {repair.instrument.model} {repair.instrument.type}</BlockText>
                    </div>

                    <div>
                        <BlockTitle>Contact Information</BlockTitle>
                        <BlockText className='detail'>{repair.customer.email}</BlockText>
                        <BlockText className='detail'>{repair.customer.phone}</BlockText>
                    </div>
                    
                    <div>
                        <BlockTitle>Serial Number</BlockTitle>
                        <BlockText className='detail'>{repair.instrument.serial_number}</BlockText>
                    </div>
                </ContentBlock>

                <ContentBlock className='notes'> 
                    <BlockTitle>Notes</BlockTitle>
                    Terrible instrument needs work
                </ContentBlock>

            </div>

        </div>
    );
}
export default Repair;