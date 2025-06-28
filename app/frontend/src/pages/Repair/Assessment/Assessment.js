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
import HoursDropdownSelect from '../../../components/Inputs/HoursDropdownSelect';
import MinutesDropdownSelect from '../../../components/Inputs/MinutesDropdownSelect';
import TextInput from '../../../components/Inputs/TextInput';

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

    }, [])
    
    
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
        setCurrentAssessment(currentAssessment + 1);
        toggleEditMode();
    }

    const updateTime = (time) => {
        console.log(props.hourlyRate)
        setTempTime(time);
        setTempTimeCost(Math.round(time / 60 * props.hourlyRate * 100) / 100);
    }

    return (
        <div className='Assessment'>

            {currentAssessment !== -1 && props.assessments[currentAssessment].id ? <>

            <div className='cost-estimate'>
                <BlockTitle>Cost Estimate</BlockTitle>
                <BlockText>As of {props.assessments.length > 1 ?
                    <DropdownSelect className='assessment-select' value={currentAssessment} onChange={(value) => setCurrentAssessment(parseInt(value))}
                    options={props.assessments.map((assessment, index) => {return {name: assessment.date_created, value: index}})} />
                : '05/03/2025'}</BlockText>

                {editMode ? <div className='costs'>
                <div className='time-inputs'>
                    <BlockText>Repairer Time</BlockText>
                    <div className='inputs'>
                        <HoursDropdownSelect value={Math.floor(tempTime / 60)} onChange={(value) => updateTime(parseInt(value) * 60 + tempTime % 60)} />
                        <MinutesDropdownSelect value={tempTime % 60} onChange={(value) => updateTime(Math.floor(tempTime / 60) * 60 + parseInt(value))} />
                        <TextInput value={`£${tempTimeCost}`} onChange={(value) => setTempTimeCost(value.slice(1).split('').filter(char => char >= '0' && char <= '9' || char == '.').join(''))} />
                    </div>
                </div>

                <div className='materials-input'>
                    <BlockText>Materials</BlockText>
                    <div className='materials-input-list'>
                        <div className='material'>
                        </div>
                        <DropdownSelect options={props.materials.map(materialOption => {return {name: materialOption.name, value: materialOption.id}})} />
                    </div>
                </div>

                </div>
                : 
                <div className='costs'>
                    <div className='cost-item'>
                        <BlockText className='title'>Repairer Time</BlockText>
                        <BlockText className='value'>{Math.floor(props.assessments[currentAssessment].time / 60)} Hours {props.assessments[currentAssessment].time % 60} Minutes</BlockText>
                        <BlockText className='cost'>£{parseFloat(props.assessments[currentAssessment].time_cost).toFixed(2)}</BlockText>
                    </div>
                    <div className='cost-item'>
                        <BlockText className='title'>Materials</BlockText>
                        <div className='cost-contents'>
                            <div className='cost-content'>
                                <BlockText className='value'>Pads x5</BlockText>
                                <BlockText className='cost'>£15</BlockText>
                            </div>
                            <div className='cost-content'>
                                <BlockText className='value'>Different Pads x3</BlockText>
                                <BlockText className='cost'>£9</BlockText>
                            </div>
                        </div>
                    </div>
                    <div className='cost-item'>
                        <BlockText className='title total'>Total</BlockText>
                        <BlockText className='value'></BlockText>
                        <BlockText className='cost total'>£274</BlockText>
                    </div>
                </div>}

                <div className='estimate-invoice-message'>
                    <p>Generate an estimate</p>
                    <ActionButton colored='true'>Download</ActionButton>
                </div>
            </div>

            <div className='divider' />

            <div className='assessment-notes'>

                <BlockTitle>Job Type</BlockTitle>
                <BlockText className='job-type'>{props.jobTypes.length > 0 && props.jobTypes.find(jobType => jobType.id === props.assessments[currentAssessment].job_type_id).name}</BlockText>


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