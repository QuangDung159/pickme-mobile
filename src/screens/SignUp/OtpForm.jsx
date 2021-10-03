import { CustomButton, CustomInput } from '@components/uiComponents';
import {
    IconFamily, ScreenName, Theme
} from '@constants/index';
import { ValidationHelpers } from '@helpers/index';
import { setIsSignInOtherDeviceStore, setShowLoaderStore, setToken } from '@redux/Actions';
import { UserServices } from '@services/index';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

const { SIZES, COLORS } = Theme;

export default function OtpForm({
    otp, setOtp, password,
    setPassword, phoneNumber,
    navigation
}) {
    const [isShowPassword, setIsShowPassword] = useState(false);

    const dispatch = useDispatch();

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
            username: phoneNumber,
            password,
            deviceId
        };

        const result = await UserServices.loginAsync(body);
        const {
            data
        } = result;

        if (data) {
            onLoginSuccess(data);
            SecureStore.setItemAsync('phoneNumber', phoneNumber);
            SecureStore.setItemAsync('password', password);
        }
        dispatch(setShowLoaderStore(false));
    };

    const validate = () => {
        const validateArr = [
            {
                fieldName: 'OTP',
                input: otp,
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
            phoneNum: phoneNumber,
            code: otp,
            deviceId
        };

        dispatch(setShowLoaderStore(true));
        const result = await UserServices.submitSignUpAsync(body);
        const { data } = result;

        if (data) {
            await loginWithSignUpInfo();
        }
        dispatch(setShowLoaderStore(false));
    };

    const renderOtpForm = () => (
        <>
            <View style={styles.stepSessionContainer}>
                <View
                    style={styles.formInputContainer}
                >
                    <CustomInput
                        value={otp}
                        inputStyle={{
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        onChangeText={(otpInput) => setOtp(otpInput)}
                        keyboardType="number-pad"
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        placeholder="Nhập mã xác thực..."
                    />

                    <CustomInput
                        value={password}
                        inputStyle={{
                            width: SIZES.WIDTH_BASE * 0.9
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

                </View>
            </View>

            <View center>
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
    stepSessionContainer: {
        height: SIZES.HEIGHT_BASE * 0.3
    },
    formInputContainer: {
        alignItems: 'center',
    }
});
