export default {
    async fetchJson(url, json) {
        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        });
        return rawResponse.json();
    }
};
