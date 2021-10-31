import {
    CustomButton, CustomInput, OtpItem, TouchableText
} from '@components/uiComponents';
import {
    IconFamily, ScreenName, Theme
} from '@constants/index';
import { ToastHelpers, ValidationHelpers } from '@helpers/index';
import { setIsSignInOtherDeviceStore, setShowLoaderStore, setToken } from '@redux/Actions';
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
let interval2min = '';

export default function OtpForm({
    otp, setOtp, password,
    setPassword, username,
    navigation,
    isEmail
}) {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [code, setCode] = useState(otp);
    const [indexFocus, setIndexFocus] = useState(3);
    const [twoMins, setTwoMins] = useState(30);
    const [isCanPressResend, setIsCanPressResend] = useState(false);

    const textRef = useRef();

    const dispatch = useDispatch();

    useEffect(() => {
        if (twoMins === 0) {
            setIsCanPressResend(true);
            setTwoMins(0);
            clearInterval(interval2min);
        }
    }, [twoMins]);

    useEffect(() => {
        startInterval2min();
        // if (isIOS()) {
        //     UtilityModule.disableIQKeyboardManager();
        // }
        return () => {
            // if (isIOS()) {
            //     UtilityModule.enableIQKeyboardManager();
            // }
            clearInterval(interval2min);
        };
    }, []);

    const onLoginSuccess = (tokenFromAPI) => {
        dispatch(setToken(tokenFromAPI));
        dispatch(setIsSignInOtherDeviceStore(false));
        dispatch(setShowLoaderStore(false));

        SecureStore.setItemAsync('api_token', tokenFromAPI);
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
            onLoginSuccess(data);
            SecureStore.setItemAsync('username', username);
            SecureStore.setItemAsync('password', password);
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

        return ValidationHelpers.validate(validateArr);
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

    const startInterval2min = () => {
        interval2min = setInterval(() => {
            setTwoMins((resendTime) => resendTime - 1);
        }, 1000);
    };

    const onClickGetOTP = async () => {
        setCode('');
        setIsCanPressResend(false);
        setTwoMins(30);
        startInterval2min();

        const result = await UserServices.fetchOtpSignUpAsync({
            username,
            isEmail: false
        });
        const { data } = result;

        if (data) {
            ToastHelpers.renderToast('OTP đã được gửi,\nvui lòng kiểm tra', 'success');
            setOtp(data.message);
        }
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

    const render2Mins = () => twoMins;

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
                        placeholder="Nhập mã xác thực..."
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
                        onSubmitEditing={() => {}}
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
                        placeholder="Nhập mật khẩu..."
                        rightIcon={{
                            name: 'eye',
                            family: IconFamily.ENTYPO,
                            size: 20,
                            color: COLORS.DEFAULT
                        }}
                        onPressRightIcon={() => setIsShowPassword(!isShowPassword)}
                    />

                    <TouchableText
                        style={{
                            color: COLORS.ACTIVE,
                            marginTop: 10,
                        }}
                        text={!isCanPressResend ? `Gửi lại OTP (${render2Mins()}s)` : 'Gửi lại OTP'}
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
                    onPress={() => onClickSubmitRegister()}
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
