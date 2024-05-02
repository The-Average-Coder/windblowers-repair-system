import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { activityLoading: false, activity: [] };

export const fetchActivity = createAsyncThunk('activity/fetchActivity', async () => {
    return axios.get('/api/activity/getActivity').then((resp) => resp.data).catch((err) => console.log(err));

});

export const createActivity = createAsyncThunk('activity/createActivity', async (activityObject, { dispatch }) => {
    axios.post('/api/activity/createActivity', activityObject).then(resp => {
        dispatch(activityAdded({id: resp.data.insertId, ...activityObject }));
    });
})

export const deleteActivity = createAsyncThunk('activity/deleteActivity', async (id, { dispatch }) => {
    dispatch(activityRemoved(id));
    axios.delete(`/api/activity/deleteActivity/${id}`);
})

export const deleteActivityOfRepair = createAsyncThunk('activity/deleteActivityOfRepair', async (repair_id, { dispatch }) => {
    dispatch(repairDeleted(repair_id));
    axios.delete(`/api/activity/deleteActivityOfRepair/${repair_id}`);
})

const activitySlice = createSlice({
    name: 'activity',
    initialState,
    reducers: {
        activityAdded(state, action) {
            state.activity.push(action.payload);
        },
        activityRemoved(state, action) {
            return { activityLoading: state.activityLoading, activity: state.activity.filter(activity => activity.id !== action.payload) };
        },
        repairDeleted(state, action) {
            return { ...state, activity: state.activity.filter(activity => activity.repair_id !== action.payload) };
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchActivity.pending, (state) => {
                state.activityLoading = true;
            })
            .addCase(fetchActivity.fulfilled, (state, action) => {
                state.activityLoading = false;
                state.activity = action.payload;
            })
            .addCase(fetchActivity.rejected, (state) => {
                state.activityLoading = false;
            })
    }
})

export const { activityAdded, activityRemoved, repairDeleted } = activitySlice.actions;

export default activitySlice.reducer;