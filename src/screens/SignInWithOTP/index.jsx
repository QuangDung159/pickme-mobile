import {
    CenterLoader, CustomButton, CustomInput, IconCustom, NoteText
} from '@components/uiComponents';
import {
    IconFamily,
    Images, Theme, ScreenName
} from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import {
    setIsSignInOtherDeviceStore,
    setToken
} from '@redux/Actions';
import { SystemServices, UserServices } from '@services/index';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground,
    StyleSheet,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';

const {
    FONT: {
        TEXT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;

export default function SignInWithOTP({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [otp, setOtp] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');

    const expoToken = useSelector((state) => state.appConfigReducer.expoToken);

    const dispatch = useDispatch();

    useEffect(
        () => {
            getLocalValue();
        }, []
    );

    const getLocalValue = async () => {
        const phoneNumberLocalStore = await SecureStore.getItemAsync('phoneNumber');
        const passwordLocalStore = await SecureStore.getItemAsync('password');

        setPassword(passwordLocalStore);
        setPhoneNumber(phoneNumberLocalStore);
    };

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const updateExpoTokenToServer = async () => {
        await SystemServices.submitUpdateExpoTokenAsync({
            token: expoToken
        });
    };

    const onLogin = async () => {
        const deviceId = await SecureStore.getItemAsync('deviceId');
        const body = {
            username: phoneNumber,
            password,
            deviceId
        };

        setIsShowSpinner(true);
        const result = await UserServices.loginAsync(body);
        const { data } = result;

        if (data) {
            onLoginSuccess(data);
        }
        setIsShowSpinner(false);
    };

    const onSubmitOTP = async () => {
        setIsShowSpinner(true);
        const deviceId = await SecureStore.getItemAsync('deviceId');
        const body = {
            phoneNum: phoneNumber,
            password,
            deviceId,
            code: otp
        };

        const result = await SystemServices.submitChangeDeviceConfirmAsync(body);
        const { data } = result;

        if (data) {
            await onLogin();
        }
        setIsShowSpinner(false);
    };

    const onClickGetOTPWhenChangeDevice = async () => {
        setIsShowSpinner(true);
        const result = await SystemServices.fetchOtpChangeDeviceAsync({
            phoneNum: phoneNumber
        });
        const { data } = result;

        if (data) {
            ToastHelpers.renderToast(data.message, 'success');

            // in testing, will remove when prod
            setOtp(data.data.code);
        }
        setIsShowSpinner(false);
    };

    const onLoginSuccess = (tokenFromAPI) => {
        dispatch(setToken(tokenFromAPI));

        navigation.reset({
            index: 0,
            routes: [{ name: ScreenName.APP }],
        });

        updateExpoTokenToServer();

        dispatch(setIsSignInOtherDeviceStore(false));
        setIsShowSpinner(false);
    };

    return (
        <View
            style={{
                flex: 1,
                alignSelf: 'center',
                alignItems: 'center'
            }}
        >
            <ImageBackground
                source={Images.RegisterBackground}
                style={styles.imageBackgroundContainer}
                imageStyle={styles.imageBackground}
            >
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <KeyboardAwareScrollView>
                        <View
                            style={{
                                flex: 1,
                                alignSelf: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <View style={styles.registerContainer}>
                                <View
                                    style={{
                                        height: SIZES.HEIGHT_BASE * 0.2,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        marginTop: SIZES.HEIGHT_BASE * 0.1
                                    }}
                                >
                                    <NoteText
                                        width={SIZES.WIDTH_BASE * 0.77}
                                        title="Dường như bạn đang đăng nhập từ một thiết bị khác:"
                                        content="Bạn vui lòng đăng nhập lại để xác thực thiết bị này."
                                        contentStyle={{
                                            fontSize: SIZES.FONT_H4,
                                            color: COLORS.ACTIVE,
                                            fontFamily: TEXT_REGULAR,
                                            marginTop: 5
                                        }}
                                        iconComponent={(
                                            <IconCustom
                                                name="info-circle"
                                                family={IconFamily.FONT_AWESOME}
                                                size={18}
                                                color={COLORS.ACTIVE}
                                            />
                                        )}
                                        backgroundColor={COLORS.LIST_ITEM_BACKGROUND_1}
                                    />
                                </View>

                                <View style={{
                                    height: SIZES.HEIGHT_BASE * 0.2
                                }}
                                >
                                    <View
                                        style={{
                                            marginBottom: 10,
                                            alignItems: 'center'
                                        }}
                                    >

                                        {!otp ? (
                                            <CustomInput
                                                placeholder="Nhập số điện thoại..."
                                                value={phoneNumber}
                                                onChangeText={
                                                    (phoneNumberInput) => setPhoneNumber(phoneNumberInput)
                                                }
                                                containerStyle={{
                                                    marginVertical: 10,
                                                    width: SIZES.WIDTH_BASE * 0.77
                                                }}
                                            />
                                        ) : (
                                            <CustomInput
                                                value={otp}
                                                inputStyle={{
                                                    width: SIZES.WIDTH_BASE * 0.77
                                                }}
                                                onChangeText={(otpInput) => setOtp(otpInput)}
                                                keyboardType="number-pad"
                                                containerStyle={{
                                                    marginVertical: 10,
                                                    width: SIZES.WIDTH_BASE * 0.77
                                                }}
                                                placeholder="Nhập mã xác thực..."
                                            />
                                        )}
                                    </View>
                                </View>

                                <View style={{
                                    alignSelf: 'center'
                                }}
                                >
                                    {!otp ? (
                                        <CustomButton
                                            onPress={() => onClickGetOTPWhenChangeDevice()}
                                            type="active"
                                            label="Yêu cầu mã xác thực"
                                            buttonStyle={[styles.button, {
                                                marginVertical: 10
                                            }]}
                                        />
                                    ) : (
                                        <CustomButton
                                            onPress={() => onSubmitOTP()}
                                            type="active"
                                            label="Xác thực và đăng nhập"
                                            buttonStyle={[styles.button, {
                                                marginVertical: 10
                                            }]}
                                        />
                                    )}
                                </View>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                )}
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    imageBackgroundContainer: {
        width: SIZES.WIDTH_BASE,
        height: SIZES.HEIGHT_BASE,
        padding: 0,
        zIndex: 1
    },
    imageBackground: {
        width: SIZES.WIDTH_BASE,
        height: SIZES.HEIGHT_BASE
    },
    registerContainer: {
        marginTop: 55,
        width: SIZES.WIDTH_BASE * 0.9,
        height: SIZES.HEIGHT_BASE < 812 ? SIZES.HEIGHT_BASE * 0.8 : SIZES.HEIGHT_BASE * 0.8,
        backgroundColor: COLORS.BASE,
        borderRadius: 4,
        shadowColor: COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1,
        overflow: 'hidden'
    },
    button: {
        width: SIZES.WIDTH_BASE * 0.77
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
});
