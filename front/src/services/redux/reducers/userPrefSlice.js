import { createSlice } from '@reduxjs/toolkit'

export const userPrefSlice = createSlice({
    name: 'userPref',
    initialState: {
        theme: 0,
        lang : "EN"
    },
    reducers: {
        setTheme : (state,action) =>{
            state.theme = action.payload
        },
        setLang : (state,action) =>{
            state.lang = action.payload
        },
    }
})

// Action creators are generated for each case reducer function
export const { setTheme ,setLang} = userPrefSlice.actions

export default userPrefSlice.reducer