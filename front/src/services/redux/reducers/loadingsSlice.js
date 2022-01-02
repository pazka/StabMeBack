import { createSlice } from '@reduxjs/toolkit'

export const loadingsSlice = createSlice({
    name: 'loadings',
    initialState: {},
    reducers: {
        stopLoading:(state,action)=>{
            delete state[action.payload]
        },
        startLoading:(state,action)=>{
            state[action.payload] = true
        },
    }
})

// Action creators are generated for each case reducer function
export const { startLoading,stopLoading } = loadingsSlice.actions

export default loadingsSlice.reducer