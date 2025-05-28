import { useState } from 'react';

import BlockTitle from '../../../components/Text/BlockTitle';
import BlockText from '../../../components/Text/BlockText';
import ActionButton from '../../../components/Buttons/ActionButton';
import BlockTopRightButton from '../../../components/Buttons/BlockTopRightButton';
import DropdownSelect from '../../../components/Inputs/DropdownSelect';
import TextAreaInput from '../../../components/Inputs/TextAreaInput';

import './Assessment.css';

import editLight from '../../../images/edit-icon/editLight.png';
import editHoverLight from '../../../images/edit-icon/editHoverLight.png';
import editDark from '../../../images/edit-icon/editDark.png';
import editHoverDark from '../../../images/edit-icon/editHoverDark.png';

function Assessment(props) {

    // #### RAW TEST DATA
    const JOB_TYPE_OPTIONS = [
        {name: 'Unspecified', value: 0},
        {name: 'Repad', value: 1},
        {name: 'Clean', value: 2},
        {name: 'Wax', value: 3}
    ]

    const JOB_TYPES = [
        { id: 0, name: 'Unspecified', notes: '' },
        { id: 1, name: 'Repad', notes: 'bla bla bla' },
        { id: 2, name: 'Clean', notes: 'whish whosh whish whosh' },
        { id: 3, name: 'Wax', notes: 'wax on wax off, wax on wax off' },
    ]

    // #### STATE VARIABLES
    const [editNotesMode, setEditNotesMode] = useState(false);
    const [tempJobType, setTempJobType] = useState('');
    const [tempNotes, setTempNotes] = useState('');
    
    
    // #### DATA MANAGEMENT FUNCTIONS
    const toggleEditNotesMode = () => {
        setTempJobType(props.assessment.job_type_id);
        setTempNotes(props.assessment.notes);
        setEditNotesMode(!editNotesMode);
    }

    const updateNotes = () => {
        props.updateAssessment({...props.assessment, notes: tempNotes, job_type_id: tempJobType});
        toggleEditNotesMode();
    }

    const updateTempJobType = (value) => {
        setTempJobType(parseInt(value));
        if (parseInt(value) === 0) return;
        setTempNotes(JOB_TYPES.find(job_type => job_type.id === parseInt(value)).notes);
    }

    return (
        <div className='Assessment'>
            <div className='cost-estimate'>
                <BlockTitle>Cost Estimate</BlockTitle>
                <BlockText>As of 05/03/2025</BlockText>
                <div className='costs'>
                    <div className='cost-item'>
                        <BlockText className='title'>Repairer Time</BlockText>
                        <BlockText className='value'>5 Hours 30 Minutes</BlockText>
                        <BlockText className='cost'>£250</BlockText>
                    </div>
                    <div className='cost-item'>
                        <BlockText className='title'>Materials</BlockText>
                        <BlockText className='value'>Pads x5</BlockText>
                        <BlockText className='cost'>£15</BlockText>
                    </div>
                    <div className='cost-item'>
                        <BlockText className='title'></BlockText>
                        <BlockText className='value'>Different Pads x3</BlockText>
                        <BlockText className='cost'>£9</BlockText>
                    </div>
                    <div className='cost-item'>
                        <BlockText className='title total'>Total</BlockText>
                        <BlockText className='value'></BlockText>
                        <BlockText className='cost total'>£274</BlockText>
                    </div>
                </div>

                <div className='estimate-invoice-message'>
                    <p>Generate an estimate</p>
                    <ActionButton colored='true'>Download</ActionButton>
                </div>

                <BlockTopRightButton light={editLight} lightHover={editHoverLight} dark={editDark} darkHover={editHoverDark} />
            </div>

            <div className='divider' />

            <div className='assessment-notes'>

                <BlockTitle>Job Type</BlockTitle>

                {
                editNotesMode ? 
                <>
                <DropdownSelect options={JOB_TYPE_OPTIONS} value={tempJobType} onChange={updateTempJobType} />
                </>
                :
                <>
                <BlockText className='job-type'>{JOB_TYPES.find(job_type => job_type.id === props.assessment.job_type_id).name}</BlockText>
                </>
                }

                <BlockTitle className='assessment-notes-title'>Assessment Notes</BlockTitle>

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
                <BlockText className='notes'>{props.assessment.notes}</BlockText>

                <BlockTopRightButton onClick={toggleEditNotesMode} light={editLight} lightHover={editHoverLight} dark={editDark} darkHover={editHoverDark} />
                </>
                }
             
            </div>

        </div>
    );
}

export default Assessment;