import { useEffect, useState } from 'react';

import BlockTitle from '../../../components/Text/BlockTitle';
import BlockText from '../../../components/Text/BlockText';
import ActionButton from '../../../components/Buttons/ActionButton';
import BlockTopRightButton from '../../../components/Buttons/BlockTopRightButton';
import DropdownSelect from '../../../components/Inputs/DropdownSelect';
import TextAreaInput from '../../../components/Inputs/TextAreaInput';
import HoursDropdownSelect from '../../../components/Inputs/HoursDropdownSelect';
import MinutesDropdownSelect from '../../../components/Inputs/MinutesDropdownSelect';
import TextInput from '../../../components/Inputs/TextInput';

import './Assessment.css';

import editLight from '../../../images/edit-icon/editLight.png';
import editHoverLight from '../../../images/edit-icon/editHoverLight.png';
import editDark from '../../../images/edit-icon/editDark.png';
import editHoverDark from '../../../images/edit-icon/editHoverDark.png';

import deleteRed from '../../../images/delete-icon/deleteRed.png';

function Assessment(props) {

    // #### STATE VARIABLES
    const [currentAssessment, setCurrentAssessment] = useState(-1);

    const [editMode, setEditMode] = useState(false);
    const [tempNotes, setTempNotes] = useState('');
    const [tempTime, setTempTime] = useState(0);
    const [tempTimeCost, setTempTimeCost] = useState(0);
    const [tempMaterials, setTempMaterials] = useState([]);

    const [firstAssessment, setFirstAssessment] = useState(false);
    const [tempJobType, setTempJobType] = useState();


    // #### STATE VARIABLE INITIALISATION
    useEffect(() => {

        if (props.assessments && props.assessments.length > 0) {
            setCurrentAssessment(props.assessments.length - 1);

            if (props.assessments[props.assessments.length - 1].id === 0) {
                setEditMode(true);
                setFirstAssessment(true);
                setTempMaterials([{id: 0, quantity: 0, cost: 0}])
            }
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
        if (props.assessments[currentAssessment].materials.find(material => material.id === 0) === undefined) {
            setTempMaterials([...props.assessments[currentAssessment].materials, { id: 0, quantity: 0, cost: 0 }]);
        }
        else {
            setTempMaterials(props.assessments[currentAssessment].materials);
        }
        setEditMode(!editMode);
    }

    const switchAssessment = (id) => {
        setCurrentAssessment(parseInt(id));
        if (editMode) {
            setTempNotes(props.assessments[id].notes)
            setTempTime(props.assessments[id].time)
            setTempTimeCost(props.assessments[id].time_cost)
            if (props.assessments[id].materials.find(material => material.id === 0) === undefined) {
                setTempMaterials([...props.assessments[id].materials, { id: 0, quantity: 0, cost: 0 }]);
            }
            else {
                setTempMaterials(props.assessments[id].materials);
            }
        }
    }

    const cancelEdit = () => {
        if (firstAssessment) {
            props.cancelAssess();
        }
        toggleEditMode();
    }

    const overwriteAssessment = () => {
        if (tempMaterials.find(material => material.id === 0).cost === '' || parseFloat(tempMaterials.find(material => material.id === 0).cost) === 0) {
            props.overwriteAssessment(currentAssessment, {...props.assessments[currentAssessment], notes: tempNotes, time: tempTime, time_cost: tempTimeCost, materials: tempMaterials.filter(material => material.id !== 0)});
        }
        else {
            props.overwriteAssessment(currentAssessment, {...props.assessments[currentAssessment], notes: tempNotes, time: tempTime, time_cost: tempTimeCost, materials: tempMaterials});
        }
        toggleEditMode();
    }

    const updateAssessment = () => {
        let updatedMaterialsList;
        if (tempMaterials.find(material => material.id === 0).cost === '' || parseFloat(tempMaterials.find(material => material.id === 0).cost) === 0) {
            updatedMaterialsList = tempMaterials.filter(material => material.id !== 0);
        }
        else {
            updatedMaterialsList = tempMaterials;
        }

        if (firstAssessment) {
            props.assess({...props.assessments[currentAssessment], date_created: getDateCreated(), notes: tempNotes, time: tempTime, time_cost: tempTimeCost, materials: updatedMaterialsList, job_type_id: parseInt(tempJobType) || 1});
            setFirstAssessment(false);
        }
        else {
            props.assess({...props.assessments[currentAssessment], date_created: getDateCreated(), notes: tempNotes, time: tempTime, time_cost: tempTimeCost, materials: updatedMaterialsList});
            setCurrentAssessment(currentAssessment + 1);
        }

        toggleEditMode();
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

    // #### ASSESSMENT EDITING
    const updateTime = (time) => {
        console.log(props.hourlyRate)
        setTempTime(time);
        setTempTimeCost(Math.round(time / 60 * props.hourlyRate * 100) / 100);
    }

    const addMaterial = (id) => {
        if (tempMaterials.find(material => material.id === parseInt(id))) return;
        setTempMaterials([...tempMaterials, { id: id, quantity: 0, cost: 0 }]);
    }

    const updateMaterialQuantity = (id, quantity) => {
        const newMaterials = [...tempMaterials];
        const updatedMaterial = newMaterials.find(material => material.id === id);
        const newQuantity = quantity.split('').filter(char => char >= '0' && char <= '9').join('');
        updatedMaterial.quantity = newQuantity;
        updatedMaterial.cost = parseFloat(newQuantity * props.materials.find(material => material.id === parseInt(id)).price).toFixed(2);
        setTempMaterials(newMaterials);
    }

    const updateMaterialCost = (id, cost) => {
        const newMaterials = [...tempMaterials];
        const updatedMaterial = newMaterials.find(material => material.id === id);
        const newCost = cost.split('').filter(char => char >= '0' && char <= '9' || char === '.').join('');
        updatedMaterial.cost = newCost;
        setTempMaterials(newMaterials);
    }

    const removeMaterial = (id) => {
        setTempMaterials(tempMaterials.filter(material => parseInt(material.id) !== parseInt(id)))
    }

    const updateJobType = (job_type_id) => {
        setTempJobType(job_type_id);

        const jobType = props.jobTypes.find(jobType => jobType.id === parseInt(job_type_id));

        setTempTime(jobType.time)
        setTempTimeCost(Math.round(jobType.time / 60 * props.hourlyRate * 100) / 100);

        const materials = props.jobTypes.find(jobType => jobType.id === parseInt(job_type_id)).materials;
        console.log(materials)

        let newTempMaterials = [{id: 0, quantity: 0, cost: 0}]

        for (const jobTypeMaterial of materials) {
            const material = props.materials.find(material => material.id === parseInt(jobTypeMaterial.id));
            console.log(props.materials)
            console.log(jobTypeMaterial)
            if (!material) continue;

            newTempMaterials.push({id: material.id, quantity: jobTypeMaterial.quantity, cost: parseInt(jobTypeMaterial.quantity) * material.price});
        }

        setTempMaterials(newTempMaterials)

        setTempNotes(jobType.notes)
    }

    return (
        <div className='Assessment'>

            {currentAssessment !== -1 && props.assessments[currentAssessment] ? <>

            <div className='cost-estimate'>
                <BlockTitle>Cost Estimate</BlockTitle>
                <BlockText>As of {props.assessments.length > 1 ?
                    <DropdownSelect className='assessment-select' value={currentAssessment} onChange={switchAssessment}
                    options={props.assessments.map((assessment, index) => {return {name: assessment.date_created, value: index}})} />
                : props.assessments[0].date_created}</BlockText>

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
                    <BlockText className='title'>Materials</BlockText>
                    <div className='materials-input-list'>
                        {tempMaterials.map(material => {
                            if (parseInt(material.id) === 0) return;
                            return <div className='material'>
                                <BlockText>{props.materials.find(otherMaterial => otherMaterial.id === parseInt(material.id)).name}</BlockText>
                                <TextInput className='quantity-input' value={material.quantity} onChange={(value) => updateMaterialQuantity(material.id, value)} />
                                <TextInput className='cost-input' value={`£${material.cost}`} onChange={(value) => updateMaterialCost(material.id, value.slice(1))} />
                                <ActionButton className='delete-material' onClick={() => removeMaterial(material.id)}><img src={deleteRed} /></ActionButton>
                            </div>
                        })}
                        <div className='material'>
                            <BlockText>Misc Materials</BlockText>
                            <TextInput className='cost-input' value={`£${tempMaterials.find(material => material.id === 0).cost}`} onChange={(value) => updateMaterialCost(0, value.slice(1))} />
                        </div>
                        <DropdownSelect options={props.materials.map(materialOption => {return {name: materialOption.name, value: materialOption.id}})} placeholder='Add Material' value={''} onChange={addMaterial} />
                    </div>
                </div>

                </div>
                : 
                <div className='costs'>
                    <div className='cost-item'>
                        <BlockText className='title'>Repairer Time</BlockText>
                        <div className='cost-contents'>
                            <div className='cost-content'>
                                <BlockText className='value'>{Math.floor(props.assessments[currentAssessment].time / 60)} Hours {props.assessments[currentAssessment].time % 60} Minutes</BlockText>
                                <BlockText className='cost'>£{parseFloat(props.assessments[currentAssessment].time_cost).toFixed(2)}</BlockText>
                            </div>
                        </div>
                    </div>
                    {props.materials.length > 0 && props.assessments[currentAssessment].materials.length > 0 && <div className='cost-item'>
                        <BlockText className='title'>Materials</BlockText>
                        <div className='cost-contents'>
                            {props.assessments[currentAssessment].materials.map(material => {
                                if (material.id === 0) return;
                                return <div className='cost-content'>
                                    <BlockText className='value'>{props.materials.find(otherMaterial => otherMaterial.id === parseInt(material.id)).name} x{material.quantity}</BlockText>
                                    <BlockText className='cost'>£{parseFloat(material.cost).toFixed(2)}</BlockText>
                                </div>
                            })}
                            {props.assessments[currentAssessment].materials.find(material => material.id === 0) && <div className='cost-content'>
                                <BlockText className='value'>Misc Materials</BlockText>
                                <BlockText className='cost'>£{parseFloat(props.assessments[currentAssessment].materials.find(material => material.id === 0).cost).toFixed(2)}</BlockText>
                            </div>}
                        </div>
                    </div>}
                    <div className='cost-item'>
                        <BlockText className='title total'>Total</BlockText>
                        <BlockText className='value'></BlockText>
                        <BlockText className='cost total'>£{parseFloat(props.assessments[currentAssessment].time_cost + props.assessments[currentAssessment].materials.reduce((partialSum, a) => partialSum + parseFloat(a.cost), 0)).toFixed(2)}</BlockText>
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
                {editMode && firstAssessment ?
                <DropdownSelect options={props.jobTypes.map(jobType => {return {name: jobType.name, value: jobType.id}})} placeholder='Select Job Type' value={tempJobType} onChange={updateJobType} />
                :
                <BlockText className='job-type'>{props.jobTypes.length > 0 && props.jobTypes.find(jobType => jobType.id === props.assessments[currentAssessment].job_type_id).name}</BlockText>
                }

                <BlockTitle className='assessment-notes-title'>Assessment Notes</BlockTitle>
                {
                editMode ? 
                <>
                <TextAreaInput value={tempNotes} onChange={setTempNotes} />

                <div className='buttons'>
                    <ActionButton onClick={cancelEdit}>Cancel</ActionButton>

                    {!firstAssessment &&
                    <ActionButton onClick={overwriteAssessment}>Overwrite</ActionButton>
                    }
                    
                    {currentAssessment === props.assessments.length - 1 &&
                    <ActionButton onClick={updateAssessment} colored='true'>{firstAssessment ? 'Save' : 'Update'}</ActionButton>
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