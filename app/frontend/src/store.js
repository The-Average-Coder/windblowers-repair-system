import { configureStore } from '@reduxjs/toolkit';

import repairsReducer from './reducers/repairs/repairsSlice';
import customersReducer from './reducers/customers/customersSlice';
import instrumentsReducer from './reducers/instruments/instrumentsSlice';
import calendarEventsReducer from './reducers/calendar_events/calendarEventsSlice';
import activityReducer from './reducers/activity/activitySlice';
import repairersReducer from './reducers/repairers/repairersSlice';
import settingsReducer from './reducers/settings/settingsSlice';

const store = configureStore({
    reducer: {
        activeRepairs: repairsReducer,
        activeCustomers: customersReducer,
        activeInstruments: instrumentsReducer,
        recentCalendarEvents: calendarEventsReducer,
        activity: activityReducer,
        repairers: repairersReducer,
        settings: settingsReducer
    }
})

export default store;