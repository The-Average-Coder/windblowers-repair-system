import { configureStore } from '@reduxjs/toolkit';

import repairsReducer from './reducers/repairs/repairsSlice';
import customersReducer from './reducers/customers/customersSlice';
import calendarEventsReducer from './reducers/calendar_events/calendarEventsSlice';
import activityReducer from './reducers/activity/activitySlice';
import settingsReducer from './reducers/settings/settingsSlice';

const store = configureStore({
    reducer: {
        activeRepairs: repairsReducer,
        activeCustomers: customersReducer,
        recentCalendarEvents: calendarEventsReducer,
        activity: activityReducer,
        settings: settingsReducer
    }
})

export default store;