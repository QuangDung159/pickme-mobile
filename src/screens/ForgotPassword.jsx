import {
    Block, Button
} from 'galio-framework';
import React, { useState } from 'react';
import {
    ImageBackground,
    StyleSheet
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { ExpoNotification } from '../components/bussinessComponents';
import {
    CenterLoader, IconCustom, Input, NoteText
} from '../components/uiComponents';
import {
    IconFamily,
    Images, NowTheme, Rx, ScreenName
} from '../constants';
import { ToastHelpers } from '../helpers';
import { rxUtil } from '../utils';

export default function ForgotPassword({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [otp, setOtp] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');

    const deviceIdStore = useSelector((state) => state.appConfigReducer.deviceIdStore);

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const onSubmitForgorPassword = () => {
        if (!isPasswordMatch()) return;

        setIsShowSpinner(true);
        const data = {
            phoneNum: phoneNumber,
            password,
            deviceId: deviceIdStore,
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
            () => {
                toggleSpinner(false);
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống! Vui lòng thử lại.'
                });
            },
            () => {
                toggleSpinner(false);
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống! Vui lòng thử lại.'
                });
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
            () => setIsShowSpinner(false),
            () => setIsShowSpinner(false)
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
                    <Input
                        style={styles.input}
                        keyboardType="number-pad"
                        value={otp}
                        placeholder="Nhập mã xác thực..."
                        onChangeText={(otpInput) => setOtp(otpInput)}
                    />

                    <Input
                        placeholder="Nhập mật khẩu mới..."
                        style={styles.input}
                        keyboardType="number-pad"
                        password
                        viewPass
                        value={password}
                        onChangeText={
                            (passwordInput) => setPassword(passwordInput)
                        }
                    />

                    <Input
                        placeholder="Nhập lại mật khẩu mới..."
                        style={styles.input}
                        password
                        viewPass
                        keyboardType="number-pad"
                        value={rePassword}
                        onChangeText={
                            (rePasswordInput) => setRePassword(rePasswordInput)
                        }
                    />

                </Block>
            </Block>

            <Block center>
                <Button
                    onPress={() => onSubmitForgorPassword()}
                    style={styles.button}
                    shadowless
                >
                    Xác nhận
                </Button>
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
                    <Input
                        style={styles.input}
                        placeholder="Nhập số điện thoại..."
                        value={phoneNumber}
                        onChangeText={
                            (phoneNumberInput) => setPhoneNumber(phoneNumberInput)
                        }
                    />
                </Block>
            </Block>

            <Block center>
                <Button
                    onPress={() => onClickGetOTPWhenForgotPassword()}
                    style={styles.button}
                    shadowless
                >
                    Nhận mã xác thực
                </Button>
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
    },
    input: {
        borderRadius: 5,
        width: NowTheme.SIZES.WIDTH_BASE * 0.77
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
        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
    }
});
