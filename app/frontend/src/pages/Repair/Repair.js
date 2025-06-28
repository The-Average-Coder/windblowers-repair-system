import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

import eventBus from '../../utils/eventBus';

import editLight from '../../images/edit-icon/editLight.png';
import editHoverLight from '../../images/edit-icon/editHoverLight.png';
import editDark from '../../images/edit-icon/editDark.png';
import editHoverDark from '../../images/edit-icon/editHoverDark.png';

import caretDownBlack from '../../images/caret-icons/caretDownBlack.png';
import caretDownWhite from '../../images/caret-icons/caretDownWhite.png';

import assessLight from '../../images/assess-icon/assessLight.png';
import assessDark from '../../images/assess-icon/assessDark.png';

import archiveLight from '../../images/archive-icon/archiveLight.png';
import archiveDark from '../../images/archive-icon/archiveDark.png';

import deleteRed from '../../images/delete-icon/deleteRed.png';

import axios from 'axios';

function Repair() {

    const { id } = useParams();

    // #### DATA
    const [repair, setRepair] = useState({});
    const [instrumentStatuses, setInstrumentStatuses] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [hourlyRate, setHourlyRate] = useState(0);

    // #### DATABASE DATA FETCH
    useEffect(() => {
        axios.get(`/api/repairs/get/${id}`)
            .then(response => setRepair(response.data))
            .catch(error => console.log(error));
        
        axios.get('/api/settings/getInstrumentStatuses')
            .then(response => setInstrumentStatuses(response.data))
            .catch(error => console.log(error));

        axios.get('/api/settings/getJobTypes')
            .then(response => setJobTypes(response.data))
            .catch(error => console.log(error));

        axios.get('/api/settings/getMaterials')
            .then(response => setMaterials(response.data))
            .catch(error => console.log(error));

        axios.get('/api/settings/getHourlyRate')
            .then(response => setHourlyRate(response.data.hourly_rate / 100))
            .catch(error => console.log(error));
    }, [])


    // #### STATE VARIABLES
    const [editNotesMode, setEditNotesMode] = useState(false);
    const [tempNotes, setTempNotes] = useState('');
    
    const [showActionsMenu, setShowActionsMenu] = useState(false);


    // #### MISCELLANEOUS INITIALISATION
    const navigate = useNavigate();


    // #### ACTIONS MENU
    const toggleActionsMenu = (e = null) => {

        e && e.stopPropagation();

        if (!showActionsMenu) {
            eventBus.on('click', closeActionsMenu);
        }
        else {
            eventBus.off('click', closeActionsMenu);
        }

        setShowActionsMenu(!showActionsMenu);
    }

    const closeActionsMenu = () => {
        setShowActionsMenu(false);
        eventBus.off('click', closeActionsMenu);
    }

    const deleteRepair = () => {
        closeActionsMenu();

        if (prompt(`Type 'CONFIRM' to confirm deletion of repair`) !== 'CONFIRM') return;

        axios.delete(`/api/repairs/delete/${id}`);

        navigate('/')
    }


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

        axios.put('/api/repairs/update', {...repair, id: id, notes: tempNotes})
            .catch(error => console.log(error));

        setRepair({...repair, notes: tempNotes})
        toggleEditNotesMode();
    }
    const updateAssessments = (value) => {
        setRepair({...repair, assessments: value})
    }

    const [customerModalOpen, setCustomerModalOpen] = useState(false);
    const [instrumentModalOpen, setInstrumentModalOpen] = useState(false);

    const statuses = ['Assessment', 'Open', 'Completed', 'Collected']
    const statusColors = ['red', 'orange', 'green', 'black']

    return (
        <div className='Repair'>
            
            <PageTitle>
                Repair {id}
                <span className={`status ${statusColors[repair.status]}`}>{statuses[repair.status]}</span>
                <ActionButton className='actions-menu-button' onClick={toggleActionsMenu}>
                    Actions
                    <img className='light' src={caretDownBlack} />
                    <img className='dark' src={caretDownWhite} />
                </ActionButton>

                {showActionsMenu && <div className='actions-menu'>
                    <ActionButton><img className='light' src={assessLight} /><img className='dark' img src={assessDark} />Assess</ActionButton>
                    <ActionButton><img className='light' src={archiveLight} /><img className='dark' img src={archiveDark} />Archive</ActionButton>
                    <ActionButton onClick={deleteRepair} className='red'><img img src={deleteRed} />Delete</ActionButton>
                </div>}
            </PageTitle>

            {repair.status !== undefined ? <>
            <div className='basic-details'>

                <ContentBlock className='customer-and-instrument-details'>

                    <CustomerDetails customer={repair.customer} inHouse={repair.in_house} openModal={() => setCustomerModalOpen(true)} />

                    <div className='divider' />
                    
                    <InstrumentDetails instrument={repair.instrument} statuses={instrumentStatuses} openModal={() => setInstrumentModalOpen(true)} />

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
            
            {repair.assessments && repair.assessments.length > 0 &&
            <ContentBlock className='assessment-block'>

                <Assessment assessments={repair.assessments} updateAssessments={updateAssessments} jobTypes={jobTypes} materials={materials} hourlyRate={hourlyRate} />

            </ContentBlock>
            }

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

            </> : 'Repair Not Found'}

        </div>
    );
}
export default Repair;