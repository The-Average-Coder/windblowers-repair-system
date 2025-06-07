import { useState } from 'react';

import BlockTitle from '../../../components/Text/BlockTitle';
import BlockText from '../../../components/Text/BlockText';
import ActionButton from '../../../components/Buttons/ActionButton';
import TextInput from '../../../components/Inputs/TextInput';

import './MaterialsSettings.css';

import plusWhite from '../../../images/plus-icon/plusWhite.png';

import axios from 'axios';

function MaterialsSettings(props) {

    // #### STATE VARIABLES
    const [creatingMaterial, setCreatingMaterial] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState({});

    const [newMaterialName, setNewMaterialName] = useState('');
    const [newMaterialPrice, setNewMaterialPrice] = useState(0);

    // #### MATERIAL MANAGEMENT FUNCTIONS
    const saveMaterialEdit = () => {
        const newMaterials = [...props.materials]
        const updatedMaterial = newMaterials.find(material => material.id === editingMaterial.id)
        updatedMaterial.name = editingMaterial.name;
        updatedMaterial.price = editingMaterial.price;
        props.updateMaterials(newMaterials)

        axios.put('/api/settings/updateMaterial', updatedMaterial)
            .catch(error => console.log(error));

        setEditingMaterial({})
    }
    const deleteMaterial = (id) => {
        if (prompt(`Type 'CONFIRM' to confirm deletion of material '${props.materials.find(material => material.id === id).name}'`) !== 'CONFIRM') return;
        
        props.updateMaterials(props.materials.filter(job => job.id !== id));

        axios.delete(`/api/settings/deleteMaterial/${id}`)
            .catch(error => console.log(error));
    }
    const cancelNewMaterial = () => {
        setNewMaterialName('');
        setNewMaterialPrice(0);
        setCreatingMaterial(false);
    }
    const addNewMaterial = () => {
        if (newMaterialName.trim() === '') return;
        
        axios.post('/api/settings/addMaterial', {name: newMaterialName, price: newMaterialPrice})
            .then(response => {
                props.updateMaterials([...props.materials, {
                    id: response.data.insertId,
                    name: newMaterialName,
                    price: newMaterialPrice
                }]);

                setNewMaterialName('');
                setNewMaterialPrice(0);
                setCreatingMaterial(false);
            })
            .catch(error => console.log(error));
    }

    // #### RENDERED SETTINGS CONTENT
    const renderedMaterialsTable = <div className='materials-table'>
        <BlockTitle className='name'>Name</BlockTitle>
        <BlockTitle className='notes'>Price</BlockTitle>
        <div />
        <div />
        {props.materials ? props.materials.length === 0 && !creatingMaterial && 'No Materials' : 'Loading'}
        {props.materials && props.materials.map(material => editingMaterial.id !== undefined && editingMaterial.id === material.id ? <>
            <TextInput value={editingMaterial.name} onChange={(value) => setEditingMaterial({...editingMaterial, name: value})} />
            <TextInput value={`£${editingMaterial.price}`} onChange={(value) => setEditingMaterial({...editingMaterial, price: value.slice(1).split('').filter(char => char >= '0' && char <= '9' || char =='.').join('')})} />
            <ActionButton onClick={() => setEditingMaterial({})}>Cancel</ActionButton>
            <ActionButton onClick={saveMaterialEdit}>Save</ActionButton>
            </> : <>
            <BlockText>{material.name}</BlockText>
            <BlockText>£{parseFloat(material.price).toFixed(2)}</BlockText>
            <ActionButton onClick={() => setEditingMaterial(material)}>Edit</ActionButton>
            <ActionButton onClick={() => deleteMaterial(material.id)}>Delete</ActionButton>
            </>
        )}
        {creatingMaterial && <>
            <TextInput value={newMaterialName} onChange={(value) => setNewMaterialName(value)} />
            <TextInput value={`£${newMaterialPrice}`} onChange={(value) => setNewMaterialPrice(value.slice(1).split('').filter(char => char >= '0' && char <= '9').join(''))} />
            <ActionButton onClick={cancelNewMaterial}>Cancel</ActionButton>
            <ActionButton onClick={addNewMaterial}>Save</ActionButton>
        </>}
    </div>

    return (
        <div className='MaterialsSettings'>

            <div className='materials-title'>
                <div>
                    <BlockTitle>Materials</BlockTitle>
                    <BlockText>Add materials and set their prices.</BlockText>
                </div>
                <ActionButton colored='true' onClick={() => setCreatingMaterial(true)}><img src={plusWhite} />Add Material</ActionButton>
             </div>

             {renderedMaterialsTable}

        </div>
    );
}

export default MaterialsSettings;