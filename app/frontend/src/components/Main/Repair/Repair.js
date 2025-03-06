import { useState } from 'react';

import PageTitle from '../../Common/Text/PageTitle';
import ContentBlock from '../../Common/Containers/ContentBlock';

import InstrumentDetails from './BasicDetails/InstrumentDetails';
import CustomerDetails from './BasicDetails/CustomerDetails';
import Notes from './Notes';
import Assessment from './Assessment/Assessment';

import './Repair.css';

import repairStatuses from '../../../enums/repairStatuses';
import CustomerModal from '../CustomerModal/CustomerModal';

function Repair() {
    const [repair, setRepair] = useState({
        id: 2508004,
        status: repairStatuses.OPEN,
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
        notes: 'Some assorted notes',
        assessment: {
            notes: 'Some assessment notes'
        }
    })

    const updateNotes = (value) => {
        setRepair({...repair, notes: value})
    }

    const updateAssessment = (value) => {
        setRepair({...repair, assessment: value})
    }

    const [customerModalOpen, setCustomerModalOpen] = useState(false);

    const statuses = ['Assessment', 'Open', 'Completed', 'Collected']
    const statusColors = ['red', 'orange', 'green', 'black']

    return (
        <div className='Repair'>
            
            <PageTitle>Repair 0101001 <span className={`status ${statusColors[repair.status]}`}>{statuses[repair.status]}</span></PageTitle>

            <div className='basic-details'>

                <ContentBlock className='customer-and-instrument-details'>

                    <CustomerDetails customer={repair.customer} openModal={() => setCustomerModalOpen(true)} />

                    <div className='divider' />
                    
                    <InstrumentDetails instrument={repair.instrument} />

                </ContentBlock>

                <ContentBlock className='notes-block'>

                    <Notes title='Notes' notes={repair.notes} updateNotes={updateNotes} />

                </ContentBlock>

            </div>

            <ContentBlock className='assessment-block'>

                <Assessment assessment={repair.assessment} updateAssessment={updateAssessment} />

            </ContentBlock>

            {
            customerModalOpen ?
            <CustomerModal customer={repair.customer} closeFunction={() => setCustomerModalOpen(false)} />
            : null
            }

        </div>
    );
}
export default Repair;