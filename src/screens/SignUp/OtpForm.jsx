import { CustomButton, CustomInput } from '@components/uiComponents';
import {
    IconFamily, NowTheme, ScreenName
} from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import { setIsSignInOtherDeviceStore, setShowLoaderStore, setToken } from '@redux/Actions';
import { UserServices } from '@services/index';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

const { SIZES, COLORS } = NowTheme;

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
        }
        dispatch(setShowLoaderStore(false));
    };

    const onClickSubmitRegister = async () => {
        if (!otp) {
            ToastHelpers.renderToast('Mã OTP không hợp lệ!', 'error');
            return;
        }

        if (!password) {
            ToastHelpers.renderToast('Mật khẩu không hợp lệ!', 'error');
            return;
        }

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

                    <CustomInput
                        value={password}
                        inputStyle={{
                            width: SIZES.WIDTH_BASE * 0.77
                        }}
                        onChangeText={(passwordInput) => setPassword(passwordInput)}
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.77
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
        width: SIZES.WIDTH_BASE * 0.77,
        marginVertical: 10
    },
    stepSessionContainer: {
        height: SIZES.HEIGHT_BASE * 0.3
    },
    formInputContainer: {
        alignItems: 'center',
    }
});
