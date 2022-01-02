import configs from "./configs";
import {queryParamToObj} from "../../utils/url-formation";


let currentEnvironment = configs.PROD


function update() {
    let queries = queryParamToObj(window.location.search);

    //case env is specified in url
    if (queries.env && configs[queries.env.toUpperCase()] !== null) {
        currentEnvironment = configs[queries.env.toUpperCase()]

        //case env is specified env constants
    } else if (process.env.NODE_ENV === "development" || process.env.REACT_APP_STAGE !== "prod") {
        currentEnvironment = configs.DEV
    } else {
        currentEnvironment = configs.PROD
    }

    console.info("I'm in env : ", currentEnvironment.name);

    alter()
}

function alter() {
    // eslint-disable-next-line default-case
    switch (currentEnvironment) {
        case configs.PROD :
            console.info = function () {
            };
            console.log = function () {
            };
            console.debug = function () {
            };
            break;
    }
}

/**
 * 
 * @return {{baseUrl: string, debug: boolean}}
 */
function getConfiguration() {
    // eslint-disable-next-line default-case
    return currentEnvironment
}

export function getBaseUrl() {
    const url = window.location.href.match(/(https?:\/\/)([\w.]*)([:]\d*)?\/(\w*)/)
    const protocol = url[1] ?? ""
    const domain = url[2] ?? ""
    const port = url[3] ?? ""
    const dynamicUrl = protocol + domain + port

    return config.debug ? config.baseUrl : dynamicUrl
}

update()
const config = getConfiguration()

export {
    config,
    update,
}
