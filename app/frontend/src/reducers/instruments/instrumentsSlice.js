import { createSlice } from '@reduxjs/toolkit';

const blankState = [];

const initialState = [
    {
        id: 1,
        type: 'Flute',
        manufacturer: 'Pearl',
        model: '505',
        serial_number: 'ABC1234'
    }
];

function nextInstrumentId(instruments) {
    const maxId = instruments.reduce((maxId, instrument) => Math.max(instrument.id, maxId), -1);
    return maxId + 1;
}

const instrumentsSlice = createSlice({
    name: 'instruments',
    initialState,
    reducers: {
        instrumentAdded(state, action) {
            state.push({
                ...action.payload,
                id: nextInstrumentId()
            })
        },
        instrumentEdited(state, action) {
            const instrument = state.find(instrument => instrument.id === action.payload.id);

            instrument.type = action.payload.type;
            instrument.manufacturer = action.payload.manufacturer;
            instrument.model = action.payload.model;
            instrument.serial_number = action.payload.serial_number;
        },
        intrumentDeleted(state, action) {
            delete state[action.payload];
        }
    }
})

export const { instrumentAdded, instrumentEdited, instrumentDeleted } = instrumentsSlice.actions; 

export default instrumentsSlice.reducer;