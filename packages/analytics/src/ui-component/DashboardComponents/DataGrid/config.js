import _ from 'lodash';
import YAML from 'yaml';

export const defaultConfig = (data) => ({
    columns: {
        ..._.chain(data)
            .head()
            .keys()
            .reduce((old, field) => ({ ...old, [field]: { headerName: field } }), {})
            .value()
    },
    height: 500,
    width: '100%'
});

const exampleJson = {
    columns: {
        A: { headerName: 'A', with: 100, align: 'left', headerAlign: 'left' },
        N: 'details: --- https://mui.com/api/data-grid/grid-col-def/#properties',
        sum: {
            headerName: 'Сумма',
            formula: '=SUM(this.D, this.E)'
        }
    },
    height: 500,
    width: '100%',
    props: 'Тут можно переопределить свойства компонента'
};

const example = ['', '###########Example###########', YAML.stringify(exampleJson).replace(/(^)|(\n)/gi, '$&#')].join('\n');

const config = (data) => YAML.stringify(defaultConfig(data)) + example;

export default config;
