import { createSlice } from '@reduxjs/toolkit';

const blankState = [];

const initialState = [
    {
        id: 1,
        surname: 'Cox',
        firstname: 'Josh',
        telephone: '07796593187',
        email: 'joshuajosephcox@gmail.com',
        address: '10 Cross Hill Close'
    }
];

function nextCustomerId(customers) {
    const maxId = customers.reduce((maxId, customer) => Math.max(customer.id, maxId), -1);
    return maxId + 1;
}

const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        customerAdded(state, action) {
            state.push({
                ...action.payload,
                id: nextCustomerId()
            })
        },
        customerEdited(state, action) {
            const customer = state.find(customer => customer.id === action.payload.id);

            customer.surname = action.payload.surname;
            customer.firstname = action.payload.firstname;
            customer.telephone = action.payload.telephone;
            customer.email = action.payload.email;
            customer.address = action.payload.address;
        },
        customerDeleted(state, action) {
            delete state[action.payload];
        }
    }
})

export const { customerAdded, customerEdited, customerDeleted } = customersSlice.actions; 

export default customersSlice.reducer;