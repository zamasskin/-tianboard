import { getJson, fetchPostJson } from './fetch';

export async function getConnections() {
    const result = await getJson('/connections');
    if (result.errors) {
        throw result.message;
    }
    return result;
}

export async function getConnectionOptions() {
    const connections = await getConnections();
    return connections;
}

export async function apply(connectionId, query, params) {
    const result = await fetchPostJson(`/connections/${connectionId}`, { query, params });

    if (result.errors) {
        throw result.message;
    }
    return result;
}

export default getConnections;
