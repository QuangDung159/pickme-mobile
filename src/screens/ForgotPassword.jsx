import * as SecureStore from 'expo-secure-store';
import {
    Block, Button
} from 'galio-framework';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground,
    StyleSheet
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { ExpoNotification } from '../components/bussinessComponents';
import {
    CenterLoader, IconCustom, Input, NoteText
} from '../components/uiComponents';
import {
    IconFamily,
    Images, NowTheme, Rx, ScreenName
} from '../constants';
import { ToastHelpers } from '../helpers';
import {
    setIsSignInOtherDeviceStore,
    setToken
} from '../redux/Actions';
import { rxUtil } from '../utils';

export default function ForgotPassword({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [otp, setOtp] = useState('');
    const [deviceId, setDeviceId] = useState('');
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
        const deviceIdLocalStore = await SecureStore.getItemAsync('deviceId');
        const phoneNumberLocalStore = await SecureStore.getItemAsync('phoneNumber');
        const passwordLocalStore = await SecureStore.getItemAsync('password');

        setPassword(passwordLocalStore);
        setPhoneNumber(phoneNumberLocalStore);
        setDeviceId(deviceIdLocalStore);
    };

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const updateExpoTokenToServer = (bearerToken) => {
        rxUtil(
            Rx.USER.UPDATE_EXPO_TOKEN,
            'POST',
            {
                token: expoToken
            },
            {
                Authorization: bearerToken,
            }
        );
    };

    const onLogin = async () => {
        const data = {
            username: phoneNumber,
            password,
            deviceId
        };

        toggleSpinner(true);
        rxUtil(
            Rx.AUTHENTICATION.LOGIN,
            'POST',
            data,
            {},
            (res) => {
                onLoginSucess(res.data.data);
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

    const onSubmitOTP = async () => {
        setIsShowSpinner(true);

        const data = {
            phoneNum: phoneNumber,
            password,
            deviceId,
            code: otp
        };

        toggleSpinner(true);
        rxUtil(
            Rx.USER.SUBMIT_CHANGE_DEVICE_CONFIRM,
            'POST',
            data,
            null,
            () => {
                onLogin();
                // ToastHelpers.renderToast(res.res.data.message);
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
        return true;
    };

    const onClickGetOTPWhenChangeDevice = async () => {
        rxUtil(
            Rx.USER.GENERATE_OTP_WHEN_CHANGE_DEVICE,
            'POST',
            {
                phoneNum: phoneNumber
            },
            null,
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'success');

                // for testing
                setOtp(res.data.data.code);
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            }
        );
        return true;
    };

    const onLoginSucess = (tokenFromAPI) => {
        const bearerToken = `Bearer ${tokenFromAPI}`;
        dispatch(setToken(tokenFromAPI));

        navigation.reset({
            index: 0,
            routes: [{ name: ScreenName.APP }],
        });

        updateExpoTokenToServer(bearerToken);
        SecureStore.setItemAsync('api_token', `${tokenFromAPI}`)
            .then(console.log('tokenFromAPI :>> ', tokenFromAPI));

        dispatch(setIsSignInOtherDeviceStore(false));
    };

    const toggleSpinner = (isShowSpinnerToggled) => {
        setIsShowSpinner(isShowSpinnerToggled);
    };

    const renderFormNewPassword = () => (
        <>
            <Block style={{
                height: NowTheme.SIZES.HEIGHT_BASE * 0.3
            }}
            >
                <Block
                    style={{
                        marginBottom: 10,
                        alignItems: 'center'
                    }}
                >
                    <Input
                        style={{
                            borderRadius: 5,
                            width: NowTheme.SIZES.WIDTH_BASE * 0.77
                        }}
                        keyboardType="number-pad"
                        value={otp}
                        placeholder="Nhập mã xác thực..."
                        onChangeText={(otpInput) => setOtp(otpInput)}
                    />

                    <Input
                        placeholder="Nhập mật khẩu mới..."
                        style={{
                            borderRadius: 5,
                            width: NowTheme.SIZES.WIDTH_BASE * 0.77
                        }}
                        password
                        viewPass
                        value={password}
                        onChangeText={
                            (passwordInput) => setPassword(passwordInput)
                        }
                    />

                    <Input
                        placeholder="Nhập lại mật khẩu mới..."
                        style={{
                            borderRadius: 5,
                            width: NowTheme.SIZES.WIDTH_BASE * 0.77
                        }}
                        password
                        viewPass
                        value={password}
                        onChangeText={
                            (passwordInput) => setPassword(passwordInput)
                        }
                    />

                </Block>
            </Block>

            <Block center>
                <Button
                    onPress={() => onSubmitOTP()}
                    style={[styles.button, {
                        marginVertical: 10
                    }]}
                    shadowless
                >
                    Xác nhận
                </Button>
            </Block>
        </>
    );

    const renderFormOtp = () => (
        <>
            <Block style={{
                height: NowTheme.SIZES.HEIGHT_BASE * 0.3
            }}
            >
                <Block
                    style={{
                        marginBottom: 10,
                        alignItems: 'center'
                    }}
                >
                    {otp === '' ? (
                        <Input
                            style={{
                                borderRadius: 5,
                                width: NowTheme.SIZES.WIDTH_BASE * 0.77,
                            }}
                            placeholder="Nhập số điện thoại..."
                            value={phoneNumber}
                            onChangeText={
                                (phoneNumberInput) => setPhoneNumber(phoneNumberInput)
                            }
                        />
                    ) : (
                        <Input
                            style={{
                                borderRadius: 5,
                                width: NowTheme.SIZES.WIDTH_BASE * 0.77
                            }}
                            keyboardType="number-pad"
                            value={otp}
                            placeholder="Nhập mã xác thực..."
                            onChangeText={(otpInput) => setOtp(otpInput)}
                        />
                    )}

                </Block>
            </Block>

            <Block center>
                <Button
                    onPress={() => onClickGetOTPWhenChangeDevice()}
                    style={[styles.button, {
                        marginVertical: 10
                    }]}
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
                                    height: NowTheme.SIZES.HEIGHT_BASE * 0.3,
                                    marginBottom: 10
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
    button: {
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
