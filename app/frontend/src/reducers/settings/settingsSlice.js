import { createSlice } from '@reduxjs/toolkit';

const blankState = [];

const initialState = blankState;

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        settingChanged(state, action) {
            state[action.payload.type] = action.payload.value;
        }
    }
})

export const { settingChanged } = settingsSlice.actions;

export default settingsSlice.reducer;