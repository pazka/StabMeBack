import { createSlice } from '@reduxjs/toolkit'

export const lobbySlice = createSlice({
    name: 'lobby',
    initialState: {
        rooms: []
    }, 
    reducers: {
        updateRooms : (state, action) => {
            state.rooms = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { updateRooms } = lobbySlice.actions

export default lobbySlice.reducer