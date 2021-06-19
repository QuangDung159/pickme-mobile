import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ExpoNotification } from '../../components/businessComponents';
import { CenterLoader, CustomButton, CustomInput } from '../../components/uiComponents';
import {
    IconFamily,
    Images, NowTheme, Rx, ScreenName
} from '../../constants';
import { ToastHelpers } from '../../helpers';
import {
    setIsSignInOtherDeviceStore,
    setToken
} from '../../redux/Actions';
import { UserServices } from '../../services';
import { rxUtil } from '../../utils';

const {
    FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = NowTheme;

export default function SignIn({ navigation }) {
    const [phoneNumber, setPhoneNumber] = useState('huyvd');
    const [password, setPassword] = useState('0000');
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [deviceIdToSend, setDeviceIdToSend] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);

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
            },
            () => {},
            (res) => ToastHelpers.renderToast(res.data.message, 'error'),
            (res) => ToastHelpers.renderToast(res.data.message, 'error')
        );
    };

    const onSubmitLogin = async () => {
        if (validation()) {
            const body = {
                username: phoneNumber,
                password,
                deviceId: deviceIdToSend || deviceIdStore
            };

            // setIsShowSpinner(true);
            setIsShowSpinner(true);
            const result = await UserServices.loginAsync(body);

            const {
                isSuccess, data, status
            } = result;

            if (isSuccess) {
                onLoginSuccess(data, status);
                setIsShowSpinner(false);
            } else {
                setIsShowSpinner(false);
            }
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

    const onLoginSuccess = (data, status) => {
        const tokenFromAPI = data.data;

        SecureStore.setItemAsync('api_token', `${tokenFromAPI}`);
        SecureStore.setItemAsync('password', `${password}`);
        SecureStore.setItemAsync('phoneNumber', `${phoneNumber}`);

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
    };

    const renderButtonForgotPassword = () => (
        <TouchableWithoutFeedback
            onPress={() => {
                navigation.navigate(ScreenName.FORGOT_PASSWORD);
            }}
            containerStyle={{
                width: SIZES.WIDTH_BASE * 0.77,
                alignSelf: 'center'
            }}
        >
            <View>
                <Text
                    style={{
                        fontFamily: MONTSERRAT_REGULAR,
                        color: COLORS.SWITCH_OFF,
                        fontSize: SIZES.FONT_H4
                    }}
                >
                    Bạn quên mật khẩu?
                </Text>
            </View>
        </TouchableWithoutFeedback>
    );

    return (
        <View>
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
                        }}
                    >
                        <View style={styles.registerContainer}>
                            <View
                                style={{
                                    height: SIZES.HEIGHT_BASE * 0.2
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: MONTSERRAT_BOLD,
                                        textAlign: 'center',
                                        color: '#333',
                                        fontSize: 24,
                                        height: 100,
                                        marginTop: SIZES.HEIGHT_BASE * 0.1
                                    }}
                                >
                                    Đăng nhập
                                </Text>
                            </View>

                            {isShowSpinner ? (
                                <CenterLoader />
                            ) : (
                                <>
                                    <View style={{
                                        height: SIZES.HEIGHT_BASE * 0.4
                                    }}
                                    >
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

                                            {/* for testing */}
                                            <CustomInput
                                                placeholder="Empty or 'test'"
                                                value={deviceIdToSend}
                                                onChangeText={
                                                    (deviceIdInput) => setDeviceIdToSend(deviceIdInput)
                                                }
                                                containerStyle={{
                                                    marginVertical: 10,
                                                    width: SIZES.WIDTH_BASE * 0.77
                                                }}
                                            />
                                            {renderButtonForgotPassword()}
                                        </View>
                                    </View>

                                    <View>
                                        <CustomButton
                                            onPress={() => onSubmitLogin()}
                                            type="active"
                                            label="Đăng nhập"
                                            buttonStyle={
                                                [
                                                    styles.button,
                                                    {
                                                        marginVertical: 10
                                                    }
                                                ]
                                            }
                                        />
                                    </View>
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
    button: {
        width: SIZES.WIDTH_BASE * 0.77
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
});
