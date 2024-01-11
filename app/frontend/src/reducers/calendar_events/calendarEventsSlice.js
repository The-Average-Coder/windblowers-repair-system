import { createSlice } from '@reduxjs/toolkit';

const blankState = [];

const initialState = blankState;

function nextCalendarEventId(calendarEvents) {
    const maxId = calendarEvents.reduce((maxId, calendarEvent) => Math.max(calendarEvent.id, maxId), -1);
    return maxId + 1;
}

const calendarEventsSlice = createSlice({
    name: 'calendarEvents',
    initialState,
    reducers: {
        calendarEventAdded(state, action) {
            state.push({
                ...action.payload,
                id: nextCalendarEventId()
            })
        },
        calendarEventMoved(state, action) {
            const calendarEvent = state.find(calendarEvent => calendarEvent.id === action.payload.id);

            calendarEvent.start = action.payload.start;
            calendarEvent.end = action.payload.end;
        },
        calendarEventRemoved(state, action) {
            delete state[action.payload];
        }
    }
})

export const { calendarEventAdded, calendarEventMoved, calendarEventRemoved } = calendarEventsSlice.actions;

export default calendarEventsSlice.reducer;