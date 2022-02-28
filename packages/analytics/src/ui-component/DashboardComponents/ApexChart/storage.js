import { objectOf, arrayOf, number, string, boolean, data, caValues, canSettings, templateFn } from 'helpers/dashboar/edit';
import { series } from '../helpers';

function createDefault(type, settings) {
    return {
        type,
        settings: objectOf({
            series: series(settings?.series),
            options: objectOf({
                chart: objectOf({
                    type: string(settings?.options?.chart?.type, type),
                    height: number(settings?.options?.chart?.height, 350)
                }),
                plotOptions: objectOf({
                    bar: objectOf({
                        horizontal: boolean(settings?.options?.plotOptions?.bar?.horizontal, false),
                        columnWidth: string(settings?.options?.plotOptions?.bar?.columnWidth, '55%'),
                        endingShape: string(settings?.options?.plotOptions?.bar?.endingShape, 'rounded')
                    })
                }),
                dataLabels: objectOf({
                    enabled: boolean(settings?.options?.dataLabels?.enabled, false)
                }),
                stroke: objectOf({
                    show: boolean(settings?.options?.stroke?.show, true),
                    width: number(settings?.options?.stroke?.width, 2),
                    colors: arrayOf(settings?.options?.stroke?.colors, ['transparent'])
                }),
                xaxis: objectOf({
                    categories: data(settings?.options?.xaxis?.categories)
                }),
                yaxis: objectOf({
                    title: objectOf({
                        text: string(settings?.options?.yaxis?.title?.text) // '$ (thousands1)'
                    })
                }),
                fill: objectOf({
                    opacity: number(settings?.options?.fill?.opacity, 1)
                }),
                tooltip: objectOf({
                    y: objectOf({
                        formatter: templateFn(settings?.options?.tooltip?.y?.formatter, ['val'])
                    })
                }),
                title: objectOf({
                    text: string(settings?.options?.title?.text),
                    align: string(settings?.options?.title?.align)
                })
            })
        })
    };
}

function createStorage(settings) {
    const storage = createDefault('bar', settings);
    return {
        ...storage,
        ...caValues(storage),
        ...canSettings(storage)
    };
}

export default createStorage;
