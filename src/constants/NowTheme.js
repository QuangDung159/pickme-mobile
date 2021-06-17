import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
    DEFAULT: '#888888',
    ERROR: '#FF3636',
    SUCCESS: '#18ce0f',
    SECONDARY: '#444444',
    NEUTRAL: 'rgba(255, 255, 255, 0.2)',
    TABS: 'rgba(222, 222, 222, 0.3)',
    INPUT: '#DCDCDC',
    ACTIVE: '#f96332',
    BORDER_COLOR: '#E7E7E7',
    BASE: '#FFFFFF',
    NOTIFICATION_BACKGROUND: '#ffeee3',
    MESSAGE_BACKGROUND_CURRENT: '#b3f1ff',
    MESSAGE_BACKGROUND_INCOMING: '#ffeee3',
    LIST_ITEM_BACKGROUND_1: '#ffeee3',
    LIST_ITEM_BACKGROUND_2: '#cdf6ff',
    TRANSPARENT: 'transparent',
    SELECTED_DATE: '#b3f1ff',
};

const SIZES = {
    BASE: 16,
    OPACITY: 0.8,

    FONT_H1: 30,
    FONT_H2: 18,
    FONT_H3: 16,
    FONT_H4: 14,
    FONT_H5: 12,

    WIDTH_BASE: width,
    HEIGHT_BASE: height,
};

const FONT = {
    MONTSERRAT_REGULAR: 'montserrat-regular',
    MONTSERRAT_BOLD: 'montserrat-bold'
};

export default {
    COLORS,
    SIZES,
    FONT
};
