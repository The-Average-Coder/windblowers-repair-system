import { useState } from 'react';

import PageTitle from '../../components/Text/PageTitle';
import ContentBlock from '../../components/Containers/ContentBlock';
import BlockTitle from '../../components/Text/BlockTitle';
import BlockText from '../../components/Text/BlockText';
import TextAreaInput from '../../components/Inputs/TextAreaInput';
import BlockTopRightButton from '../../components/Buttons/BlockTopRightButton';
import ActionButton from '../../components/Buttons/ActionButton';

import InstrumentDetails from './BasicDetails/InstrumentDetails';
import CustomerDetails from './BasicDetails/CustomerDetails';
import CustomerModal from '../../features/CustomerModal/CustomerModal';
import InstrumentModal from '../../features/InstrumentModal/InstrumentModal';
import Assessment from './Assessment/Assessment';

import './Repair.css';

import repairStatuses from '../../enums/repairStatuses';

import editLight from '../../images/edit-icon/editLight.png';
import editHoverLight from '../../images/edit-icon/editHoverLight.png';
import editDark from '../../images/edit-icon/editDark.png';
import editHoverDark from '../../images/edit-icon/editHoverDark.png';

function Repair() {

    // #### RAW TEST DATA
    const [repair, setRepair] = useState({
        id: 2508004,
        status: repairStatuses.OPEN,
        customer: {
            firstname: 'Josh',
            surname: 'Cox',
            email: 'joshuajosephcox@gmail.com',
            phone: '07796593187',
            address: '10 Cross Hill Close, LE12 6UJ'
        },
        instrument: {
            type: 'Flute',
            manufacturer: 'Pearl',
            model: '505',
            serial_number: 'ABC123',
            status: 1,
        },
        notes: 'Some assorted notes',
        assessment: {
            job_type_id: 1,
            notes: 'bla bla bla'
        }
    })


    // #### STATE VARIABLES
    const [editNotesMode, setEditNotesMode] = useState(false);
    const [tempNotes, setTempNotes] = useState('');


    // #### DATA MANAGEMENT FUNCTIONS
    const updateCustomer = (value) => {
        setRepair({...repair, customer: value})
    }

    const updateInstrument = (value) => {
        setRepair({...repair, instrument: value})
    }
    
    const toggleEditNotesMode = () => {
        setTempNotes(repair.notes)
        setEditNotesMode(!editNotesMode);
    }

    const updateNotes = () => {
        setRepair({...repair, notes: tempNotes})
        toggleEditNotesMode();
    }

    const updateAssessment = (value) => {
        setRepair({...repair, assessment: value})
    }

    const [customerModalOpen, setCustomerModalOpen] = useState(false);
    const [instrumentModalOpen, setInstrumentModalOpen] = useState(false);

    const statuses = ['Assessment', 'Open', 'Completed', 'Collected']
    const statusColors = ['red', 'orange', 'green', 'black']

    return (
        <div className='Repair'>
            
            <PageTitle>Repair {repair.id} <span className={`status ${statusColors[repair.status]}`}>{statuses[repair.status]}</span></PageTitle>

            <div className='basic-details'>

                <ContentBlock className='customer-and-instrument-details'>

                    <CustomerDetails customer={repair.customer} openModal={() => setCustomerModalOpen(true)} />

                    <div className='divider' />
                    
                    <InstrumentDetails instrument={repair.instrument} openModal={() => setInstrumentModalOpen(true)} />

                </ContentBlock>

                <ContentBlock className='notes-block'>

                    <BlockTitle>Notes</BlockTitle>

                    {
                    editNotesMode ? 
                    <>
                    <TextAreaInput value={tempNotes} onChange={setTempNotes} />

                    <div className='buttons'>
                        <ActionButton onClick={toggleEditNotesMode}>Cancel</ActionButton>
                        <ActionButton onClick={updateNotes} colored='true'>Save</ActionButton>
                    </div>
                    </>
                    :
                    <>
                    <BlockText className='notes'>{repair.notes}</BlockText>

                    <BlockTopRightButton onClick={toggleEditNotesMode} light={editLight} lightHover={editHoverLight} dark={editDark} darkHover={editHoverDark} />
                    </>
                    }

                </ContentBlock>

            </div>

            <ContentBlock className='assessment-block'>

                <Assessment assessment={repair.assessment} updateAssessment={updateAssessment} />

            </ContentBlock>

            {
            customerModalOpen ?
            <CustomerModal customer={repair.customer} updateCustomer={updateCustomer} closeFunction={() => setCustomerModalOpen(false)} />
            : null
            }

            {
            instrumentModalOpen ?
            <InstrumentModal instrument={repair.instrument} updateInstrument={updateInstrument} closeFunction={() => setInstrumentModalOpen(false)} />
            : null
            }

        </div>
    );
}
export default Repair;