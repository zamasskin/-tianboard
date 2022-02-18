import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';

import setDefaultConfigurations from './configurations/dafault';

const Code = ({ defaultLanguage, code, tokens, onChange }) => {
    const [load, setLoad] = useState(false);

    const monaco = useMonaco();
    useEffect(() => {
        if (monaco) {
            setDefaultConfigurations(monaco, defaultLanguage, tokens).finally(() => setLoad(true));
        }
    }, [monaco, load, defaultLanguage, tokens]);

    if (!load) {
        return 'Загрузка...';
    }

    return (
        <Editor
            height="30vh"
            defaultLanguage={defaultLanguage}
            defaultValue={code}
            theme="myCustomTheme"
            onChange={onChange}
            options={{
                minimap: {
                    enabled: false
                }
            }}
        />
    );
};

Code.propTypes = {
    defaultLanguage: PropTypes.string,
    code: PropTypes.string,
    tokens: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func
};

export default Code;
