import _ from 'lodash';
import YAML from 'yaml';

const parseConfig = (data) => ({
    columns: _.chain(data)
        .head()
        .keys()
        .reduce((old, field) => ({ ...old, [field]: { headerName: field } }), {})
        .value()
});

const exampleJson = {
    columns: {
        A: { headerName: 'A', with: 100, align: 'left', headerAlign: 'left' },
        N: 'details: --- https://mui.com/api/data-grid/grid-col-def/#properties'
    }
};

const example = ['###########Example###########', YAML.stringify(exampleJson).replace(/(^)|(\n)/gi, '$&#'), ''].join('\n');

const config = (data) => example + YAML.stringify(parseConfig(data));

export default config;
