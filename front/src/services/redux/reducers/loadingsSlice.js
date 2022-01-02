import { createSlice } from '@reduxjs/toolkit'

export const loadingsSlice = createSlice({
    name: 'loadings',
    initialState: {},
    reducers: {
        popLoadingId:(state,action)=>{
            delete state.loadings[action.payload.id]
        },
        pushLoadingId:(state,action)=>{
            state.loadings[action.payload.id] = action.payload.data
        },
    }
})

// Action creators are generated for each case reducer function
export const { popLoadingId,pushLoadingId } = loadingsSlice.actions

export default loadingsSlice.reducer