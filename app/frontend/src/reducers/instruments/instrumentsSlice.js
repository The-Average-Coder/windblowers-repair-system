import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addInstrument, removeInstrumentFromRepairs } from '../repairs/repairsSlice';
import axios from 'axios';

const initialState = { instrumentsLoading: false, loadingInstrument: false, activeInstruments: [], loadedInstrument: null }

export const fetchActiveInstruments = createAsyncThunk('instruments/fetchActiveInstruments', async () => {
    return axios.get('/api/instruments/getActiveInstruments').then((resp) => resp.data).catch((err) => console.log(err));
});

export const loadInstrument = createAsyncThunk('instruments/loadInstrument', async (id) => {
    return axios.get(`/api/instruments/getInstrument/${id}`).then((resp) => resp.data[0]).catch((err) => console.log(err));
});

export const createInstrument = createAsyncThunk('instruments/createInstrument', async (instrumentObject, { dispatch }) => {
    const id = await axios.post('/api/instruments/createInstrument', instrumentObject).then(resp => resp.data.insertId);
    dispatch(instrumentAdded({ id: id, ...instrumentObject }));
    return id;
});

export const createInstrumentOnRepair = createAsyncThunk('instruments/createInstrumentOnRepair', async (data, { dispatch }) => {
    axios.post('/api/instruments/createInstrument', data.instrument).then(resp => {
        dispatch(instrumentAdded({ id: resp.data.insertId, ...data.instrument }));
        dispatch(addInstrument({ id: data.repair_id, instrument_id: resp.data.insertId }));
    });
});

export const addInstrumentToActiveInstruments = createAsyncThunk('instruments/addInstrumentToActiveInstruments', async (id, { dispatch }) => {
    return axios.get(`/api/instruments/getInstrument/${id}`).then(resp => {dispatch(instrumentAddedToRepair(resp.data[0]));})
});

export const editInstrument = createAsyncThunk('instruments/editInstrument', async (instrumentObject, { dispatch }) => {
    dispatch(instrumentEdited(instrumentObject));
    axios.put('/api/instruments/editInstrument', instrumentObject);
});

export const editInstrumentInWorkshop = createAsyncThunk('instruments/editInstrumentInWorkshop', async (payloadObject, { dispatch }) => {
    dispatch(instrumentInWorkshopEdited(payloadObject));
    axios.put('/api/instruments/editInstrumentInWorkshop/', payloadObject);
})

export const deleteInstrument = createAsyncThunk('instruments/deleteInstrument', async (id, { dispatch }) => {
    dispatch(instrumentDeleted(id));
    axios.delete(`/api/instruments/deleteInstrument/${id}`);
    dispatch(removeInstrumentFromRepairs(id));
});

const instrumentsSlice = createSlice({
    name: 'instruments',
    initialState,
    reducers: {
        instrumentAdded(state, action) {
            state.activeInstruments.push(action.payload);
        },
        instrumentEdited(state, action) {
            let instrument = state.activeInstruments.find(instrument => instrument.id === action.payload.id);
            if (instrument === undefined && state.loadedInstrument.id === action.payload.id) instrument = state.loadedInstrument;

            instrument.type = action.payload.type;
            instrument.manufacturer = action.payload.manufacturer;
            instrument.model = action.payload.model;
            instrument.serial_number = action.payload.serial_number;
            instrument.in_workshop = action.payload.in_workshop;
        },
        instrumentInWorkshopEdited(state, action) {
            let instrument = state.activeInstruments.find(instrument => instrument.id === action.payload.id);
            if (instrument === undefined && state.loadedInstrument.id === action.payload.id) instrument = state.loadedInstrument;

            instrument.in_workshop = action.payload.in_workshop;
        },
        instrumentAddedToRepair(state, action) {
            if (!state.activeInstruments.find(instrument => instrument.id === action.payload.id)) state.activeInstruments.push(action.payload)
        },
        instrumentDeleted(state, action) {
            return { ...state, activeInstruments: state.activeInstruments.filter(instrument => instrument.id !== action.payload) };
        },
        unloadInstrument(state) {
            state.loadedInstrument = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchActiveInstruments.pending, (state) => {
                state.instrumentsLoading = true;
            })
            .addCase(fetchActiveInstruments.fulfilled, (state, action) => {
                state.instrumentsLoading = false;
                state.activeInstruments = action.payload;
            })
            .addCase(fetchActiveInstruments.rejected, (state) => {
                state.instrumentsLoading = false;
            })
            .addCase(addInstrumentToActiveInstruments.pending, (state) => {
                state.instrumentsLoading = true;
            })
            .addCase(addInstrumentToActiveInstruments.fulfilled, (state, action) => {
                state.instrumentsLoading = false;
            })
            .addCase(addInstrumentToActiveInstruments.rejected, (state) => {
                state.instrumentsLoading = false;
            })
            .addCase(loadInstrument.pending, (state) => {
                state.loadingInstrument = true;
            })
            .addCase(loadInstrument.fulfilled, (state, action) => {
                state.loadingInstrument = false;
                state.loadedInstrument = action.payload;
            })
            .addCase(loadInstrument.rejected, (state) => {
                state.loadingInstrument = false;
            })
    }
})

export const { instrumentAdded, instrumentEdited, instrumentInWorkshopEdited, instrumentAddedToRepair, instrumentDeleted, unloadInstrument } = instrumentsSlice.actions; 

export default instrumentsSlice.reducer;