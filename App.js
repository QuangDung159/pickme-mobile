/* eslint-disable global-require */
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { Block, Text } from 'galio-framework';
import * as React from 'react';
import {
    Image, StyleSheet
} from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { ExpoNotification } from './src/components/bussinessComponents';
import { IconCustom } from './src/components/uiComponents';
import { IconFamily, Images, NowTheme } from './src/constants';
import Main from './src/containers/Main';
import store from './src/redux/Store';

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
        <Block
            middle
            shadow
            flex
            style={styles.toastContainer}
        >
            <Text
                style={styles.toastContent}
                color={NowTheme.COLORS.SUCCESS}
                size={NowTheme.SIZES.ICON_14}
            >
                <IconCustom
                    name="check"
                    family={IconFamily.FONT_AWESOME}
                    size={15}
                    color={NowTheme.COLORS.SUCCESS}
                />
                {'  '}
                {internalState.text1}
            </Text>
        </Block>
    ),
    error: (internalState) => (
        <Block
            middle
            shadow
            flex
            style={styles.toastContainer}
        >
            <Text
                style={styles.toastContent}
                color={NowTheme.COLORS.ERROR}
                size={NowTheme.SIZES.ICON_14}
            >
                <IconCustom
                    name="remove"
                    family={IconFamily.FONT_AWESOME}
                    size={15}
                    color={NowTheme.COLORS.ERROR}
                />
                {'  '}
                {internalState.text1}
            </Text>
        </Block>
    ),
    info: () => {},
    any_custom_type: () => {}
};

export default function App() {
    const [isLoadingComplete, setIsLoadingComplete] = React.useState(false);
    const [fontLoaded, setFontLoaded] = React.useState(false);

    React.useEffect(() => {
        // with empty dependency
        // componentDidMount
        async function loadFont() {
            Font.loadAsync({
                'montserrat-regular': require('./assets/fonts/Montserrat-Regular.ttf'),
                'montserrat-bold': require('./assets/fonts/Montserrat-Bold.ttf')
            });
            setFontLoaded(true);
        }
        loadFont();
    }, []);

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
            <Provider store={store}>
                <Main />
                <ExpoNotification />
                <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
            </Provider>
        </MenuProvider>
    );
}

const styles = StyleSheet.create({
    toastContainer: {
        width: NowTheme.SIZES.WIDTH_BASE * 0.85,
        backgroundColor: NowTheme.COLORS.BASE,
        borderRadius: 15
    },
    toastContent: {
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
        textAlign: 'center',
        margin: 10
    }
});
