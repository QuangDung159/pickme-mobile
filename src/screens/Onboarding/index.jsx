import { CenterLoader, CustomButton } from '@components/uiComponents';
import {
    Images, NowTheme, ScreenName, Utils
} from '@constants/index';
import { setIsSignInOtherDeviceStore, setNavigation, setToken } from '@redux/Actions';
import { UserServices } from '@services/index';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground, Platform, StatusBar, StyleSheet, Text, View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const {
    FONT: {
        MONTSERRAT_REGULAR,
    },
    SIZES,
    COLORS
} = NowTheme;

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
        const deviceId = await SecureStore.getItemAsync('deviceId');

        if (phoneNumber && password) {
            const body = {
                username: phoneNumber,
                password,
                deviceId
            };

            setIsShowSpinner(true);
            const result = await UserServices.loginAsync(body);
            const {
                data, status
            } = result;

            if (data) {
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
            } else {
                setIsShowSpinner(false);
            }
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
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={{
                flex: 1
            }}
            >
                <ImageBackground
                    source={Images.Onboarding}
                    style={{
                        flex: 1,
                        zIndex: 1,
                        resizeMode: 'cover',
                    }}
                />
                <CenterLoader isShow={isShowSpinner} />
                <View
                    style={styles.padded}
                >
                    <View>
                        {/* <View middle>
                            <Image
                                source={Images.NowLogo}
                                style={{
                                    width: 115, height: 124, bottom: 200, position: 'absolute'
                                }}
                            />
                        </View> */}

                        <View>
                            <View
                                style={{
                                    paddingBottom: SIZES.HEIGHT_BASE * 0.2,
                                    alignSelf: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: MONTSERRAT_REGULAR,
                                        fontSize: SIZES.WIDTH_BASE * 0.1,
                                        color: COLORS.ACTIVE
                                    }}
                                >
                                    PickMe
                                </Text>
                            </View>
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
                        </View>
                        <View
                            style={{
                                marginTop: 10,
                                alignSelf: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: MONTSERRAT_REGULAR,
                                    color: COLORS.DEFAULT,
                                    fontSize: SIZES.FONT_H4 - 2,
                                }}
                            >
                                {`${Constants.manifest.version}`}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: MONTSERRAT_REGULAR,
                                    color: COLORS.DEFAULT,
                                    fontSize: SIZES.FONT_H4 - 2,
                                }}
                            >
                                {deviceIdStore}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'android' ? -Utils.HeaderHeight : 0,
        flex: 1
    },
    padded: {
        zIndex: 3,
        position: 'absolute',
        bottom: SIZES.HEIGHT_BASE * 0.17,
        alignSelf: 'center',
        justifyContent: 'space-between'
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
