import { ExpoNotification } from '@components/businessComponents';
import {
    CenterLoader, CustomButton, CustomInput, IconCustom, NoteText
} from '@components/uiComponents';
import {
    IconFamily,
    Images, NowTheme, ScreenName
} from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import { UserServices } from '@services/index';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground,
    StyleSheet,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const {
    FONT: {
        MONTSERRAT_REGULAR,
    },
    SIZES,
    COLORS
} = NowTheme;

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

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const onSubmitForgotPassword = async () => {
        if (!isPasswordMatch()) return;

        setIsShowSpinner(true);
        const body = {
            phoneNum: phoneNumber,
            password,
            deviceId,
            code: otp
        };

        toggleSpinner(true);
        const result = await UserServices.submitForgotPasswordAsync(body);
        const { data } = result;

        if (data) {
            navigation.navigate(ScreenName.SIGN_IN);
            ToastHelpers.renderToast(data.message, 'success');
        }
        toggleSpinner(false);
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
            ToastHelpers.renderToast(data.message, 'success');

            // for testing
            setOtp(data.data.code);
        }
        setIsShowSpinner(false);
    };

    const toggleSpinner = (isShowSpinnerToggled) => {
        setIsShowSpinner(isShowSpinnerToggled);
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
                            width: SIZES.WIDTH_BASE * 0.77
                        }}
                        onChangeText={
                            (rePasswordInput) => setRePassword(rePasswordInput)
                        }
                        keyboardType="number-pad"
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.77
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
                            width: SIZES.WIDTH_BASE * 0.77
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
            <CenterLoader isShow={isShowSpinner} />
            <ExpoNotification navigation={navigation} />
            <ImageBackground
                source={Images.RegisterBackground}
                style={styles.imageBackgroundContainer}
                imageStyle={styles.imageBackground}
            >
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
                                        width={SIZES.WIDTH_BASE * 0.77}
                                        title="Bạn đang yêu cầu lấy lại mật khẩu:"
                                        content="Bạn vui lòng nhập số điện thoại đã đăng kí để nhận mã xác thực."
                                        contentStyle={{
                                            fontSize: SIZES.FONT_H4,
                                            color: COLORS.ACTIVE,
                                            fontFamily: MONTSERRAT_REGULAR,
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
    formContainer: {
        height: SIZES.HEIGHT_BASE * 0.3
    },
    button: {
        width: SIZES.WIDTH_BASE * 0.77,
        marginVertical: 10
    },
    input: {
        borderRadius: 5,
        width: SIZES.WIDTH_BASE * 0.77
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
        fontFamily: MONTSERRAT_REGULAR
    }
});
