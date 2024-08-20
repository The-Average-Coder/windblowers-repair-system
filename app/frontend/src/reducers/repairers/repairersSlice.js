import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { repairersLoading: false, repairers: [] };

export const fetchRepairers = createAsyncThunk('repairers/fetchRepairers', async () => {
    return axios.get('/api/repairers/getRepairers').then((resp) => resp.data).catch((err) => console.log(err));
});

export const addRepairer = createAsyncThunk('repairers/addRepairer', async (details, {dispatch }) => {
    axios.post('/api/repairers/addRepairer', { name: details.name, color: details.color  }).then(resp => {
        dispatch(repairerAdded({ id: resp.data.insertId, name: details.name, color: details.color }));
    });
});

export const changeColor = createAsyncThunk('repairers/changeColor', async (repairerObject, { dispatch }) => {
    dispatch(colorChanged(repairerObject));
    axios.put('/api/repairers/changeColor', repairerObject);
})

export const deleteRepairer = createAsyncThunk('repairers/deleteRepairer', async (id, {dispatch }) => {
    dispatch(repairerDeleted(id));
    axios.delete(`/api/repairers/deleteRepairer/${id}`);
});

const repairersSlice = createSlice({
    name: 'repairers',
    initialState,
    reducers: {
        repairerAdded(state, action) {
            state.repairers.push(action.payload);
        },
        colorChanged(state, action) {
            const repairer = state.repairers.find(repairer => repairer.id === action.payload.id); 
            repairer.color = action.payload.color;
        },
        repairerDeleted(state, action) {
            return { repairersLoading: state.repairersLoading, repairers: state.repairers.filter(repairer => repairer.id !== action.payload) };
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchRepairers.pending, (state) => {
                state.repairersLoading = true;
            })
            .addCase(fetchRepairers.fulfilled, (state, action) => {
                state.repairersLoading = false;
                state.repairers = action.payload;
            })
            .addCase(fetchRepairers.rejected, (state) => {
                state.repairersLoading = false;
            })
    }
});

export const { repairerAdded, colorChanged, repairerDeleted } = repairersSlice.actions;

export default repairersSlice.reducer;