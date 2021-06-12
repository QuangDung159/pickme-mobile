import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { CustomButton, CustomInput } from '../../components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '../../constants';
import { ToastHelpers } from '../../helpers';
import { setIsSignInOtherDeviceStore, setShowLoaderStore, setToken } from '../../redux/Actions';
import { rxUtil } from '../../utils';

const { SIZES, COLORS } = NowTheme;

export default function OtpForm({
    otp, setOtp, password,
    setPassword, phoneNumber,
    deviceIdStore, navigation
}) {
    const [isShowPassword, setIsShowPassword] = useState(false);

    const dispatch = useDispatch();

    const onLoginSuccess = (tokenFromAPI) => {
        dispatch(setToken(tokenFromAPI));
        dispatch(setIsSignInOtherDeviceStore(false));
        dispatch(setShowLoaderStore(false));
        navigation.navigate(ScreenName.CREATE_ACCOUNT);
    };

    const loginWithSignUpInfo = () => {
        const data = {
            username: phoneNumber,
            password,
            deviceId: deviceIdStore !== null ? deviceIdStore : ''
        };

        rxUtil(
            Rx.AUTHENTICATION.LOGIN,
            'POST',
            data,
            {},
            (res) => {
                onLoginSuccess(res.data.data);
                ToastHelpers.renderToast(res.data.message, 'success');
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                dispatch(setShowLoaderStore(false));
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                dispatch(setShowLoaderStore(false));
            }
        );
    };

    const onClickSubmitRegister = () => {
        if (!otp) {
            ToastHelpers.renderToast('Mã OTP không hợp lệ!', 'error');
            return;
        }

        if (!password) {
            ToastHelpers.renderToast('Mật khẩu không hợp lệ!', 'error');
            return;
        }

        const data = {
            password,
            phoneNum: phoneNumber,
            code: otp,
            deviceId: deviceIdStore !== null ? deviceIdStore : ''
        };

        dispatch(setShowLoaderStore(true));
        rxUtil(
            Rx.AUTHENTICATION.SIGN_UP,
            'POST',
            data, {
                'Content-Type': 'application/json'
            },
            () => loginWithSignUpInfo(),
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                dispatch(setShowLoaderStore(false));
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                dispatch(setShowLoaderStore(false));
            }
        );
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
                        keyboardType="number-pad"
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
