import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addCustomer } from '../repairs/repairsSlice';
import axios from 'axios';

const initialState = { customersLoading: false, loadingCustomer: false, activeCustomers: [], loadedCustomer: null }

export const fetchActiveCustomers = createAsyncThunk('customers/fetchActiveCustomers', async () => {
    return axios.get('/api/customers/getActiveCustomers').then((resp) => resp.data).catch((err) => console.log(err));
});

export const loadCustomer = createAsyncThunk('customers/loadCustomer', async (id) => {
    return axios.get(`/api/customers/getCustomer/${id}`).then((resp) => resp.data[0]).catch((err) => console.log(err));
})

export const createCustomer = createAsyncThunk('customers/createCustomer', async (customerObject, { dispatch }) => {
    const id = await axios.post('/api/customers/createCustomer', customerObject).then(resp => resp.data.insertId);
    dispatch(customerAdded({ id: id, ...customerObject }));
    return id;
});

export const createCustomerOnRepair = createAsyncThunk('customers/createCustomerOnRepair', async (data, { dispatch }) => {
    axios.post('/api/customers/createCustomer', data.customer).then(resp => {
        dispatch(customerAdded({ id: resp.data.insertId, ...data.customer }));
        dispatch(addCustomer({ id: data.repair_id, customer_id: resp.data.insertId }));
    });
});

export const addCustomerToActiveCustomers = createAsyncThunk('customers/addCustomerToActiveCustomers', async (id, { dispatch }) => {
    return axios.get(`/api/customers/getCustomer/${id}`).then(resp => {dispatch(customerAddedToRepair(resp.data[0]));})
});

export const editCustomer = createAsyncThunk('customers/editCustomer', async (customerObject, { dispatch }) => {
    dispatch(customerEdited(customerObject));
    axios.put('/api/customers/editCustomer', customerObject);
});

export const deleteCustomer = createAsyncThunk('customers/deleteCustomer', async (id, { dispatch }) => {
    dispatch(customerDeleted(id));
    axios.delete(`/api/customers/deleteCustomer/${id}`);
});

const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        customerAdded(state, action) {
            state.activeCustomers.push(action.payload);
        },
        customerEdited(state, action) {
            const customer = state.activeCustomers.find(customer => customer.id === action.payload.id);

            if (!customer) customer = state.loadedCustomer;

            customer.surname = action.payload.surname;
            customer.firstname = action.payload.firstname;
            customer.telephone = action.payload.telephone;
            customer.email = action.payload.email;
            customer.address = action.payload.address;
        },
        customerAddedToRepair(state, action) {
            if (!state.activeCustomers.find(customer => customer.id === action.payload.id)) state.activeCustomers.push(action.payload)
        },
        customerDeleted(state, action) {
            return { ...state, activeCustomers: state.activeCustomers.filter(customer => customer.id !== action.payload) };
        },
        unloadCustomer(state) {
            state.loadedCustomer = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchActiveCustomers.pending, (state) => {
                state.customersLoading = true;
            })
            .addCase(fetchActiveCustomers.fulfilled, (state, action) => {
                state.customersLoading = false;
                state.activeCustomers = action.payload;
            })
            .addCase(fetchActiveCustomers.rejected, (state) => {
                state.customersLoading = false;
            })
            .addCase(addCustomerToActiveCustomers.pending, (state) => {
                state.customersLoading = true;
            })
            .addCase(addCustomerToActiveCustomers.fulfilled, (state, action) => {
                state.customersLoading = false;
            })
            .addCase(addCustomerToActiveCustomers.rejected, (state) => {
                state.customersLoading = false;
            })
            .addCase(loadCustomer.pending, (state) => {
                state.loadingCustomer = true;
            })
            .addCase(loadCustomer.fulfilled, (state, action) => {
                state.loadingCustomer = false;
                state.loadedCustomer = action.payload;
            })
            .addCase(loadCustomer.rejected, (state) => {
                state.loadingCustomer = false;
            })

    }
})

export const { customerAdded, customerEdited, customerAddedToRepair, customerDeleted, unloadCustomer } = customersSlice.actions; 

export default customersSlice.reducer;