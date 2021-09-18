import {
    CenterLoader, CustomButton, CustomInput, IconCustom, NoteText
} from '@components/uiComponents';
import {
    IconFamily, ScreenName, Theme
} from '@constants/index';
import { ToastHelpers, ValidationHelpers } from '@helpers/index';
import { UserServices } from '@services/index';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const {
    FONT: {
        TEXT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;

export default function ForgotPassword({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [otp, setOtp] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');

    const [isShowPassword, setIsShowPassword] = useState('');
    const [isShowRePassword, setIsShowRePassword] = useState('');

    useEffect(
        () => {
            getLocalValue();
        }, []
    );

    const getLocalValue = async () => {
        const deviceIdLocalStore = await SecureStore.getItemAsync('deviceId');
        setDeviceId(deviceIdLocalStore);
    };

    const validate = () => {
        const validationArr = [
            {
                fieldName: 'OTP',
                input: otp,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 4,
                    },
                    minLength: {
                        value: 4,
                    },
                }
            },
            {
                fieldName: 'Mật khẩu mới',
                input: password,
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
            },
            {
                fieldName: 'Nhập lại mật khẩu mới',
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
            }
        ];

        if (!ValidationHelpers.validate(validationArr)) return false;

        if (!isPasswordMatch()) return false;

        return true;
    };

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const onSubmitForgotPassword = async () => {
        if (!validate()) return;

        setIsShowSpinner(true);
        const body = {
            phoneNum: phoneNumber,
            password,
            deviceId,
            code: otp
        };

        setIsShowSpinner(true);
        const result = await UserServices.submitForgotPasswordAsync(body);
        const { data } = result;

        if (data) {
            navigation.navigate(ScreenName.SIGN_IN);
            ToastHelpers.renderToast(data.message, 'success');
        }
        setIsShowSpinner(false);
    };

    const isPasswordMatch = () => {
        if (rePassword !== password) {
            ToastHelpers.renderToast('Mật khẩu không khớp, bạn vui lòng kiểm tra lại.', 'error');
            return false;
        }
        return true;
    };

    const onClickGetOTPWhenForgotPassword = async () => {
        setIsShowSpinner(true);
        const result = await UserServices.submitGetOtpForgotPasswordAsync({
            phoneNum: phoneNumber
        });

        const { data } = result;

        if (data) {
            // for testing
            setOtp(data.message);
        }
        setIsShowSpinner(false);
    };

    const renderFormNewPassword = () => (
        <>
            <View style={styles.formContainer}>
                <View
                    style={{
                        marginBottom: 10,
                        alignItems: 'center'
                    }}
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
                        keyboardType="number-pad"
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        secureTextEntry={!isShowPassword}
                        placeholder="Nhập mật khẩu mới..."
                        rightIcon={{
                            name: 'eye',
                            family: IconFamily.ENTYPO,
                            size: 20,
                            color: COLORS.DEFAULT
                        }}
                        onPressRightIcon={() => setIsShowPassword(!isShowPassword)}
                    />

                    <CustomInput
                        value={rePassword}
                        inputStyle={{
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        onChangeText={
                            (rePasswordInput) => setRePassword(rePasswordInput)
                        }
                        keyboardType="number-pad"
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        secureTextEntry={!isShowRePassword}
                        placeholder="Nhập lại mật khẩu mới..."
                        rightIcon={{
                            name: 'eye',
                            family: IconFamily.ENTYPO,
                            size: 20,
                            color: COLORS.DEFAULT
                        }}
                        onPressRightIcon={() => setIsShowRePassword(!isShowRePassword)}
                    />

                </View>
            </View>

            <View>
                <CustomButton
                    onPress={() => onSubmitForgotPassword()}
                    buttonStyle={styles.button}
                    type="active"
                    label="Xác nhận"
                />
            </View>
        </>
    );

    const renderFormOtp = () => (
        <>
            <View style={styles.formContainer}>
                <View
                    style={{
                        marginBottom: 10,
                        alignItems: 'center'
                    }}
                >
                    <CustomInput
                        placeholder="Nhập số điện thoại..."
                        value={phoneNumber}
                        onChangeText={
                            (phoneNumberInput) => setPhoneNumber(phoneNumberInput)
                        }
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                    />
                </View>
            </View>

            <View>
                <CustomButton
                    onPress={() => onClickGetOTPWhenForgotPassword()}
                    buttonStyle={styles.button}
                    type="active"
                    label="Nhận mã xác thực"
                />
            </View>
        </>
    );

    return (
        <View
            style={{
                alignSelf: 'center',
                alignItems: 'center',
                flex: 1
            }}
        >

            {isShowSpinner ? (
                <CenterLoader />
            ) : (
                <KeyboardAwareScrollView>
                    <View
                        style={{
                            alignSelf: 'center',
                            alignItems: 'center',
                            flex: 1
                        }}
                    >
                        <View style={styles.registerContainer}>
                            <View
                                style={{
                                    height: SIZES.HEIGHT_BASE * 0.3,
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        marginTop: SIZES.HEIGHT_BASE * 0.1
                                    }}
                                >
                                    <NoteText
                                        width={SIZES.WIDTH_BASE * 0.9}
                                        title="Bạn đang yêu cầu lấy lại mật khẩu:"
                                        content="Bạn vui lòng nhập số điện thoại đã đăng kí để nhận mã xác thực."
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
                                    />
                                </View>
                            </View>

                            {otp === '' ? (
                                <>
                                    {renderFormOtp()}
                                </>
                            ) : (
                                <>
                                    {renderFormNewPassword()}
                                </>
                            )}
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    registerContainer: {
        width: SIZES.WIDTH_BASE,
        height: SIZES.HEIGHT_BASE,
        backgroundColor: COLORS.BLOCK,
        borderRadius: 4,
    },
    formContainer: {
        height: SIZES.HEIGHT_BASE * 0.3
    },
    button: {
        width: SIZES.WIDTH_BASE * 0.9,
        marginVertical: 10
    },
    input: {
        borderRadius: 5,
        width: SIZES.WIDTH_BASE * 0.9
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
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
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontFamily: TEXT_REGULAR
    }
});
