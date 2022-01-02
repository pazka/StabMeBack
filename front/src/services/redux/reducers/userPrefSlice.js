import { createSlice } from '@reduxjs/toolkit'

export const userPrefSlice = createSlice({
    name: 'userPref',
    initialState: {
        theme: 0
    },
    reducers: {
        setTheme : (state,action) =>{
            state.theme = action.payload
        },
    }
})

// Action creators are generated for each case reducer function
export const { setTheme } = userPrefSlice.actions

export default userPrefSlice.reducer