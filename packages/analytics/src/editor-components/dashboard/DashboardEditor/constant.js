const suffix = 'Settings';
export const getSettingsName = (componentName) => componentName + suffix;
export const mergeSetting = (oldSettings, yamlSettings) => {
    const componentName = oldSettings.component;
    const settingsName = getSettingsName(componentName);
    return { ...oldSettings, [settingsName]: yamlSettings };
};
export default suffix;
