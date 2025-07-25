import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import PageTitle from '../../components/Text/PageTitle';
import ContentBlock from '../../components/Containers/ContentBlock';
import BlockTitle from '../../components/Text/BlockTitle';
import BlockText from '../../components/Text/BlockText';
import TextAreaInput from '../../components/Inputs/TextAreaInput';
import BlockTopRightButton from '../../components/Buttons/BlockTopRightButton';
import ActionButton from '../../components/Buttons/ActionButton';
import DatePicker from '../../components/Inputs/DatePicker';

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

import completeLight from '../../images/complete-icon/completeLight.png';
import completeDark from '../../images/complete-icon/completeDark.png';

import scheduleLight from '../../images/schedule-icon/scheduleLight.png';
import scheduleDark from '../../images/schedule-icon/scheduleDark.png';

import unlockLight from '../../images/unlock-icon/unlockLight.png';
import unlockDark from '../../images/unlock-icon/unlockDark.png';

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
            .then(response => setMaterials(response.data));
            

        axios.get('/api/settings/getHourlyRate')
            .then(response => setHourlyRate(response.data.hourly_rate / 100))
            .catch(error => console.log(error));
    }, [id])


    // #### STATE VARIABLES
    const [editNotesMode, setEditNotesMode] = useState(false);
    const [tempNotes, setTempNotes] = useState('');
    const [tempDeadline, setTempDeadline] = useState('');
    
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

    const deleteAction = () => {
        closeActionsMenu();

        if (prompt(`Type 'CONFIRM' to confirm deletion of repair`) !== 'CONFIRM') return;

        axios.delete(`/api/repairs/delete/${id}`);

        navigate('/')
    }

    const archiveAction = () => {
        axios.put('/api/repairs/archive', {id: id})
            .catch(error => console.log(error));
        
        setRepair({...repair, archived: true})
    }
    const unarchiveAction = () => {
        axios.put('/api/repairs/unarchive', {id: id})
            .catch(error => console.log(error));
        
        setRepair({...repair, archived: false})
    }

    const assessAction = () => {
        if (repair.assessments && repair.assessments.length > 0) return;

        setRepair({...repair, assessments: [{id: 0, date_created: getDateCreated(), time: 0, time_cost: 0, materials: [], job_type_id: 1, notes: ''}]})
    }

    const getDateCreated = () => {
        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        // Add leading zero to day and month if needed
        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;

        // Format the date as dd/mm/yyyy
        const formattedDate = `${day}/${month}/${year}`;

        return formattedDate;
    }

    const completeAction = () => {
        axios.put('/api/repairs/complete', {id: id})
            .catch(error => console.log(error));
        
        setRepair({...repair, status: 3});
    }
    const collectedAction = () => {
        axios.put('/api/repairs/collected', {id: id, instrument_id: repair.instrument.id})
            .catch(error => console.log(error));
        
        setRepair({...repair, status: 4, instrument: {...repair.instrument, status_id: 1}});
    }
    const reopenAction = () => {
        axios.put('/api/repairs/reopen', {id: id})
            .catch(error => console.log(error));
        
        setRepair({...repair, status: 2});
    }

    const scheduleAction = () => {
        const schedulingRepair = {
            id: id,
            instrument: repair.instrument,
            assessment: repair.assessments[repair.assessments.length - 1],
            deadline: repair.deadline
        }

        navigate('/', { state: { scheduling_repair: schedulingRepair } });
    }


    // #### DATA MANAGEMENT FUNCTIONS
    const updateCustomer = (value) => {
        setRepair({...repair, customer: value})
    }
    const updateInstrument = (value) => {
        setRepair({...repair, instrument: value})
    }
    const toggleEditNotesMode = () => {
        setTempNotes(repair.notes);
        setTempDeadline(repair.deadline);
        setEditNotesMode(!editNotesMode);
    }
    const updateNotes = () => {

        axios.put('/api/repairs/update', {...repair, id: id, notes: tempNotes, deadline: tempDeadline})
            .catch(error => console.log(error));

        setRepair({...repair, notes: tempNotes, deadline: tempDeadline})
        toggleEditNotesMode();
    }
    const assess = (assessment) => {

        axios.post('/api/repairs/assess', {...assessment, repair_id: id})
            .then(response => {

                const newAssessment = {...assessment, id: response.data.insertId}

                if (assessment.id === 0) {
                    setRepair({...repair,
                        status: 2,
                        assessments: [newAssessment]
                    })
                }
                else {
                    setRepair({...repair,
                        status: 2,
                        assessments: [...repair.assessments, newAssessment]
                    })
                }

            })
            .catch(error => console.log(error));

    }
    const overwriteAssessment = (currentAssessmentIndex, assessment) => {

        axios.put('/api/repairs/overwriteAssessment', assessment)
            .catch(error => console.log(error));

        setRepair({...repair,
            assessments: [
                ...repair.assessments.slice(0, currentAssessmentIndex),
                assessment,
                ...repair.assessments.slice(currentAssessmentIndex + 1)
            ]
        });
    }
    const cancelAssess = () => {
        setRepair({...repair, assessments: []});
    }

    const [customerModalOpen, setCustomerModalOpen] = useState(false);
    const [instrumentModalOpen, setInstrumentModalOpen] = useState(false);

    const statuses = ['Assessment', 'Open', 'Completed', 'Collected']
    const statusColors = ['red', 'orange', 'green', 'black']

    return (
        <div className='Repair'>
            
            <PageTitle>
                Repair {id}
                {repair.archived ?
                <span className={`status archived`}>Archived</span>
                :
                <span className={`status ${statusColors[repair.status-1]}`}>{statuses[repair.status-1]}</span>
                }
                <ActionButton className='actions-menu-button' onClick={toggleActionsMenu}>
                    Actions
                    <img className='light' src={caretDownBlack} />
                    <img className='dark' src={caretDownWhite} />
                </ActionButton>

                {showActionsMenu && <div className='actions-menu'>
                    
                    {repair.archived ?
                    <ActionButton onClick={unarchiveAction}><img className='light' src={archiveLight} /><img className='dark' img src={archiveDark} />Unarchive</ActionButton>
                    : <>
                    {repair.assessments && repair.assessments.length === 0 ?
                    <ActionButton onClick={assessAction}><img className='light' src={assessLight} /><img className='dark' img src={assessDark} />Assess</ActionButton>
                    :
                    repair.status === 2 ? <>
                    <ActionButton onClick={scheduleAction}><img className='light' src={scheduleLight} /><img className='dark' img src={scheduleDark} />Schedule</ActionButton>
                    <ActionButton onClick={completeAction}><img className='light' src={completeLight} /><img className='dark' img src={completeDark} />Complete</ActionButton>
                    </> : <>
                    <ActionButton onClick={reopenAction}><img className='light' src={unlockLight} /><img className='dark' img src={unlockDark} />Re-Open</ActionButton>
                    {repair.status === 3 &&
                    <ActionButton onClick={collectedAction}><img className='light' src={completeLight} /><img className='dark' img src={completeDark} />Collected</ActionButton>
                    }  
                    </>
                    }             
                    <ActionButton onClick={archiveAction}><img className='light' src={archiveLight} /><img className='dark' img src={archiveDark} />Archive</ActionButton>
                    </>}
                    <ActionButton onClick={deleteAction} className='red'><img img src={deleteRed} />Delete</ActionButton>
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

                    <BlockTitle>Deadline</BlockTitle>

                    {
                    editNotesMode ?
                    <DatePicker value={tempDeadline} onChange={(value) => setTempDeadline(value.replaceAll('-', '/'))} />
                    :
                    <BlockText>{repair.deadline}</BlockText>
                    }

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

                    {!repair.archived &&
                    <BlockTopRightButton onClick={toggleEditNotesMode} light={editLight} lightHover={editHoverLight} dark={editDark} darkHover={editHoverDark} />
                    }
                    </>
                    }

                </ContentBlock>

            </div>
            
            {repair.assessments && repair.assessments.length > 0 &&
            <ContentBlock className='assessment-block'>

                <Assessment assessments={repair.assessments} assess={assess} overwriteAssessment={overwriteAssessment} cancelAssess={cancelAssess} jobTypes={jobTypes} materials={materials} hourlyRate={hourlyRate} archived={repair.archived} />

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