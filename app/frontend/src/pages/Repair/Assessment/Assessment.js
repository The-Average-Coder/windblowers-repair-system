import { useEffect, useState } from 'react';

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

    // #### STATE VARIABLES
    const [currentAssessment, setCurrentAssessment] = useState(-1);

    const [editMode, setEditMode] = useState(false);
    const [tempNotes, setTempNotes] = useState('');
    const [tempTime, setTempTime] = useState(0);
    const [tempTimeCost, setTempTimeCost] = useState(0);
    const [tempMaterials, setTempMaterials] = useState([]);


    // #### STATE VARIABLE INITIALISATION
    useEffect(() => {

        if (props.assessments && props.assessments.length > 0) {
            setCurrentAssessment(props.assessments.length - 1);
        }
        else {
            setCurrentAssessment(-1);
        }

    }, [props.assessments])
    
    
    // #### DATA MANAGEMENT FUNCTIONS
    const toggleEditMode = () => {
        setTempNotes(props.assessments[currentAssessment].notes);
        setTempTime(props.assessments[currentAssessment].time);
        setTempTimeCost(props.assessments[currentAssessment].time_cost);
        setTempMaterials(props.assessments[currentAssessment].materials);
        setEditMode(!editMode);
    }

    const overwriteAssessment = () => {
        props.updateAssessments([...props.assessments.slice(0, currentAssessment), {...props.assessments[currentAssessment], notes: tempNotes, time: tempTime, time_cost: tempTimeCost, materials: tempMaterials}, ...props.assessments.slice(currentAssessment + 1)]);
        console.log([...props.assessments.slice(0, currentAssessment), {...props.assessments[currentAssessment], notes: tempNotes, time: tempTime, time_cost: tempTimeCost, materials: tempMaterials}, ...props.assessments.slice(currentAssessment + 1)])
        toggleEditMode();
    }

    const updateAssessment = () => {
        props.updateAssessments([...props.assessments, {...props.assessments[currentAssessment], notes: tempNotes, time: tempTime, time_cost: tempTimeCost, materials: tempMaterials}]);
        toggleEditMode();
    }

    return (
        <div className='Assessment'>

            {currentAssessment !== -1 ? <>

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
            </div>

            <div className='divider' />

            <div className='assessment-notes'>

                <BlockTitle>Job Type</BlockTitle>
                <BlockText className='job-type'>{props.jobTypes.find(jobType => jobType.id === props.assessments[currentAssessment].job_type_id).name}</BlockText>


                <BlockTitle className='assessment-notes-title'>Assessment Notes</BlockTitle>
                {
                editMode ? 
                <>
                <TextAreaInput value={tempNotes} onChange={setTempNotes} />

                <div className='buttons'>
                    <ActionButton onClick={toggleEditMode}>Cancel</ActionButton>
                    <ActionButton onClick={overwriteAssessment}>Overwrite</ActionButton>
                    
                    {currentAssessment === props.assessments.length - 1 &&
                    <ActionButton onClick={updateAssessment} colored='true'>Update</ActionButton>
                    }
                </div>
                </>
                :
                <>
                <BlockText className='notes'>{props.assessments[currentAssessment].notes}</BlockText>

                <BlockTopRightButton onClick={toggleEditMode} light={editLight} lightHover={editHoverLight} dark={editDark} darkHover={editHoverDark} />
                </>
                }
             
            </div>

            </> : 'Loading' }

        </div>
    );
}

export default Assessment;