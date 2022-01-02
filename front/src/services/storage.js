
export function storeItem(name,item){
    localStorage.setItem(name,item)
}

export function getStoreItem(name){
    localStorage.getItem(name)
}