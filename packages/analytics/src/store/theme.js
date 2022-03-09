import { action } from 'easy-peasy';
import config from 'config';

export default function createTheme() {
    return {
        data: {
            isOpen: [], // for active default menu
            fontFamily: config.fontFamily,
            borderRadius: config.borderRadius,
            opened: true
        },
        openMenu: action((state, id) => {
            state.data.isOpen = [id];
        }),
        setMenu: action((state, opened) => {
            state.data.opened = opened;
        }),
        setFontFamily: action((state, fontFamily) => {
            state.data.fontFamily = fontFamily;
        }),
        setBorderRadius: action((state, borderRadius) => {
            state.data.borderRadius = borderRadius;
        })
    };
}
