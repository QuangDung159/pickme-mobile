import {
    Block, Button, Text, theme
} from 'galio-framework';
import React from 'react';
import {
    Image, ImageBackground, Platform, StatusBar, StyleSheet,
    View
} from 'react-native';
import { useDispatch } from 'react-redux';
import {
    Images, NowTheme, ScreenName, Utils
} from '../constants';
import { setToken } from '../redux/Actions';

export default function Onboarding(props) {
    const { navigation } = props;
    const dispatch = useDispatch();

    React.useEffect(
        () => {
            dispatch(setToken(''));
        }, [dispatch]
    );

    return (
        <Block flex style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Block flex>
                <ImageBackground
                    source={Images.Onboarding}
                    style={{
                        flex: 1,
                        zIndex: 1,
                        resizeMode: 'cover',
                    }}
                />
                <Block space="between" style={styles.padded}>
                    <Block>
                        <Block middle>
                            <Image
                                source={Images.NowLogo}
                                style={{
                                    width: 115, height: 124, bottom: 200, position: 'absolute'
                                }}
                            />
                        </Block>

                        <Block row>
                            <View>
                                <Button
                                    shadowless
                                    style={styles.button}
                                    color={NowTheme.COLORS.PRIMARY}
                                    onPress={() => {
                                        navigation.navigate(ScreenName.SIGN_IN);
                                    }}
                                >
                                    <Text
                                        style={{ fontFamily: NowTheme.FONT.MONTSERRAT_BOLD, fontSize: 14 }}
                                        color={NowTheme.COLORS.BASE}
                                    >
                                        Đăng nhập
                                    </Text>
                                </Button>
                                <Button
                                    shadowless
                                    style={styles.button}
                                    color={NowTheme.COLORS.PRIMARY}
                                    onPress={() => navigation.navigate(ScreenName.SIGN_UP)}
                                >
                                    <Text
                                        style={{ fontFamily: NowTheme.FONT.MONTSERRAT_BOLD, fontSize: 14 }}
                                        color={NowTheme.COLORS.BASE}
                                    >
                                        Đăng kí
                                    </Text>
                                </Button>
                            </View>
                        </Block>

                        <Block middle row>
                            <Text
                                color={NowTheme.COLORS.DEFAULT}
                                size={8}
                                style={{ fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR }}
                            >
                                Version 1.0
                            </Text>
                        </Block>
                    </Block>
                </Block>
            </Block>
        </Block>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'android' ? -Utils.HeaderHeight : 0
    },
    padded: {
        paddingHorizontal: theme.SIZES.BASE * 2,
        zIndex: 3,
        position: 'absolute',
        bottom: Platform.OS === 'android' ? theme.SIZES.BASE * 2 : theme.SIZES.BASE * 3
    },
    button: {
        width: NowTheme.SIZES.WIDTH_BASE * 0.8,
        shadowRadius: 0,
        shadowOpacity: 0,
        marginTop: 10
    },

    gradient: {
        zIndex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 66
    }
});
