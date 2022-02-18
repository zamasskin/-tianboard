import _ from 'lodash';

async function setDefaultConfigurations(monaco, language, tokens) {
    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
        return;
    }

    const customTokenizer = {
        tokenizer: {
            root: [{ include: 'custom' }],
            custom: [[`:(${tokens.join('|')})+`, 'customClass']]
        }
    };

    const allLangs = monaco.languages.getLanguages();
    const { language: extendsLang } = await allLangs.find(({ id }) => id === language).loader();

    Object.entries(customTokenizer).forEach(([key, value]) => {
        if (key === 'tokenizer') {
            Object.entries(value).forEach(([category, tokenDefs]) => {
                if (!_.has(extendsLang.tokenizer, category)) {
                    extendsLang.tokenizer[category] = [];
                }
                if (Array.isArray(tokenDefs)) {
                    extendsLang.tokenizer[category] = _.concat(tokenDefs, extendsLang.tokenizer[category]);
                }
            });
        } else if (Array.isArray(value)) {
            if (!_.has(extendsLang, key)) {
                extendsLang[key] = [];
            }
            extendsLang[key] = _.concat(value, extendsLang[key]);
        }
    });

    monaco.editor.defineTheme('myCustomTheme', {
        base: 'vs',
        inherit: true,
        rules: [
            {
                token: 'customClass',
                foreground: 'ffa500',
                fontStyle: 'italic underline'
            },
            {
                token: 'redClass',
                foreground: 'ff0000'
            }
        ],
        colors: () => ({
            'editor.foreground': '#000000'
        })
    });

    monaco.languages.setMonarchTokensProvider(language, extendsLang);
}

export default setDefaultConfigurations;
