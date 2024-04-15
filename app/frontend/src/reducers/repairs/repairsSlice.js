import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addCustomerToActiveCustomers } from '../customers/customersSlice';
import axios from 'axios';

import repairStatuses from '../../enums/repairStatuses';
import { addInstrumentToActiveInstruments } from '../instruments/instrumentsSlice';

const initialState = { repairsLoading: true, assessmentsLoading: false, loadingRepair: false, loadingRepairAssessments: false, activeRepairs: [], loadedRepair: null };

export const fetchActiveRepairs = createAsyncThunk('repairs/fetchActiveRepairs', async () => {
    return axios.get('/api/repairs/getActiveRepairs').then((resp) => resp.data).catch((err) => console.log(err));
});

export const fetchActiveAssessments = createAsyncThunk('repairs/fetchActiveAssessments', async () => {
    return axios.get('/api/assessments/getActiveAssessments').then((resp) => resp.data).catch((err) => console.log(err));
});

export const loadRepair = createAsyncThunk('repairs/loadRepair', async (id) => {
    return axios.get(`/api/repairs/getRepair/${id}`).then((resp) => resp.data[0]).catch((err) => console.log(err));
});

export const loadRepairAssessments = createAsyncThunk('repairs/loadRepairAssessments', async (id) => {
    return axios.get(`/api/assessments/getRepairAssessments/${id}`).then((resp) => resp.data).catch((err) => console.log(err));
});

export const createRepair = createAsyncThunk('repairs/createRepair', async (repairObject, { dispatch }) => {
    dispatch(repairAdded(repairObject));
    axios.post('/api/repairs/createRepair', repairObject);
});

export const addCustomer = createAsyncThunk('repairs/addCustomer', async (ids, { dispatch }) => {
    dispatch(customerAdded({ id: ids.id, customer_id: ids.customer_id }));
    dispatch(addCustomerToActiveCustomers(ids.customer_id));
    axios.put('/api/repairs/addCustomer', ids);
});

export const removeCustomer = createAsyncThunk('repairs/removeCustomer', async (id, { dispatch }) => {
    dispatch(customerRemoved(id));
    axios.put(`/api/repairs/removeCustomer/${id}`);
});

export const addInstrument = createAsyncThunk('repairs/addInstrument', async (ids, { dispatch }) => {
    dispatch(instrumentAdded({ id: ids.id, instrument_id: ids.instrument_id }));
    dispatch(addInstrumentToActiveInstruments(ids.instrument_id));
    axios.put('/api/repairs/addInstrument', ids);
});

export const removeInstrument = createAsyncThunk('repairs/removeInstrument', async (id, { dispatch }) => {
    dispatch(instrumentRemoved(id));
    axios.put(`/api/repairs/removeInstrument/${id}`);
});

export const editNotes = createAsyncThunk('repairs/editNotes', async (object, { dispatch }) => {
    dispatch(notesEdited(object));
    axios.put('/api/repairs/editNotes', object);
});

export const addAssessment = createAsyncThunk('repairs/addAssessment', async (assessmentObject, { dispatch }) => {
    axios.post('/api/assessments/addAssessment', assessmentObject).then(resp => {
        dispatch(repairAssessed({ id: resp.data.insertId, ...assessmentObject }));
    });
});

export const updateAssessment = createAsyncThunk('repairs/updateAssessment', async (assessmentObject, { dispatch }) => {
    dispatch(assessmentEdited(assessmentObject));
    axios.put('/api/assessments/updateAssessment', assessmentObject);
});

export const deleteAssessment = createAsyncThunk('repairs/deleteAssessment', async (ids, { dispatch }) => {
    dispatch(assessmentDeleted({ id: ids.id, assessment_id: ids.assessment_id }));
    axios.delete(`/api/assessments/deleteAssessment/${ids.assessment_id}`);
});

export const editOpenJobDetails = createAsyncThunk('repairs/editOpenJobDetails', async (details, { dispatch }) => {
    dispatch(openJobDetailsEdited(details));
    axios.put('/api/repairs/editOpenJobDetails', details);
})

export const incrementStatus = createAsyncThunk('repairs/incrementStatus', async (id, { dispatch }) => {
    dispatch(statusIncremented(id));
    axios.put(`/api/repairs/incrementStatus/${id}`);
});

export const decrementStatus = createAsyncThunk('repairs/decrementStatus', async (id, { dispatch }) => {
    dispatch(statusDecremented(id));
    axios.put(`/api/repairs/decrementStatus/${id}`);
});

export const toggleArchive = createAsyncThunk('repairs/toggleArchive', async (id, { dispatch }) => {
    dispatch(archiveToggled(id));
    axios.put(`/api/repairs/toggleArchive/${id}`);
});

export const deleteRepair = createAsyncThunk('repairs/deleteRepair', async (id, { dispatch }) => {
    dispatch(repairDeleted(id));
    axios.delete(`/api/repairs/deleteRepair/${id}`);
});



function findRepair(state, id) {
    const activeRepair = state.activeRepairs.find(repair => repair.id === id);
    if (activeRepair) return activeRepair;
    if (!state.loadedRepair) return null;
    if (state.loadedRepair.id === id) return state.loadedRepair;
    return null
}

const repairsSlice = createSlice({
    name: 'repairs',
    initialState,
    reducers: {
        repairAdded(state, action) {
            state.activeRepairs.push({
                id: action.payload.id,
                status: repairStatuses.CREATED,
                customer_id: -1,
                instrument_id: -1,
                notes: '',
                assessments: [],
                repairer_id: -1,
                deadline: null,
                date_created: action.payload.date_created,
                date_completed: null,
                date_collected: null,
                archived: 0
            });
        },
        customerAdded(state, action) {
            const repair = findRepair(state, action.payload.id);

            repair.customer_id = action.payload.customer_id
        },
        customerRemoved(state, action) {
            const repair = findRepair(state, action.payload);

            repair.customer_id = -1;
        },
        instrumentAdded(state, action) {
            const repair = findRepair(state, action.payload.id);

            repair.instrument_id = action.payload.instrument_id;
        },
        instrumentRemoved(state, action) {
            const repair = findRepair(state, action.payload);

            repair.instrument_id = -1;
        },
        notesEdited(state, action) {
            const repair = findRepair(state, action.payload.id);

            repair.notes = action.payload.notes
        },
        repairAssessed(state, action) {
            const repair = findRepair(state, action.payload.repair_id);

            repair.assessments.push(action.payload);
        },
        assessmentEdited(state, action) {
            const repair = findRepair(state, action.payload.repair_id);
            const assessment = repair.assessments.find(assessment => assessment.id = action.payload.id);

            assessment.time = action.payload.time;
            assessment.time_cost = action.payload.time_cost;
            assessment.materials = action.payload.materials;
            assessment.material_cost = action.payload.material_cost;
            assessment.material_cost_customer = action.payload.material_cost_customer;
            assessment.notes = action.payload.notes;
        },
        assessmentDeleted(state, action) {
            const repair = findRepair(state, action.payload.id);

            repair.assessments = repair.assessments.filter(assessment => assessment.id !== action.payload.assessment_id)
        },
        openJobDetailsEdited(state, action) {
            const repair = findRepair(state, action.payload.id);

            repair.repairer_id = action.payload.repairer_id;
            repair.deadline = action.payload.deadline;
        },
        statusIncremented(state, action) {
            const repair = findRepair(state, action.payload);

            repair.status++;

            if (repair.status >= repairStatuses.COLLECTED) {
                state.loadedRepair = repair;
            }
        },
        statusDecremented(state, action) {
            const repair = findRepair(state, action.payload);

            if (repair.status >= repairStatuses.COLLECTED) {
                state.loadedRepair = null;
                if (state.activeRepairs.filter(repair => repair.id === action.payload).length === 0) state.activeRepairs.push(repair)
            }

            repair.status--;
        },
        archiveToggled(state, action) {
            const repair = findRepair(state, action.payload);

            repair.archived = 1 - repair.archived;
        },
        repairDeleted(state, action) {
            if (state.loadedRepair && state.loadedRepair.id === action.payload) {
                return { ...state, loadedRepair: null }
            }
            return { ...state, activeRepairs: state.activeRepairs.filter(repair => repair.id !== action.payload)};
        },
        unloadRepair(state) {
            state.loadedRepair = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchActiveRepairs.pending, (state) => {
                state.repairsLoading = true;
            })
            .addCase(fetchActiveRepairs.fulfilled, (state, action) => {
                state.repairsLoading = false;
                state.activeRepairs = action.payload;
                state.activeRepairs.forEach(repair => {
                    repair.assessments = [];
                });
            })
            .addCase(fetchActiveRepairs.rejected, (state) => {
                state.repairsLoading = false;
            })
            .addCase(fetchActiveAssessments.pending, (state) => {
                state.assessmentsLoading = true;
            })
            .addCase(fetchActiveAssessments.fulfilled, (state, action) => {
                state.assessmentsLoading = false;
                action.payload.forEach(assessment => {
                    const repair = findRepair(state, assessment.repair_id);
                    if (repair) repair.assessments.push(assessment);
                });

            })
            .addCase(fetchActiveAssessments.rejected, (state) => {
                state.assessmentsLoading = false;
            })
            .addCase(loadRepair.pending, (state) => {
                state.loadingRepair = true;
            })
            .addCase(loadRepair.fulfilled, (state, action) => {
                state.loadingRepair = false;
                if (action.payload) {
                    state.loadedRepair = action.payload;
                    state.loadedRepair.assessments = [];
                }
            })
            .addCase(loadRepair.rejected, (state) => {
                state.loadingRepair = false;
            })
            .addCase(loadRepairAssessments.pending, (state) => {
                state.loadingRepairAssessments = true;
            })
            .addCase(loadRepairAssessments.fulfilled, (state, action) => {
                state.loadingRepairAssessments = false;
                if (state.loadedRepair) {
                    state.loadedRepair.assessments = action.payload;
                }
            })
            .addCase(loadRepairAssessments.rejected, (state) => {
                state.loadingRepairAssessments = false;
            })
    }
})

export const { repairAdded, repairEdited, repairAssessed, assessmentEdited, assessmentDeleted, customerAdded, customerRemoved, instrumentAdded, instrumentRemoved,
    notesEdited, openJobDetailsEdited, statusIncremented, statusDecremented, archiveToggled, repairDeleted, unloadRepair } = repairsSlice.actions;

export default repairsSlice.reducer;