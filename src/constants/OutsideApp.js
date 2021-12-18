import App from '@constants/App';
import Constants from 'expo-constants';

export default {
    SKYPE: {
        deepLink: 'skype:',
        key: 'skype',
        name: 'Skype'
    },
    ZALO: {
        deepLink: 'https://zalo.me/',
        key: 'zalo',
        name: 'Zalo'
    },
    MESSENGER: {
        deepLink: 'http://m.me/',
        key: 'messenger',
        name: 'Messenger'
    },
    GOOGLE_MAP: {
        deepLink: 'https://www.google.com/maps?daddr=',
        key: 'google_map',
        name: 'Google Map'
    },
    GAMING: {
        deepLink: 'game:',
        key: 'choi_game',
        name: 'Game'
    },
    FACEBOOK: {
        deepLink: `fb://page/${App.FACEBOOK_PAGE_ID}`,
        key: 'facebook',
        name: 'Facebook'
    },
    GOOGLE_PLAY_STORE: {
        deepLink: `market://details?id=${Constants.manifest.android.package}`,
        key: 'google_play_store',
        name: 'Google Play Store'
    }
};
