import util from 'util';
import config from 'config';
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
    return [{ id: 0, name: 'По умолчанию' }, ...connections.map((conn) => ({ title: [conn.name, conn.provider].join(':'), id: conn.id }))];
}

export async function apply(connectionId, query, params) {
    const result = await fetchPostJson(`/connections/${connectionId}`, { query, params });

    if (result.errors) {
        throw result.message;
    }
    return result;
}

export default getConnections;
