const axios = require('axios');
const { URL } = require('url');

const CHALLENGE_URL = 'https://letsrevolutionizetesting.com/challenge.json';

function containsProp(prop, json) {
    return Object.hasOwnProperty.call(json, prop);
}

function getProp(prop, json) {
    return json[prop];
}

function getQueryParams(url) {
    const urlObj = new URL(url);
    return urlObj.searchParams;
}

async function makeRequest(challengeId = null) {
    let payload = {};
    let jsonResponse = {};
    let message = null;

    if (challengeId) {
        payload.params = { id: challengeId };
    }

    try {
        // Make request
        const response = await axios.get(CHALLENGE_URL, payload);
        console.log(response.request.res.responseUrl);
        jsonResponse = response.data;

        if (containsProp('follow', jsonResponse)) {
            const follow = getProp('follow', jsonResponse);
            const query_params = getQueryParams(follow);
            const id = query_params.get('id');
            return makeRequest(id);
        } else if (containsProp('message', jsonResponse)) {
            message = getProp('message', jsonResponse);
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    }

    return message;
}

(async () => {
    console.log(await makeRequest());
})();
