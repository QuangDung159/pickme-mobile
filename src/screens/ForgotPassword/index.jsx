import * as SecureStore from 'expo-secure-store';
import {
    Block
} from 'galio-framework';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground,
    StyleSheet
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ExpoNotification } from '../../components/businessComponents';
import {
    CenterLoader, CustomButton, CustomInput, IconCustom, NoteText
} from '../../components/uiComponents';
import {
    IconFamily,
    Images, NowTheme, Rx, ScreenName
} from '../../constants';
import { ToastHelpers } from '../../helpers';
import { rxUtil } from '../../utils';

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
    const onSubmitForgotPassword = () => {
        if (!isPasswordMatch()) return;

        setIsShowSpinner(true);
        const data = {
            phoneNum: phoneNumber,
            password,
            deviceId,
            code: otp
        };

        toggleSpinner(true);
        rxUtil(
            Rx.USER.SUBMIT_FORGOT_PASSWORD_CONFIRM,
            'POST',
            data,
            null,
            (res) => {
                navigation.navigate(ScreenName.SIGN_IN);
                ToastHelpers.renderToast(res.data.message, 'success');
            },
            (res) => {
                toggleSpinner(false);
                ToastHelpers.renderToast(res.data.message, 'error');
            },
            (res) => {
                toggleSpinner(false);
                ToastHelpers.renderToast(res.data.message, 'error');
            }
        );
    };

    const isPasswordMatch = () => {
        if (rePassword !== password) {
            ToastHelpers.renderToast('Mật khẩu không khớp, bạn vui lòng kiểm tra lại.', 'error');
            return false;
        }
        return true;
    };

    const onClickGetOTPWhenForgotPassword = () => {
        setIsShowSpinner(true);
        rxUtil(
            Rx.USER.GENERATE_OTP_WHEN_FORGOT_PASSWORD,
            'POST',
            {
                phoneNum: phoneNumber
            },
            null,
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'success');
                setIsShowSpinner(false);
                // for testing
                setOtp(res.data.data.code);
            },
            (res) => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast(res.data.message, 'error');
            },
            (res) => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast(res.data.message, 'error');
            }
        );
    };

    const toggleSpinner = (isShowSpinnerToggled) => {
        setIsShowSpinner(isShowSpinnerToggled);
    };

    const renderFormNewPassword = () => (
        <>
            <Block style={styles.formContainer}>
                <Block
                    style={{
                        marginBottom: 10,
                        alignItems: 'center'
                    }}
                >
                    <CustomInput
                        value={otp}
                        inputStyle={{
                            width: NowTheme.SIZES.WIDTH_BASE * 0.77
                        }}
                        onChangeText={(otpInput) => setOtp(otpInput)}
                        keyboardType="number-pad"
                        containerStyle={{
                            marginVertical: 10,
                            width: NowTheme.SIZES.WIDTH_BASE * 0.77
                        }}
                        placeholder="Nhập mã xác thực..."
                    />

                    <CustomInput
                        value={password}
                        inputStyle={{
                            width: NowTheme.SIZES.WIDTH_BASE * 0.77
                        }}
                        onChangeText={(passwordInput) => setPassword(passwordInput)}
                        keyboardType="number-pad"
                        containerStyle={{
                            marginVertical: 10,
                            width: NowTheme.SIZES.WIDTH_BASE * 0.77
                        }}
                        secureTextEntry={!isShowPassword}
                        placeholder="Nhập mật khẩu mới..."
                        rightIcon={{
                            name: 'eye',
                            family: IconFamily.ENTYPO,
                            size: 20,
                            color: NowTheme.COLORS.DEFAULT
                        }}
                        onPressRightIcon={() => setIsShowPassword(!isShowPassword)}
                    />

                    <CustomInput
                        value={rePassword}
                        inputStyle={{
                            width: NowTheme.SIZES.WIDTH_BASE * 0.77
                        }}
                        onChangeText={
                            (rePasswordInput) => setRePassword(rePasswordInput)
                        }
                        keyboardType="number-pad"
                        containerStyle={{
                            marginVertical: 10,
                            width: NowTheme.SIZES.WIDTH_BASE * 0.77
                        }}
                        secureTextEntry={!isShowRePassword}
                        placeholder="Nhập lại mật khẩu mới..."
                        rightIcon={{
                            name: 'eye',
                            family: IconFamily.ENTYPO,
                            size: 20,
                            color: NowTheme.COLORS.DEFAULT
                        }}
                        onPressRightIcon={() => setIsShowRePassword(!isShowRePassword)}
                    />

                </Block>
            </Block>

            <Block center>
                <CustomButton
                    onPress={() => onSubmitForgotPassword()}
                    buttonStyle={styles.button}
                    type="active"
                    label="Xác nhận"
                />
            </Block>
        </>
    );

    const renderFormOtp = () => (
        <>
            <Block style={styles.formContainer}>
                <Block
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
                            width: NowTheme.SIZES.WIDTH_BASE * 0.77
                        }}
                    />
                </Block>
            </Block>

            <Block center>
                <CustomButton
                    onPress={() => onClickGetOTPWhenForgotPassword()}
                    buttonStyle={styles.button}
                    type="active"
                    label="Nhận mã xác thực"
                />
            </Block>
        </>
    );

    return (
        <Block flex middle>
            <ExpoNotification navigation={navigation} />
            <ImageBackground
                source={Images.RegisterBackground}
                style={styles.imageBackgroundContainer}
                imageStyle={styles.imageBackground}
            >
                <KeyboardAwareScrollView>
                    <Block flex middle>
                        <Block style={styles.registerContainer}>
                            <Block
                                middle
                                style={{
                                    height: NowTheme.SIZES.HEIGHT_BASE * 0.3
                                }}
                            >
                                <Block>
                                    <NoteText
                                        width={NowTheme.SIZES.WIDTH_BASE * 0.77}
                                        title="Bạn đang yêu cầu lấy lại mật khẩu:"
                                        content="Bạn vui lòng nhập số điện thoại đã đăng kí để nhận mã xác thực."
                                        contentStyle={{
                                            fontSize: NowTheme.SIZES.FONT_H4,
                                            color: NowTheme.COLORS.ACTIVE,
                                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                            marginTop: 5
                                        }}
                                        iconComponent={(
                                            <IconCustom
                                                name="info-circle"
                                                family={IconFamily.FONT_AWESOME}
                                                size={18}
                                                color={NowTheme.COLORS.ACTIVE}
                                            />
                                        )}
                                        backgroundColor={NowTheme.COLORS.LIST_ITEM_BACKGROUND_1}
                                    />
                                </Block>
                            </Block>

                            {isShowSpinner ? (
                                <CenterLoader />
                            ) : (
                                <>
                                    {otp === '' ? (
                                        <>
                                            {renderFormOtp()}
                                        </>
                                    ) : (
                                        <>
                                            {renderFormNewPassword()}
                                        </>
                                    )}
                                </>
                            )}
                        </Block>
                    </Block>
                </KeyboardAwareScrollView>
            </ImageBackground>
        </Block>
    );
}

const styles = StyleSheet.create({
    imageBackgroundContainer: {
        width: NowTheme.SIZES.WIDTH_BASE,
        height: NowTheme.SIZES.HEIGHT_BASE,
        padding: 0,
        zIndex: 1
    },
    imageBackground: {
        width: NowTheme.SIZES.WIDTH_BASE,
        height: NowTheme.SIZES.HEIGHT_BASE
    },
    registerContainer: {
        marginTop: 55,
        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
        height: NowTheme.SIZES.HEIGHT_BASE < 812 ? NowTheme.SIZES.HEIGHT_BASE * 0.8 : NowTheme.SIZES.HEIGHT_BASE * 0.8,
        backgroundColor: NowTheme.COLORS.BASE,
        borderRadius: 4,
        shadowColor: NowTheme.COLORS.BLACK,
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
        height: NowTheme.SIZES.HEIGHT_BASE * 0.3
    },
    button: {
        width: NowTheme.SIZES.WIDTH_BASE * 0.77,
        marginVertical: 10
    }
});
