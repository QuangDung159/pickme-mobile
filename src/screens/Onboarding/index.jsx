import { CenterLoader, CustomButton } from '@components/uiComponents';
import App from '@constants/App';
import {
    ScreenName, Theme, Utils, Images
} from '@constants/index';
import {
    setCurrentUser, setIsSignInOtherDeviceStore, setListPartnerHomeRedux, setNavigation
} from '@redux/Actions';
import { BookingServices, UserServices } from '@services/index';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
    Image,
    Platform, StyleSheet, Text, View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

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
        <View style={styles.container}>
            <View style={{
                flex: 1,
                backgroundColor: COLORS.BLOCK
            }}
            >
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <View
                        style={styles.padded}
                    >
                        <View>
                            <View>
                                <View
                                    style={{
                                        paddingBottom: SIZES.HEIGHT_BASE * 0.2,
                                        alignSelf: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Image
                                        source={Images.Logo}
                                        style={{
                                            width: SIZES.WIDTH_BASE * 0.9,
                                            height: 50
                                        }}
                                    />
                                    <Text
                                        style={{
                                            fontFamily: TEXT_REGULAR,
                                            fontSize: SIZES.FONT_H4,
                                            color: COLORS.ACTIVE,
                                            marginTop: 10
                                        }}
                                    >
                                        Ở đây chúng tôi phát người yêu!
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
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'android' ? -Utils.HeaderHeight : 0,
        flex: 1,
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
});
