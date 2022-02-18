function getLanguageByConnector(connector) {
    switch (connector) {
        case 'mysql':
        case 'mysql2':
            return 'mysql';
        case 'pg':
        case 'postgres':
            return 'pgsql';
        default:
            return 'sql';
    }
}

export default getLanguageByConnector;
