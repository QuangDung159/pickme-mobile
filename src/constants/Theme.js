import ResponsiveHelpers from '@helpers/ResponsiveHelpers';
import { Dimensions } from 'react-native';
import App from './App';

const { width, height } = Dimensions.get('window');

const COLORS = {
    DEFAULT: '#303133',
    ERROR: '#FF3636',
    SUCCESS: '#18ce0f',
    PLACE_HOLDER: '#adadad',
    NEUTRAL: 'rgba(255, 255, 255, 0.2)',
    TABS: 'rgba(222, 222, 222, 0.3)',
    INPUT: '#303133',
    // INPUT: '#DCDCDC',
    // ACTIVE: '#ff693b',
    ACTIVE: '#2C8F46',
    BORDER_COLOR: '#DCDCDC',
    // BASE: '#303133',
    NOTIFICATION_BACKGROUND: '#ffeee3',
    LIST_ITEM_BACKGROUND_1: '#ffeee3',
    LIST_ITEM_BACKGROUND_2: '#cdf6ff',
    TRANSPARENT: 'transparent',
    SELECTED_DATE: '#b3f1ff',
    BASE: '#f1f1f1',
    BLOCK: '#ffffff',
};

const SIZES = {
    BASE: 16,

    // non-montserrat
    // FONT_H1: 25,
    // FONT_H2: 21,
    // FONT_H3: 19,
    // FONT_H4: 17,
    // FONT_H5: 15,

    // montserrat
    FONT_H1: ResponsiveHelpers.normalize(24),
    FONT_H2: ResponsiveHelpers.normalize(20),
    FONT_H3: ResponsiveHelpers.normalize(18),
    FONT_H4: ResponsiveHelpers.normalize(16),
    FONT_H5: ResponsiveHelpers.normalize(14),

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
