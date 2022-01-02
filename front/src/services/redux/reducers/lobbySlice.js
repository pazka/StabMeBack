import { createSlice } from '@reduxjs/toolkit'

export const lobbySlice = createSlice({
    name: 'lobby',
    initialState: {
        rooms: [],
        selectGame:-1
    }, 
    reducers: {
        updateRooms : (state, action) => {
            state.rooms = action.payload
        },
        selectGame : (state, action) => {
            state.selectedGame = action.payload
        },
        unselectGame : (state, action) => {
            state.selectedGame = -1
        },
    }
})

// Action creators are generated for each case reducer function
export const { updateRooms } = lobbySlice.actions

export default lobbySlice.reducer