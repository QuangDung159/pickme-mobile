import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
    DEFAULT: '#888888',
    PRIMARY: '#f96332',
    LABEL: '#FE2472',
    INFO: '#2CA8FF',
    ERROR: '#FF3636',
    SUCCESS: '#18ce0f',
    WARNING: '#FFB236',
    SECONDARY: '#444444',
    NEUTRAL: 'rgba(255, 255, 255, 0.2)',
    TABS: 'rgba(222, 222, 222, 0.3)',
    TEXT: '#32325D',
    MUTED: '#8898AA',
    INPUT: '#DCDCDC',
    INPUT_SUCCESS: '#11c700',
    INPUT_ERROR: '#ff3636',
    ACTIVE: '#f96332',
    BUTTON_COLOR: '#9C26B0',
    PLACEHOLDER: '#9FA5AA',
    THUMB_SWITCH_ON: '#f96332',
    SWITCH_ON: '#f96332',
    SWITCH_OFF: '#898989',
    GRADIENT_START: '#6B24AA',
    GRADIENT_END: '#AC2688',
    PRICE_COLOR: '#EAD5FB',
    BORDER_COLOR: '#E7E7E7',
    BLOCK: '#E7E7E7',
    ICON: '#172B4D',
    ICON_INPUT: '#555555',
    HEADER: '#2c2c2c',
    BORDER: '#CAD1D7',
    BASE: '#FFFFFF',
    BLACK: '#000000',
    TWITTER: '#55acee',
    FACEBOOK: '#3b5998',
    DRIBBBLE: '#ea4c89',
    LINKEDIN: '#0077B5',
    PINTEREST: '#cc2127',
    YOUTUBE: '#e52d27',
    TUMBLR: '#35465c',
    GITHUB: '#333333',
    BEHANCE: '#1769ff',
    REDDIT: '#ff4500',
    GOOGLE: '#dd4b39',
    NOTIFICATION_BACKGROUND: '#ffeee3',
    MESSAGE_BACKGROUND_CURRENT: '#b3f1ff',
    MESSAGE_BACKGROUND_INCOMING: '#ffeee3',
    LIST_ITEM_BACKGROUND_1: '#ffeee3',
    LIST_ITEM_BACKGROUND_2: '#b3f1ff',
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
