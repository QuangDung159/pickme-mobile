import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import {
    Block, Button, Text
} from 'galio-framework';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground, Platform, StatusBar, StyleSheet
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CenterLoader } from '../components/uiComponents';
import {
    Images, NowTheme, Rx, ScreenName, Utils
} from '../constants';
import { setIsSignInOtherDeviceStore, setNavigation, setToken } from '../redux/Actions';
import { rxUtil } from '../utils';

export default function Onboarding({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);

    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);
    const deviceIdStore = useSelector((state) => state.appConfigReducer.deviceIdStore);

    const dispatch = useDispatch();

    useEffect(
        () => {
            dispatch(setToken(''));
        }, [dispatch]
    );

    useEffect(
        () => {
            dispatch(setNavigation(navigation));
            onLogin();
        }, []
    );

    useEffect(
        () => {
            if (isSignInOtherDeviceStore) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: ScreenName.SIGN_IN_WITH_OTP }],
                });
            }
        }, [isSignInOtherDeviceStore]
    );

    const onLogin = async () => {
        const phoneNumber = await SecureStore.getItemAsync('phoneNumber');
        const password = await SecureStore.getItemAsync('password');
        if (phoneNumber && password) {
            const data = {
                username: phoneNumber,
                password,
                deviceId: deviceIdStore
            };

            console.log('deviceIdStore :>> ', deviceIdStore);

            setIsShowSpinner(true);
            rxUtil(
                Rx.AUTHENTICATION.LOGIN,
                'POST',
                data,
                {},
                (res) => {
                    const { status } = res;

                    if (status === 200) {
                        getTokenFromLocal();
                        dispatch(setIsSignInOtherDeviceStore(false));
                    }

                    if (status === 201) {
                        // re otp
                        navigation.reset({
                            index: 0,
                            routes: [{ name: ScreenName.SIGN_IN_WITH_OTP }],
                        });
                    }
                }
            );
            setIsShowSpinner(false);
        }
    };

    const getTokenFromLocal = async () => {
        const apiTokenLocal = await SecureStore.getItemAsync('api_token');
        dispatch(setToken(apiTokenLocal));
        if (apiTokenLocal) {
            navigation.reset({
                index: 0,
                routes: [{ name: ScreenName.APP }],
            });
        }
    };

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
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <Block space="between" style={styles.padded}>
                        <Block>
                            {/* <Block middle>
                            <Image
                                source={Images.NowLogo}
                                style={{
                                    width: 115, height: 124, bottom: 200, position: 'absolute'
                                }}
                            />
                        </Block> */}

                            <Block>
                                <Block
                                    middle
                                    style={{
                                        paddingBottom: NowTheme.SIZES.HEIGHT_BASE * 0.3
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                            fontSize: NowTheme.SIZES.WIDTH_BASE * 0.1
                                        }}
                                        color={NowTheme.COLORS.ACTIVE}
                                    >
                                        PickMe
                                    </Text>
                                </Block>
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
                            </Block>
                            <Block middle>
                                <Text
                                    color={NowTheme.COLORS.DEFAULT}
                                    size={NowTheme.SIZES.FONT_H4 - 2}
                                    style={{ fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR }}
                                >
                                    {`${Constants.manifest.version}`}
                                </Text>
                                <Text
                                    color={NowTheme.COLORS.DEFAULT}
                                    size={NowTheme.SIZES.FONT_H4 - 2}
                                    style={{ fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR }}
                                >
                                    {deviceIdStore}
                                </Text>
                            </Block>
                        </Block>
                    </Block>
                )}
            </Block>
        </Block>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'android' ? -Utils.HeaderHeight : 0
    },
    padded: {
        zIndex: 3,
        position: 'absolute',
        bottom: NowTheme.SIZES.HEIGHT_BASE * 0.1,
        alignSelf: 'center',
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
