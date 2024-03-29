import { createSlice } from '@reduxjs/toolkit';

const blankState = [];

const initialState = [
    {
        repair_id: '0101001',
        type: 'Repair has been assessed and is awaiting confirmation'
    }
];

function nextActivityId(activityList) {
    const maxId = activityList.reduce((maxId, activity) => Math.max(activity.id, maxId), -1);
    return maxId + 1;
}

const activitySlice = createSlice({
    name: 'activity',
    initialState,
    reducers: {
        activityAdded(state, action) {
            state.push({
                ...action.payload,
                id: nextActivityId()
            })
        },
        activityRemoved(state, action) {
            delete state[action.payload];
        }
    }
})

export const { activityAdded, activityRemoved } = activitySlice.actions;

export default activitySlice.reducer;