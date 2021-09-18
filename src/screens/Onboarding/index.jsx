import { CenterLoader } from '@components/uiComponents';
import App from '@constants/App';
import {
    Images, ScreenName, Theme
} from '@constants/index';
import {
    setCurrentUser, setIsSignInOtherDeviceStore, setListPartnerHomeRedux, setNavigation
} from '@redux/Actions';
import { BookingServices, UserServices } from '@services/index';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
    Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SignIn from './SignIn';

const {
    FONT: {
        TEXT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;

export default function Onboarding({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [deviceIdDisplay, setDeviceIdDisplay] = useState('');

    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

    useEffect(
        () => {
            getListPartner();
            dispatch(setNavigation(navigation));
            onLogin();

            SecureStore.getItemAsync('deviceId').then((deviceIdLocal) => {
                setDeviceIdDisplay(deviceIdLocal);
            });
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

    const getListPartner = async () => {
        const result = await BookingServices.fetchListPartnerAsync();
        const { data } = result;

        if (data) {
            dispatch(setListPartnerHomeRedux(data.data));
        }
    };

    const onLogin = async () => {
        const phoneNumber = await SecureStore.getItemAsync('phoneNumber');
        const password = await SecureStore.getItemAsync('password');
        const apiToken = await SecureStore.getItemAsync('api_token');
        const deviceId = await SecureStore.getItemAsync('deviceId');

        if (apiToken) {
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
                    const currentUserInfo = await UserServices.mappingCurrentUserInfo(data.data);
                    SecureStore.setItemAsync('api_token', `${currentUserInfo.token}`);
                    dispatch(setCurrentUser(currentUserInfo));

                    if (status === 200) {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: ScreenName.APP }],
                        });
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
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {isShowSpinner ? (
                <CenterLoader />
            ) : (
                <>
                    <View
                        style={{
                            paddingVertical: 140,
                            alignItems: 'center'
                        }}
                    >
                        <Image
                            style={{
                                width: SIZES.WIDTH_BASE * 0.9,
                                height: 60
                            }}
                            source={Images.Logo}
                        />
                        <Text
                            style={{
                                fontFamily: TEXT_REGULAR,
                                fontSize: SIZES.FONT_H3,
                                color: COLORS.ACTIVE
                            }}
                        >
                            Ở đây chúng tôi phát người yêu!
                        </Text>
                    </View>
                    <SignIn
                        navigation={navigation}
                        setIsShowSpinner={(isShow) => setIsShowSpinner(isShow)}
                    />
                    <TouchableOpacity
                        onPress={() => navigation.navigate(ScreenName.SIGN_UP)}
                        style={{
                            marginTop: 60
                        }}
                    >
                        <Text
                            style={styles.text}
                        >
                            Đăng ký
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate(ScreenName.FORGOT_PASSWORD);
                        }}
                    >
                        <Text
                            style={styles.text}
                        >
                            Quên mật khẩu?
                        </Text>
                    </TouchableOpacity>
                    <View
                        style={{
                            marginTop: 10,
                            alignSelf: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: TEXT_REGULAR,
                                color: COLORS.DEFAULT,
                                fontSize: SIZES.FONT_H4 - 2,
                            }}
                        >
                            {`${Constants.manifest.version} (${App.APP_VERSION_OTA})`}
                        </Text>
                        <Text
                            style={{
                                fontFamily: TEXT_REGULAR,
                                color: COLORS.DEFAULT,
                                fontSize: SIZES.FONT_H4 - 2,
                            }}
                        >
                            {deviceIdDisplay}
                        </Text>

                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 20,
                            alignSelf: 'center'
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: TEXT_REGULAR,
                                fontSize: SIZES.FONT_H5,
                                color: COLORS.ACTIVE,
                            }}
                        >
                            Powered by DragonC92Team
                        </Text>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'center',
        width: SIZES.WIDTH_BASE,
        backgroundColor: COLORS.BLOCK
    },
    button: {
        marginTop: 10
    },
    text: {
        fontFamily: TEXT_REGULAR,
        fontSize: SIZES.FONT_H2,
        color: COLORS.ACTIVE,
        alignSelf: 'center'
    }
});
