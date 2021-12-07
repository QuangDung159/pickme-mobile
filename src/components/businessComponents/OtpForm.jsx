import {
    CustomButton, CustomInput, OtpItem, TouchableText
} from '@components/uiComponents';
import {
    IconFamily, ScreenName, Theme
} from '@constants/index';
import { ToastHelpers, ValidationHelpers } from '@helpers/index';
import { setIsSignInOtherDeviceStore, setShowLoaderStore } from '@redux/Actions';
import { UserServices } from '@services/index';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useRef, useState } from 'react';
import {
    Keyboard, StyleSheet, TextInput, View
} from 'react-native';
import { useDispatch } from 'react-redux';

const {
    SIZES, COLORS
} = Theme;

const OTP = [0, 1, 2, 3];
let intervalCountdown = '';

export default function OtpForm({
    otp, setOtp, password,
    setPassword, username,
    navigation,
    isEmail,
    renderFrom,
    setRePassword,
    rePassword
}) {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowRePassword, setIsShowRePassword] = useState('');
    const [code, setCode] = useState(otp);
    const [indexFocus, setIndexFocus] = useState(3);
    const [countdown, setCountdown] = useState(30);
    const [isCanPressResend, setIsCanPressResend] = useState(false);

    const textRef = useRef();

    const dispatch = useDispatch();

    useEffect(() => {
        if (countdown === 0) {
            setIsCanPressResend(true);
            setCountdown(0);
            clearInterval(intervalCountdown);
        }
    }, [countdown]);

    useEffect(() => {
        startIntervalCountdown();
        // if (isIOS()) {
        //     UtilityModule.disableIQKeyboardManager();
        // }
        return () => {
            // if (isIOS()) {
            //     UtilityModule.enableIQKeyboardManager();
            // }
            clearInterval(intervalCountdown);
        };
    }, []);

    const onLoginSuccess = async (data) => {
        const currentUserInfo = await UserServices.mappingCurrentUserInfo(data.data);
        SecureStore.setItemAsync('api_token', `${currentUserInfo.token}`);
        dispatch(setIsSignInOtherDeviceStore(false));
        dispatch(setShowLoaderStore(false));

        navigation.navigate(ScreenName.CREATE_ACCOUNT);
    };

    const loginWithSignUpInfo = async () => {
        const deviceId = await SecureStore.getItemAsync('deviceId');
        const body = {
            username,
            password,
            deviceId
        };

        const result = await UserServices.loginAsync(body);
        const {
            data
        } = result;

        if (data) {
            await onLoginSuccess(data);
            SecureStore.setItemAsync('username', username.toString());
            SecureStore.setItemAsync('password', password.toString());
        }
        dispatch(setShowLoaderStore(false));
    };

    const validate = () => {
        const validateArr = [
            {
                fieldName: 'OTP',
                input: code,
                validate: {
                    required: {
                        value: true
                    }
                }
            },
            {
                fieldName: 'Mật khẩu',
                input: password,
                validate: {
                    required: {
                        value: true
                    },
                    maxLength: {
                        value: 50,
                    },
                    minLength: {
                        value: 8,
                    },
                }
            }
        ];

        if (renderFrom === ScreenName.FORGOT_PASSWORD) {
            validateArr.push({
                fieldName: 'Xác nhận mật khẩu',
                input: rePassword,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 50,
                    },
                    minLength: {
                        value: 8,
                    },
                }
            });
        }

        if (!ValidationHelpers.validate(validateArr)) return false;

        if (renderFrom === ScreenName.FORGOT_PASSWORD) {
            if (!isPasswordMatch()) return false;
        }

        return true;
    };

    const onClickSubmitRegister = async () => {
        if (!validate()) return;

        const deviceId = await SecureStore.getItemAsync('deviceId');

        const body = {
            password,
            username,
            code,
            deviceId,
            isEmail,
            referralCode: '1234'
        };

        dispatch(setShowLoaderStore(true));
        const result = await UserServices.submitSignUpAsync(body);
        const { data } = result;

        if (data) {
            await loginWithSignUpInfo();
        }
        dispatch(setShowLoaderStore(false));
    };

    const startIntervalCountdown = () => {
        intervalCountdown = setInterval(() => {
            setCountdown((resendTime) => resendTime - 1);
        }, 1000);
    };

    const onClickGetOTP = async () => {
        setCode('');
        setIsCanPressResend(false);
        setCountdown(30);
        startIntervalCountdown();

        let result = null;
        if (renderFrom === ScreenName.SIGN_UP) {
            result = await UserServices.fetchOtpSignUpAsync({
                username,
                isEmail
            });
        } else {
            result = await UserServices.fetchOtpForgotPasswordAsync({
                username,
                isEmail
            });
        }

        const { data } = result;
        if (data) {
            ToastHelpers.renderToast('OTP đã được gửi,\nvui lòng kiểm tra', 'success');
            setOtp(data.message);
        }
    };

    const onSubmitForgotPassword = async () => {
        if (!validate()) return;

        dispatch(setShowLoaderStore(true));
        const body = {
            username,
            password,
            code
        };

        dispatch(setShowLoaderStore(true));
        const result = await UserServices.submitForgotPasswordAsync(body);
        const { data } = result;

        if (data) {
            navigation.navigate(ScreenName.ONBOARDING);
            ToastHelpers.renderToast(data.message, 'success');
        }
        dispatch(setShowLoaderStore(false));
    };

    const isPasswordMatch = () => {
        if (rePassword !== password) {
            ToastHelpers.renderToast('Mật khẩu không khớp,\nbạn vui lòng kiểm tra lại.', 'error');
            return false;
        }
        return true;
    };

    const handleChangeText = (text) => {
        if (text.length === 4) {
            Keyboard.dismiss();
        }

        if (text.length < code.length) {
            const codeArr = code.split('');
            codeArr.splice(indexFocus, 1);

            const codeStr = codeArr.join('');
            const nextIndexFocus = indexFocus > 0 ? indexFocus - 1 : 0;

            setCode(codeStr);
            setIndexFocus(nextIndexFocus);
        } else if (text.length < 5) {
            setIndexFocus(text.length > 1 ? text.length - 1 : 0);
            setCode(text);
        }
    };

    const renderCountdown = () => countdown;

    const renderOtpForm = () => (
        <>
            <View style={styles.formContainer}>
                <View
                    style={styles.formInputContainer}
                >
                    {/* <CustomInput
                        value={otp}
                        inputStyle={{
                            width: SIZES.WIDTH_BASE * 0.9,
                            textAlign: 'center',
                            fontFamily: TEXT_BOLD
                        }}
                        onChangeText={(otpInput) => setOtp(otpInput)}
                        keyboardType="number-pad"
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9,
                        }}
                        placeholder="Nhập mã xác thực"
                    /> */}

                    <TextInput
                        textContentType="oneTimeCode"
                        keyboardType="number-pad"
                        value={code}
                        ref={textRef}
                        style={styles.otpHidden}
                        onChangeText={(text) => {
                            handleChangeText(text);
                        }}
                        maxLength={4}
                        onSubmitEditing={() => { }}
                        autoCapitalize='none'
                    />
                    <View style={styles.otp}>
                        {OTP.map((item, index) => (
                            <OtpItem
                                onPress={() => {
                                    setIndexFocus(index);
                                    textRef.current.focus();
                                }}
                                code={code}
                                index={index}
                                key={index.toString()}
                            />
                        ))}
                    </View>

                    <CustomInput
                        value={password}
                        inputStyle={{
                            width: SIZES.WIDTH_BASE * 0.9,
                            textAlign: 'center',
                        }}
                        onChangeText={(passwordInput) => setPassword(passwordInput)}
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        secureTextEntry={!isShowPassword}
                        placeholder="Nhập mật khẩu"
                        rightIcon={{
                            name: 'eye',
                            family: IconFamily.ENTYPO,
                            size: 20,
                            color: COLORS.DEFAULT
                        }}
                        onPressRightIcon={() => setIsShowPassword(!isShowPassword)}
                    />

                    {renderFrom === ScreenName.FORGOT_PASSWORD && (
                        <CustomInput
                            value={rePassword}
                            inputStyle={{
                                width: SIZES.WIDTH_BASE * 0.9,
                                textAlign: 'center',
                            }}
                            onChangeText={(input) => setRePassword(input)}
                            containerStyle={{
                                marginVertical: 10,
                                width: SIZES.WIDTH_BASE * 0.9
                            }}
                            secureTextEntry={!isShowPassword}
                            placeholder="Xác nhận mật khẩu"
                            rightIcon={{
                                name: 'eye',
                                family: IconFamily.ENTYPO,
                                size: 20,
                                color: COLORS.DEFAULT
                            }}
                            onPressRightIcon={() => setIsShowRePassword(!isShowRePassword)}
                        />
                    )}

                    <TouchableText
                        style={{
                            color: COLORS.ACTIVE,
                            marginTop: 10,
                        }}
                        text={!isCanPressResend ? `Gửi lại OTP (${renderCountdown()}s)` : 'Gửi lại OTP'}
                        disabled={!isCanPressResend}
                        onPress={() => onClickGetOTP()}
                    />

                </View>
            </View>

            <View style={{
                position: 'absolute',
                bottom: 0
            }}
            >
                <CustomButton
                    onPress={
                        () => {
                            if (renderFrom === ScreenName.FORGOT_PASSWORD) {
                                onSubmitForgotPassword();
                            } else {
                                onClickSubmitRegister();
                            }
                        }
                    }
                    buttonStyle={styles.button}
                    type="active"
                    label="Xác nhận"
                />
            </View>
        </>
    );

    return (
        <View>
            {renderOtpForm()}
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        width: SIZES.WIDTH_BASE * 0.9,
        marginVertical: 10
    },
    formContainer: {
        height: SIZES.HEIGHT_BASE * 0.65
    },
    formInputContainer: {
        alignItems: 'center',
    },
    otpHidden: { width: 0, height: 0, position: 'absolute' },
    otp: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 15,
    },
});
