import ResponsiveHelpers from '@helpers/ResponsiveHelpers';
import { Dimensions } from 'react-native';
import App from './App';

const { width, height } = Dimensions.get('window');

const COLORS = {
    DEFAULT: '#303133',
    ERROR: '#FF3636',
    SUCCESS: '#18ce0f',
    INPUT: '#DCDCDC',
    ACTIVE: '#2C8F46',
    BORDER_COLOR: '#2C8F46',
    NOTIFICATION_BACKGROUND: '#ffeee3',
    LIST_ITEM_BACKGROUND_1: '#ffeee3',
    LIST_ITEM_BACKGROUND_2: '#cdf6ff',
    TRANSPARENT: 'transparent',
    SELECTED_DATE: '#b3f1ff',
    BLOCK: '#ffffff',
    BASE: '#f1f1f1',

    // BLOCK: '#c9c9c9',
    // BASE: '#878787',

    PLACE_HOLDER: '#c4c4c4'
};

const SIZES = {
    BASE: 16,
    OPACITY: 0.8,

    // non-montserrat
    // FONT_H1: 25,
    // FONT_H2: 21,
    // FONT_H3: 19,
    // FONT_H4: 17,
    // FONT_H5: 15,

    // montserrat
    FONT_H1: ResponsiveHelpers.normalize(26),
    FONT_H2: ResponsiveHelpers.normalize(21),
    FONT_H3: ResponsiveHelpers.normalize(19),
    FONT_H4: ResponsiveHelpers.normalize(17),
    FONT_H5: ResponsiveHelpers.normalize(15),

    WIDTH_BASE: width,
    HEIGHT_BASE: height,
};

const FONT = {
    TEXT_REGULAR: App.FONT.montserratRegular,
    TEXT_BOLD: App.FONT.montserratBold
};

export default {
    COLORS,
    SIZES,
    FONT
};
