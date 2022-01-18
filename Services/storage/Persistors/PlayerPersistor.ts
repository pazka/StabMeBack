import {getItem, saveItem} from "../index";
import Room from "../../../Domain/Room";
import {getPlayer, tryGetPlayer} from "../../../Controllers/playerController";

const STORAGE_NAME = "players"
export async function hydrate() {
    let persistedData: any = await getItem(STORAGE_NAME)

    if (persistedData) {
        return JSON.parse(persistedData)
    }

    return {}
}

export async function persist(allItems: any) {
    await saveItem(STORAGE_NAME, JSON.stringify(allItems))
}