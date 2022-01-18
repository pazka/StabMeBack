import {getItem, saveItem} from "../index";
import Room from "../../../Domain/Room";
import {getPlayer, tryGetPlayer} from "../../../Controllers/playerController";

const STORAGE_NAME = "rooms"

export async function hydrate() {
    let persistedData: any = await getItem(STORAGE_NAME)
    let hydratedData: any = {}

    if (persistedData) {
        persistedData.forEach((data: any) => {
            let tmpItem : Room = {...data}

            tmpItem.Creator = tryGetPlayer(data.Creator)
            tmpItem.Players = data.Players.map((id: any) => getPlayer(id))
            
            hydratedData[tmpItem.Id] = tmpItem
        })
        
        return hydratedData
    }

    return {}
}

export async function persist(allRooms: any) {
    const allFlatRooms = Object.values(allRooms).map((room: Room) => {
        let data: any = {...room}

        data.Creator = room.Creator?.Id
        data.Players = room.Players.map(p => p.Id)

        return data
    })

    await saveItem(STORAGE_NAME, allFlatRooms)
}