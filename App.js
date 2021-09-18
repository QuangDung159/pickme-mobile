/* eslint-disable global-require */
/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { ExpoNotification } from '@components/businessComponents';
import { IconCustom } from '@components/uiComponents';
import { IconFamily, Images, Theme } from '@constants/index';
import Main from '@containers/Main';
import { ENV } from '@env';
import { ToastHelpers } from '@helpers/index';
import store from '@redux/Store';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as Updates from 'expo-updates';
import * as React from 'react';
import {
    Alert,
    Image, Platform, StatusBar, StyleSheet, Text, View
} from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

const {
    FONT: {
        TEXT_BOLD,
        TEXT_REGULAR
    },
    SIZES,
    COLORS
} = Theme;

console.disableYellowBox = true;

// images caching
function cacheImages(images) {
    return images.map((image) => {
        if (typeof image === 'string' && image !== undefined) {
            return Image.prefetch(image);
        }
        if (image !== undefined) {
            return Asset.fromModule(image).downloadAsync();
        }
        return null;
    });
}

// cache app images
const assetImages = [
    Images.Onboarding,
];

// toast config common
const toastConfig = {
    success: (internalState) => (
        <View
            style={styles.toastContainer}
        >
            <Text
                style={
                    [
                        styles.toastContent,
                        {
                            color: COLORS.SUCCESS,
                            fontSize: SIZES.FONT_H3
                        }
                    ]
                }
            >
                <IconCustom
                    name="check"
                    family={IconFamily.FONT_AWESOME}
                    size={15}
                    color={COLORS.SUCCESS}
                />
                {'  '}
                {internalState.text1}
            </Text>
        </View>
    ),
    error: (internalState) => (
        <View
            style={styles.toastContainer}
        >
            <Text
                style={
                    [
                        styles.toastContent,
                        {
                            color: COLORS.ERROR,
                            fontSize: SIZES.FONT_H3
                        }
                    ]
                }
            >
                <IconCustom
                    name="remove"
                    family={IconFamily.FONT_AWESOME}
                    size={15}
                    color={COLORS.ERROR}
                />
                {'  '}
                {internalState.text1}
            </Text>
        </View>
    ),
    info: (res) => ToastHelpers.renderToast(res.data.message, 'error'),
    any_custom_type: (res) => ToastHelpers.renderToast(res.data.message, 'error')
};

const getFonts = () => Font.loadAsync({
    'montserrat-regular': require('./assets/fonts/Montserrat-Regular.ttf'),
    'montserrat-bold': require('./assets/fonts/Montserrat-Bold.ttf'),
    'tahoma-regular': require('./assets/fonts/tahoma-regular.ttf'),
    'tahoma-bold': require('./assets/fonts/tahoma-bold.ttf'),
    'helvetica-neue-regular': require('./assets/fonts/helvetica-neue-regular.ttf'),
    'helvetica-neue-bold': require('./assets/fonts/helvetica-neue-bold.ttf'),
    'roboto-regular': require('./assets/fonts/roboto-regular.ttf'),
    'roboto-bold': require('./assets/fonts/roboto-bold.ttf')
});

export default function App() {
    const [isLoadingComplete, setIsLoadingComplete] = React.useState(false);
    const [fontLoaded, setFontLoaded] = React.useState(false);

    React.useEffect(
        () => {
            const fetchUpdateOTA = Updates.addListener(async () => {
                const otaObj = await Updates.fetchUpdateAsync();
                if (otaObj.isNew) {
                    Alert.alert(
                        'Bạn có bản cập nhật mới',
                        '',
                        [
                            { text: 'Cập nhật', onPress: () => Updates.reloadAsync() },
                        ],
                    );
                }
            });

            return () => fetchUpdateOTA;
        }, []
    );

    React.useEffect(
        () => {
            async function loadFont() {
                await getFonts();
                setFontLoaded(true);
            }
            loadFont();
        }, []
    );

    const loadResourcesAsync = async () => {
        await getFonts();
        setFontLoaded(true);

        return Promise.all([...cacheImages(assetImages)]);
    };

    const handleLoadingError = (error) => {
        // In this case, you might want to report the error to your error
        // reporting service, for example Sentry
        console.warn(error);
    };

    const handleFinishLoading = () => {
        if (fontLoaded) {
            setIsLoadingComplete(true);
        }
    };

    // rendering
    if (!isLoadingComplete) {
        return (
            <AppLoading
                startAsync={loadResourcesAsync}
                onError={handleLoadingError}
                onFinish={handleFinishLoading}
            />
        );
    }
    return (
        <MenuProvider>
            <StatusBar
                barStyle="dark-content"
                translucent
            />
            <Provider store={store}>
                <ExpoNotification />
                <Main />
                <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
                {ENV !== 'prod' && (
                    <View
                        style={{
                            position: 'absolute',
                            right: 5,
                            bottom: Platform.OS === 'android' ? 5 : 32,
                            zIndex: 99
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: TEXT_REGULAR,
                                color: COLORS.ACTIVE,
                                fontSize: SIZES.FONT_H5,
                            }}
                        >
                            {ENV}
                        </Text>
                    </View>
                )}
            </Provider>
        </MenuProvider>
    );
}

const styles = StyleSheet.create({
    toastContainer: {
        width: SIZES.WIDTH_BASE * 0.85,
        backgroundColor: COLORS.BLOCK,
        borderRadius: 30,
        borderColor: COLORS.DEFAULT,
        borderWidth: 0.5,
        marginTop: 20,
    },
    toastContent: {
        fontFamily: TEXT_BOLD,
        textAlign: 'center',
        margin: 10
    }
});
