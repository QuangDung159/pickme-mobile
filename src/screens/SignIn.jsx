import * as SecureStore from 'expo-secure-store';
import {
    Block, Button, Text
} from 'galio-framework';
import React, { useState } from 'react';
import {
    ImageBackground,
    StyleSheet
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { ExpoNotification } from '../components/bussinessComponents';
import { CenterLoader, Input } from '../components/uiComponents';
import {
    Images, NowTheme, Rx, ScreenName
} from '../constants';
import { ToastHelpers } from '../helpers';
import {
    setIsSignInOtherDeviceStore,
    setToken
} from '../redux/Actions';
import { rxUtil } from '../utils';

export default function SignIn({ navigation }) {
    const [phoneNumber, setPhoneNumber] = useState('dunglq');
    const [password, setPassword] = useState('');
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [deviceIdToSend, setDeviceIdToSend] = useState('');

    const expoToken = useSelector((state) => state.appConfigReducer.expoToken);
    const deviceIdStore = useSelector((state) => state.appConfigReducer.deviceIdStore);

    const dispatch = useDispatch();

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

    const onSubmitLogin = () => {
        if (validation()) {
            const data = {
                username: phoneNumber,
                password,
                deviceId: deviceIdToSend || deviceIdStore
            };

            setIsShowSpinner(true);
            rxUtil(
                Rx.AUTHENTICATION.LOGIN,
                'POST',
                data,
                {},
                (res) => {
                    onLoginSucess(res);
                },
                () => {
                    setIsShowSpinner(false);
                    Toast.show({
                        type: 'error',
                        text1: 'Lỗi hệ thống! Vui lòng thử lại.'
                    });
                },
                () => {
                    setIsShowSpinner(false);
                    Toast.show({
                        type: 'error',
                        text1: 'Lỗi hệ thống! Vui lòng thử lại.'
                    });
                }
            );
        }
    };

    const validation = () => {
        if (!phoneNumber) {
            ToastHelpers.renderToast('Tên đăng nhập không hợp lệ!', 'error');
            return false;
        }

        if (!password) {
            ToastHelpers.renderToast('Mật khẩu không hợp lệ!', 'error');
            return false;
        }

        return true;
    };

    const onLoginSucess = (res) => {
        const tokenFromAPI = res.data.data;
        const { status } = res;

        SecureStore.setItemAsync('api_token', `${tokenFromAPI}`)
            .then(console.log('tokenFromAPI :>> ', tokenFromAPI));

        SecureStore.setItemAsync('password', `${password}`)
            .then(console.log('password :>> ', password));

        SecureStore.setItemAsync('phoneNumber', `${phoneNumber}`)
            .then(console.log('phoneNumber :>> ', phoneNumber));

        if (status === 200) {
            const bearerToken = `Bearer ${tokenFromAPI}`;
            dispatch(setToken(tokenFromAPI));

            navigation.reset({
                index: 0,
                routes: [{ name: ScreenName.APP }],
            });

            updateExpoTokenToServer(bearerToken);
            dispatch(setIsSignInOtherDeviceStore(false));
        }

        if (status === 201) {
            // re otp
            navigation.reset({
                index: 0,
                routes: [{ name: ScreenName.SIGN_IN_WITH_OTP }],
            });
        }

        isShowSpinner(false);
    };

    const renderButtonForgotPassword = () => (
        <TouchableWithoutFeedback
            onPress={() => {
                navigation.navigate(ScreenName.FORGOT_PASSWORD);
            }}
            containerStyle={{
                width: NowTheme.SIZES.WIDTH_BASE * 0.77,
                alignSelf: 'center'
            }}
        >
            <Block
                row
                style={{
                    alignItems: 'center'
                }}
            >
                <Text
                    color={NowTheme.COLORS.SWITCH_OFF}
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                    }}
                    size={NowTheme.SIZES.FONT_H4}
                >
                    Bạn quên mật khẩu?
                </Text>
            </Block>
        </TouchableWithoutFeedback>
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
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                                        textAlign: 'center'
                                    }}
                                    color="#333"
                                    size={24}
                                    height={100}
                                >
                                    Đăng nhập
                                </Text>
                            </Block>

                            {isShowSpinner ? (
                                <CenterLoader />
                            ) : (
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
                                                    width: NowTheme.SIZES.WIDTH_BASE * 0.77,
                                                }}
                                                placeholder="Nhập số điện thoại..."
                                                value={phoneNumber}
                                                onChangeText={
                                                    (phoneNumberInput) => setPhoneNumber(phoneNumberInput)
                                                }
                                            />

                                            <Input
                                                placeholder="Nhập mật khẩu..."
                                                style={{
                                                    borderRadius: 5,
                                                    width: NowTheme.SIZES.WIDTH_BASE * 0.77
                                                }}
                                                password
                                                viewPass
                                                keyboardType="number-pad"
                                                value={password}
                                                onChangeText={
                                                    (passwordInput) => setPassword(passwordInput)
                                                }
                                            />

                                            {/* for testing */}
                                            <Input
                                                placeholder="Empty or 'test'"
                                                style={{
                                                    borderRadius: 5,
                                                    width: NowTheme.SIZES.WIDTH_BASE * 0.77
                                                }}
                                                value={deviceIdToSend}
                                                onChangeText={
                                                    (deviceIdInput) => setDeviceIdToSend(deviceIdInput)
                                                }
                                            />

                                            {renderButtonForgotPassword()}
                                        </Block>
                                    </Block>

                                    <Block center>
                                        <Button
                                            onPress={() => onSubmitLogin()}
                                            style={[styles.button, {
                                                marginVertical: 10
                                            }]}
                                            shadowless
                                        >
                                            Đăng nhập
                                        </Button>
                                    </Block>
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
