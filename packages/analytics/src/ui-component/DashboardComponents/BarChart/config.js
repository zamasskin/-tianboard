import YAML from 'yaml';
import _ from 'lodash';
import safeEval from 'safe-eval';
import { HyperFormula } from 'hyperformula';

import { getSettingsName } from 'editor-components/dashboard/DashboardEditor/constant';

export const defaultConfig = (data) => {
    const keys = _.chain(data)
        .head()
        .toPairs()
        .filter(([, value]) => _.isNumber(value))
        .map(([key]) => key)
        .filter()
        .value();

    return {
        series: keys.slice(0, 5).map((name) => ({
            name,
            data:
                // { eval: 'console.log(this)' }
                { eval: `this.data.map(el => el.${name})` }
        })),
        options: { chart: { type: 'bar' } }
    };
};

const exampleJson = {
    series: [
        { name: 'exampleA', data: { eval: 'this.data.map(el => el.A)' } },
        { name: 'exampleB', data: { eval: 'this.data.map(el => el.B)' } }
    ],
    options: {
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: {
                eval: '() => this.data.map(el => el.C)'
            }
        },
        yaxis: {
            title: {
                text: '$ (thousands)'
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: {
                    function: '(val) =>  {val} thousands'
                }
            }
        }
    }
};

const example = ['###########Example###########', YAML.stringify(exampleJson).replace(/(^)|(\n)/gi, '$&#')].join('\n');

export function evalString(string, data) {
    try {
        const callString = `{data: {}, setData(data) {this.data = data}, call() { return ${string} }}`;
        const evalObj = safeEval(callString);
        evalObj.setData(data);
        return evalObj.call();
    } catch (e) {
        return null;
    }
}

export function evalFormula(formula, data) {
    const options = {
        licenseKey: 'gpl-v3'
    };

    const hf = HyperFormula.buildFromArray(
        data.map((items) => Object.values(items)),
        options
    );
    return hf.calculateFormula(formula, 0);
}

export const parseSettings = (settings, data) =>
    !_.isObject(settings)
        ? settings
        : _.chain(settings)
              .mapValues((settingsValue, key) => {
                  switch (true) {
                      case _.has(settingsValue, 'formula') && Object.keys(settingsValue).length === 1:
                          return evalFormula(settingsValue.formula, data);
                      case key === 'formula':
                          return evalFormula(settingsValue, data);
                      case _.has(settingsValue, 'eval') && Object.keys(settingsValue).length === 1:
                          return evalString(settingsValue.eval, data);
                      case key === 'eval':
                          return evalString(settingsValue, data);
                      case _.isObject(settingsValue):
                          return { ...parseSettings(settingsValue, data) };
                      default:
                          return settingsValue;
                  }
              })
              .value();

export function getConfig(settings, data) {
    try {
        const settingsName = getSettingsName('BarChart');
        let componentSettings = _.has(settings, settingsName) ? YAML.parse(settings[settingsName]) : defaultConfig(data);
        componentSettings = parseSettings(componentSettings, data);
        return componentSettings;
    } catch (e) {
        return { error: e.message };
    }
}
const conf = (data) => YAML.stringify(defaultConfig(data)) + example;
export default conf;
