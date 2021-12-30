import allEvents from "./allEvents";

export function applyEvents(socket : any,currentRoom : string){

    socket.on(allEvents.join, async (roomId: string) => {
        currentRoom = roomId

        socket.join(currentRoom)
        console.log(`joined room-${currentRoom}`)

        socket.to(currentRoom).emit(allEvents.join, roomId)
    });
    
    socket.on(allEvents.mouse, (data: any) => {
        socket.to(currentRoom).emit(allEvents.mouse, {id: socket.id, ...data})
    });
}