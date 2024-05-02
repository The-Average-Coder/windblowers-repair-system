import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import calendarEventsColours from '../../enums/calendarEventColours';
import axios from 'axios';

const initialState = { calendarEventsLoading: false, recentCalendarEvents: [] }

export const fetchRecentCalendarEvents = createAsyncThunk('calendarEvents/fetchRecentCalendarEvents', async () => {
    return axios.get('/api/calendarEvents/getRecentCalendarEvents').then((resp) => resp.data).catch((err) => console.log(err));
});

export const moveCalendarEvent = createAsyncThunk('calendarEvents/moveCalendarEvent', async (data, { dispatch }) => {
    dispatch(calendarEventMoved(data));
    axios.put('/api/calendarEvents/moveEvent', data);
});

export const updateEventPriority = createAsyncThunk('calendarEvents/updateEventPriority', async (data, { dispatch }) => {
    console.log(data)
    dispatch(calendarEventPriorityUpdated(data));
    axios.put('/api/calendarEvents/updatePriority', data);
});

export const updateRepairStatus = createAsyncThunk('calendarEvents/updateRepairStatus', async (data, { dispatch }) => {
    dispatch(repairStatusUpdated(data));
    axios.put('/api/calendarEvents/updateRepairStatus', data);
});

export const createCalendarEvent = createAsyncThunk('calendarEvents/createCalendarEvent', async (eventObject, { dispatch }) => {
    const id = await axios.post('/api/calendarEvents/createEvent', eventObject).then(resp => resp.data.insertId);
    dispatch(calendarEventAdded({ id: id, ...eventObject }));
})

export const deleteCalendarEvent = createAsyncThunk('calendarEvents/deleteCalendarEvent', async (id, { dispatch }) => {
    dispatch(calendarEventRemoved(id));
    axios.delete(`/api/calendarEvents/deleteEvent/${id}`);
});

export const deleteCalendarEventsOfRepair = createAsyncThunk('calendarEvents/deleteCalendarEventsOfRepair', async (id, { dispatch }) => {
    dispatch(calendarEventsOfRepairDeleted(id));
    axios.delete(`/api/calendarEvents/deleteEvent/${id}`);
});

const calendarEventsSlice = createSlice({
    name: 'calendarEvents',
    initialState,
    reducers: {
        calendarEventAdded(state, action) {
            state.recentCalendarEvents.push(action.payload)
        },
        calendarEventMoved(state, action) {
            const calendarEvent = state.recentCalendarEvents.find(calendarEvent => calendarEvent.id === action.payload.id);

            calendarEvent.start = action.payload.start;
        },
        calendarEventRemoved(state, action) {
            return { ...state, recentCalendarEvents: state.recentCalendarEvents.filter(calendarEvent => calendarEvent.id !== action.payload) }
        },
        calendarEventPriorityUpdated(state, action) {
            const calendarEvent = state.recentCalendarEvents.find(calendarEvent => calendarEvent.id === action.payload.id);
            
            calendarEvent.priority = action.payload.priority;
        },
        repairStatusUpdated(state, action) {
            const calendarEvents = state.recentCalendarEvents.filter(calendarEvent => calendarEvent.repair_id !== action.payload.repair_id);
            calendarEvents.forEach(event => event.color = action.payload.color);
        },
        calendarEventsOfRepairDeleted(state, action) {
            return state.filter(event => event.repair_id !== action.payload);
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchRecentCalendarEvents.pending, (state) => {
                state.calendarEventsLoading = true;
            })
            .addCase(fetchRecentCalendarEvents.fulfilled, (state, action) => {
                state.calendarEventsLoading = false;
                state.recentCalendarEvents = action.payload;
            })
            .addCase(fetchRecentCalendarEvents.rejected, (state) => {
                state.calendarEventsLoading = false;
            })
    }
})

export const { calendarEventAdded, calendarEventMoved, calendarEventRemoved, repairStatusUpdated, calendarEventPriorityUpdated, calendarEventsOfRepairDeleted } = calendarEventsSlice.actions;

export default calendarEventsSlice.reducer;