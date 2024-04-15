import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addInstrument } from '../repairs/repairsSlice';
import axios from 'axios';

const initialState = { instrumentsLoading: false, loadingInstrument: false, activeInstruments: [], loadedInstrument: null }

export const fetchActiveInstruments = createAsyncThunk('instruments/fetchActiveInstruments', async () => {
    return axios.get('/api/instruments/getActiveInstruments').then((resp) => resp.data).catch((err) => console.log(err));
});

export const loadInstrument = createAsyncThunk('instruments/loadInstrument', async (id) => {
    return axios.get(`/api/instruments/getInstrument/${id}`).then((resp) => resp.data[0]).catch((err) => console.log(err));
});

export const createInstrument = createAsyncThunk('customers/createInstrument', async (instrumentObject, { dispatch }) => {
    const id = await axios.post('/api/instruments/createInstrument', instrumentObject).then(resp => resp.data.insertId);
    dispatch(instrumentAdded({ id: id, ...instrumentObject }));
    return id;
});

export const createInstrumentOnRepair = createAsyncThunk('customers/createInstrumentOnRepair', async (data, { dispatch }) => {
    axios.post('/api/instruments/createInstrument', data.instrument).then(resp => {
        dispatch(instrumentAdded({ id: resp.data.insertId, ...data.instrument }));
        dispatch(addInstrument({ id: data.repair_id, instrument_id: resp.data.insertId }));
    });
});

export const addInstrumentToActiveInstruments = createAsyncThunk('customers/addInstrumentToActiveInstruments', async (id, { dispatch }) => {
    return axios.get(`/api/instruments/getInstrument/${id}`).then(resp => {dispatch(instrumentAddedToRepair(resp.data[0]));})
});

export const editInstrument = createAsyncThunk('customers/editInstrument', async (instrumentObject, { dispatch }) => {
    dispatch(instrumentEdited(instrumentObject));
    axios.put('/api/instruments/editInstrument', instrumentObject);
});

export const deleteInstrument = createAsyncThunk('customers/deleteInstrument', async (id, { dispatch }) => {
    dispatch(instrumentDeleted(id));
    axios.delete(`/api/instruments/deleteInstrument/${id}`);
});

const instrumentsSlice = createSlice({
    name: 'instruments',
    initialState,
    reducers: {
        instrumentAdded(state, action) {
            state.activeInstruments.push(action.payload);
        },
        instrumentEdited(state, action) {
            const instrument = state.activeInstruments.find(instrument => instrument.id === action.payload.id);

            instrument.type = action.payload.type;
            instrument.manufacturer = action.payload.manufacturer;
            instrument.model = action.payload.model;
            instrument.serial_number = action.payload.serial_number;
        },
        instrumentAddedToRepair(state, action) {
            if (!state.activeInstruments.find(instrument => instrument.id === action.payload.id)) state.activeInstruments.push(action.payload)
        },
        instrumentDeleted(state, action) {
            delete state.activeInstruments[action.payload];
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

export const { instrumentAdded, instrumentEdited, instrumentAddedToRepair, instrumentDeleted, unloadInstrument } = instrumentsSlice.actions; 

export default instrumentsSlice.reducer;