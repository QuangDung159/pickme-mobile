/* eslint-disable global-require */
/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { ENV } from '@env';
import { ExpoNotification } from '@components/businessComponents';
import { IconCustom } from '@components/uiComponents';
import { IconFamily, Images, Theme } from '@constants/index';
import Main from '@containers/Main';
import { ToastHelpers } from '@helpers/index';
import store from '@redux/Store';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as React from 'react';
import {
    Image, Platform, StatusBar, StyleSheet, Text, View
} from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

const {
    FONT: {
        MONTSERRAT_BOLD,
        MONTSERRAT_REGULAR
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

export default function App() {
    const [isLoadingComplete, setIsLoadingComplete] = React.useState(false);
    const [fontLoaded, setFontLoaded] = React.useState(false);

    React.useEffect(
        () => {
            async function loadFont() {
                Font.loadAsync({
                    'montserrat-regular': require('./assets/fonts/Montserrat-Regular.ttf'),
                    'montserrat-bold': require('./assets/fonts/Montserrat-Bold.ttf')
                });
                setFontLoaded(true);
            }
            loadFont();
        }, []
    );

    const loadResourcesAsync = async () => {
        await Font.loadAsync({
            'montserrat-regular': require('./assets/fonts/Montserrat-Regular.ttf'),
            'montserrat-bold': require('./assets/fonts/Montserrat-Bold.ttf')
        });
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
                barStyle="light-content"
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
                                fontFamily: MONTSERRAT_REGULAR,
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
        fontFamily: MONTSERRAT_BOLD,
        textAlign: 'center',
        margin: 10
    }
});
