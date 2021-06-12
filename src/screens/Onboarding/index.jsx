import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import {
    Block, Text
} from 'galio-framework';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground, Platform, StatusBar, StyleSheet
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CenterLoader, CustomButton } from '../../components/uiComponents';
import {
    Images, NowTheme, Rx, ScreenName, Utils
} from '../../constants';
import { ToastHelpers } from '../../helpers';
import { setIsSignInOtherDeviceStore, setNavigation, setToken } from '../../redux/Actions';
import { rxUtil } from '../../utils';

const { FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    }, SIZES, COLORS } = NowTheme;

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
                },
                (res) => {
                    setIsShowSpinner(false);
                    ToastHelpers.renderToast(res.data.message, 'error');
                },
                (res) => {
                    setIsShowSpinner(false);
                    ToastHelpers.renderToast(res.data.message, 'error');
                }
            );
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
                                        paddingBottom: SIZES.HEIGHT_BASE * 0.2
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: MONTSERRAT_REGULAR,
                                            fontSize: SIZES.WIDTH_BASE * 0.1
                                        }}
                                        color={COLORS.ACTIVE}
                                    >
                                        PickMe
                                    </Text>
                                </Block>
                                <CustomButton
                                    onPress={() => {
                                        navigation.navigate(ScreenName.SIGN_IN);
                                    }}
                                    type="active"
                                    label="Đăng nhập"
                                    buttonStyle={styles.button}
                                />
                                <CustomButton
                                    onPress={() => navigation.navigate(ScreenName.SIGN_UP)}
                                    type="active"
                                    label="Đăng kí"
                                    buttonStyle={styles.button}
                                />
                            </Block>
                            <Block
                                middle
                                style={{
                                    marginTop: 10
                                }}
                            >
                                <Text
                                    color={COLORS.DEFAULT}
                                    size={SIZES.FONT_H4 - 2}
                                    style={{ fontFamily: MONTSERRAT_REGULAR }}
                                >
                                    {`${Constants.manifest.version}`}
                                </Text>
                                <Text
                                    color={COLORS.DEFAULT}
                                    size={SIZES.FONT_H4 - 2}
                                    style={{ fontFamily: MONTSERRAT_REGULAR }}
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
        bottom: SIZES.HEIGHT_BASE * 0.17,
        alignSelf: 'center',
    },
    button: {
        width: SIZES.WIDTH_BASE * 0.8,
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
