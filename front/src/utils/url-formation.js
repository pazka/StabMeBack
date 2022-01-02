export function queryParamToObj(qs){
    let queryObj = {}

    let queryParams = qs.match(/\w*=\w*/) || []

    queryParams.forEach(qp =>{
        queryObj[qp.split('=')[0]] = qp.split('=')[1]
    })

    return queryObj
}


export function objToQueryParams(obj) {
    if (!obj)
        return ""

    return "?" + Object.keys(obj).sort().map(k => `${k}=${obj[k]}`).join('&')
}
