import { createSlice } from '@reduxjs/toolkit';

import repairStatuses from '../../enums/repairStatuses';

const blankState = [];

const initialState = [
    {
        id: '0101001',
        status: repairStatuses.CREATED,
        customer_id: 1,
        instrument_id: 1,
        notes: 'example notes',
        repairer_id: null,
        deadline: null,
        date_created: '01-01-2001',
        date_completed: null,
        date_collected: null,
        archived: 0
    },
    {
        id: '0101001',
        status: repairStatuses.CREATED,
        customer_id: 1,
        instrument_id: 1,
        notes: 'example notes',
        repairer_id: null,
        deadline: null,
        date_created: '01-01-2001',
        date_completed: null,
        date_collected: null,
        archived: 0
    },
    {
        id: '0101001',
        status: repairStatuses.CREATED,
        customer_id: 1,
        instrument_id: 1,
        notes: 'example notes',
        repairer_id: null,
        deadline: null,
        date_created: '01-01-2001',
        date_completed: null,
        date_collected: null,
        archived: 0
    },
    {
        id: '0101001',
        status: repairStatuses.OPEN,
        customer_id: 1,
        instrument_id: 1,
        notes: 'example notes',
        repairer_id: null,
        deadline: null,
        date_created: '01-01-2001',
        date_completed: null,
        date_collected: null,
        archived: 0
    },
    {
        id: '0101001',
        status: repairStatuses.OPEN,
        customer_id: 1,
        instrument_id: 1,
        notes: 'example notes',
        repairer_id: null,
        deadline: null,
        date_created: '01-01-2001',
        date_completed: null,
        date_collected: null,
        archived: 0
    },
    {
        id: '0101001',
        status: repairStatuses.CREATED,
        customer_id: 1,
        instrument_id: 1,
        notes: 'example notes',
        repairer_id: null,
        deadline: null,
        date_created: '01-01-2001',
        date_completed: null,
        date_collected: null,
        archived: 0
    },
    {
        id: '0101001',
        status: repairStatuses.COMPLETED,
        customer_id: 1,
        instrument_id: 1,
        notes: 'example notes',
        repairer_id: null,
        deadline: null,
        date_created: '01-01-2001',
        date_completed: null,
        date_collected: null,
        archived: 0
    },
    {
        id: '0101001',
        status: repairStatuses.CREATED,
        customer_id: 1,
        instrument_id: 1,
        notes: 'example notes',
        repairer_id: null,
        deadline: null,
        date_created: '01-01-2001',
        date_completed: null,
        date_collected: null,
        archived: 0
    },
    {
        id: '0101001',
        status: repairStatuses.CREATED,
        customer_id: 1,
        instrument_id: 1,
        notes: 'example notes',
        repairer_id: null,
        deadline: null,
        date_created: '01-01-2001',
        date_completed: null,
        date_collected: null,
        archived: 0
    }
];

function findRepair(state, id) {
    return state.find(repair => repair.id === id); 
}

const repairsSlice = createSlice({
    name: 'repairs',
    initialState,
    reducers: {
        repairAdded(state, action) {
            state.push({
                ...action.payload,
                status: repairStatuses.CREATED,
                assessments: [],
                repairer_id: null,
                deadline: null,
                date_completed: null,
                date_collected: null,
                archived: 0
            });
        },
        repairEdited(state, action) {
            const repair = findRepair(state, action.payload.id);

            repair.customer_id = action.payload.customer_id;
            repair.instrument_id = action.payload.instrument_id;
            repair.notes = action.payload.notes;
        },
        repairAssessed(state, action) {
            const repair = findRepair(state, action.payload.id);

            repair.assessments.push(action.payload.assessment);
            repair.status = repairStatuses.ASSESSED;
        },
        assessmentDeleted(state, action) {
            const repair = findRepair(state, action.payload.id);

            delete repair.assessments[action.payload.assessment_id];
        },
        repairOpened(state, action) {
            const repair = findRepair(state, action.payload);

            repair.status = repairStatuses.OPEN;
        },
        repairUnopened(state, action) {
            const repair = findRepair(state, action.payload);

            repair.status = repair.assessments.length >= 1 ? repairStatuses.ASSESSED : repairStatuses.CREATED;
        },
        repairerEdited(state, action) {
            const repair = findRepair(state, action.payload.id);

            repair.repairer = action.payload.repairer;
        },
        deadlineEdited(state, action) {
            const repair = findRepair(state, action.payload.id);

            repair.deadline = action.payload.deadline;
        },
        repairCompleted(state, action) {
            const repair = findRepair(state, action.payload);

            repair.status = repairStatuses.COMPLETED;
        },
        repairUncompleted(state, action) {
            const repair = findRepair(state, action.payload);

            repair.status = repairStatuses.OPEN;
        },
        repairCollected(state, action) {
            const repair = findRepair(state, action.payload);

            repair.status = repairStatuses.COMPLETED;
        },
        repairUncollected(state, action) {
            const repair = findRepair(state, action.payload);

            repair.status = repairStatuses.OPEN;
        },
        repairArchived(state, action) {
            const repair = findRepair(state, action.payload);

            repair.archived = 1;
        },
        repairUnarchived(state, action) {
            const repair = findRepair(state, action.payload);

            repair.archived = 0;
        },
        repairDeleted(state, action) {
            state = state.filter(repair => repair.id !== action.payload);
        }
    }
})

export const { repairAdded, repairEdited, repairAssessed, assessmentDeleted, repairOpened, repairUnopened, repairerEdited, deadlineEdited,
    repairCompleted, repairUncompleted, repairCollected, repairUncollected, repairArchived, repairUnarchived, repairDeleted } = repairsSlice.actions;

export default repairsSlice.reducer;