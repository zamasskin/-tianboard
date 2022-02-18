import util from 'util';
import config from 'config';
import { getJson, fetchPostJson } from './fetch';

export async function getConnections() {
    const result = await getJson(`${config.apiUrl}/connections`);
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
    const url = util.format('%s/connections/%s', config.apiUrl, connectionId);
    const result = await fetchPostJson(url, { query, params });

    if (result.errors) {
        throw result.message;
    }
    return result;
}

export default getConnections;
