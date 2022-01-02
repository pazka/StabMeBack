import {config, getBaseUrl} from "./config";
import {objToQueryParams} from "../utils/url-formation";
import * as axios from "axios"

export function getRoomName() {
    return window.location.href.match(/(https?:\/\/)([\w.]*)([:]\d*)?\/(\w*)/)[4]
}

async function sendFile(fromFile, urlPath) {
    let formData = new FormData();

    formData.append("layerImg", fromFile);
    return fetch(getBaseUrl() + urlPath, {method: "POST", body: formData})
}

export async function postData(urlPath = '', queryParams, data) {
    // Default options are marked with *

    const req = await fetch(getBaseUrl() + urlPath + objToQueryParams(queryParams), {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    
    return axios(req).catch(err => {throw err}).then(res => res.data);
}

export async function getData(urlPath = '', queryParams) {
    return await axios.get(getBaseUrl() + urlPath + objToQueryParams(queryParams)).catch(err => {throw err}).then(res => res.data);
}

export async function deleteData(urlPath = '', queryParams) {
    return await axios.delete(getBaseUrl() + urlPath + objToQueryParams(queryParams)).catch(err => {throw err}).then(res => res.data);
}

//
// export async function sendImg(formFile, roomId, layerId) {
//     //return sendFile(formFile, `/api//${roomId}/${layerId}/upload`)
// }