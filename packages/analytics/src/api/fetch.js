import config from 'config';

async function fetchJson(url, json, method = 'GET') {
    const rawResponse = await fetch(config.apiUrl + url, {
        method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    });
    return rawResponse.json();
}

export async function fetchPostJson(url, json) {
    const rawResponse = await fetch(config.apiUrl + url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    });
    return rawResponse.json();
}

export async function getJson(url) {
    const rawResponse = await fetch(config.apiUrl + url);
    return rawResponse.json();
}

export default fetchJson;
