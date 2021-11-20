import {
    CenterLoader, CustomButton, CustomModal, CustomText, TouchableText
} from '@components/uiComponents';
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
    Image, StyleSheet, Text, View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import SignIn from './SignIn';

const {
    FONT: {
        TEXT_REGULAR
    },
    SIZES,
    COLORS
} = Theme;

export default function Onboarding({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [deviceIdDisplay, setDeviceIdDisplay] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    // const [isRegisterPartner, setIsRegisterPartner] = useState(false);

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
        const phoneNumber = await SecureStore.getItemAsync('username');
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

    const renderModalRegisterPartner = () => (
        <CustomModal
            modalVisible={modalVisible}
            renderContent={() => (
                <View>
                    <CustomText
                        style={{
                            textAlign: 'center',
                            marginBottom: 10,
                            fontSize: SIZES.FONT_H4
                        }}
                        text="Vui lòng đăng nhập để tiếp tục"
                    />

                    <CustomText
                        style={{
                            textAlign: 'center',
                            marginBottom: 10,
                            fontSize: SIZES.FONT_H4
                        }}
                        text={'Nếu bạn chưa có tài khoản,\nvui lòng đăng ký tài khoản PickMe'}
                    />

                    <View>
                        <CustomButton
                            onPress={() => setModalVisible(!modalVisible)}
                            buttonStyle={[styles.button, {
                                width: SIZES.WIDTH_BASE * 0.8
                            }]}
                            type="active"
                            label="Đã hiểu"
                        />
                    </View>
                </View>
            )}
        />
    );

    return (
        <>
            {isShowSpinner ? (
                <CenterLoader />
            ) : (
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        backgroundColor: COLORS.BASE,
                        alignItems: 'center',
                        width: SIZES.WIDTH_BASE,
                        height: SIZES.HEIGHT_BASE
                    }}
                >
                    <>
                        <View
                            style={{
                                position: 'absolute',
                                top: 40,
                                zIndex: 99,
                                alignSelf: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <CustomText
                                style={{
                                    fontSize: SIZES.FONT_H5 - 4
                                }}
                                text={`${Constants.manifest.version} (${App.APP_VERSION_OTA})`}
                            />
                            <CustomText
                                style={{
                                    fontSize: SIZES.FONT_H5 - 4
                                }}
                                text={deviceIdDisplay}
                            />
                        </View>
                        {renderModalRegisterPartner()}
                        <View
                            style={{
                                marginTop: 130
                            }}
                        >
                            <View
                                style={{
                                    paddingBottom: 90,
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
                                <CustomText
                                    style={{
                                        color: COLORS.ACTIVE,
                                        marginTop: 10
                                    }}
                                    text="Ở đây chúng tôi phát người yêu!"
                                />
                            </View>
                        </View>
                        <SignIn
                            navigation={navigation}
                            setIsShowSpinner={(isShow) => setIsShowSpinner(isShow)}
                            // isRegisterPartner={isRegisterPartner}
                        />
                        <View
                            style={{
                                marginTop: 40,
                                alignSelf: 'center',
                                alignItems: 'center',
                                marginBottom: 30
                            }}
                        >
                            <TouchableText
                                style={{
                                    color: COLORS.ACTIVE,
                                    fontSize: SIZES.FONT_H3
                                }}
                                text="Đăng ký"
                                onPress={() => navigation.navigate(ScreenName.SIGN_UP)}
                            />
                            {/* <TouchableText
                                text="Quên mật khẩu?"
                                onPress={() => navigation.navigate(ScreenName.FORGOT_PASSWORD)}
                                style={{
                                    color: COLORS.ACTIVE,
                                    marginBottom: 10,
                                    fontSize: SIZES.FONT_H3
                                }}
                            /> */}
                            {/* <BecomePartnerText onPress={() => {
                                setModalVisible(true);
                                setIsRegisterPartner(true);
                            }}
                            /> */}
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 10,
                                alignSelf: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: TEXT_REGULAR,
                                    fontSize: SIZES.FONT_H5 - 4,
                                    color: COLORS.ACTIVE,
                                }}
                            >
                                Powered by DragonC92Team
                            </Text>
                        </View>
                    </>
                </KeyboardAwareScrollView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        // marginTop: Platform.OS === 'android' ? -Utils.HeaderHeight : 0,
        backgroundColor: COLORS.BASE,
        flex: 1,
    },
    padded: {
        zIndex: 3,
        position: 'absolute',
        bottom: SIZES.HEIGHT_BASE * 0.17,
        alignSelf: 'center',
        width: SIZES.WIDTH_BASE,
        backgroundColor: COLORS.BASE
    },
    button: {
        marginTop: 10
    },
    text: {
        fontFamily: TEXT_REGULAR,
        fontSize: SIZES.FONT_H4,
        color: COLORS.ACTIVE,
        marginTop: 10
    }
});
