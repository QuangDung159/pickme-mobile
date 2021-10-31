import { CenterLoader, CustomButton, CustomInput } from '@components/uiComponents';
import {
    IconFamily, ScreenName, Theme
} from '@constants/index';
import { ValidationHelpers } from '@helpers/index';
import {
    setCurrentUser,
    setExpoToken,
    setIsSignInOtherDeviceStore
} from '@redux/Actions';
import { SystemServices, UserServices } from '@services/index';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
    Alert, Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function SignIn({ navigation }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [deviceIdToSend, setDeviceIdToSend] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);

    // const expoToken = useSelector((state) => state.appConfigReducer.expoToken);

    const dispatch = useDispatch();

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    useEffect(
        () => {
            getLoginInfo();
        }, []
    );

    const updateExpoTokenToServer = async (expoTokenFromServer) => {
        await SystemServices.submitUpdateExpoTokenAsync({
            token: expoTokenFromServer
        });
    };

    const getLoginInfo = async () => {
        const phoneNumberLocal = await SecureStore.getItemAsync('username');
        setPhoneNumber(phoneNumberLocal);

        const passwordLocal = await SecureStore.getItemAsync('password');
        setPassword(passwordLocal);
    };

    const registerForPushNotificationsAsync = async () => {
        let expoTokenFromServer;
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert('Failed to get push token for push notification!');
                return;
            }

            expoTokenFromServer = (await Notifications.getExpoPushTokenAsync()).data;
            dispatch(setExpoToken(expoTokenFromServer));
            updateExpoTokenToServer(expoTokenFromServer);

            console.log('expoTokenFromServer :>>', expoTokenFromServer);
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    };

    const onSubmitLogin = async () => {
        const deviceId = await SecureStore.getItemAsync('deviceId');
        if (validate()) {
            const body = {
                username: phoneNumber,
                password,
                deviceId: deviceIdToSend || deviceId
            };

            setIsShowSpinner(true);
            const result = await UserServices.loginAsync(body);

            const {
                data, status
            } = result;

            if (data) {
                onLoginSuccess(data, status);
            } else {
                setIsShowSpinner(false);
            }
        }
    };

    const validate = () => {
        const validationArr = [
            {
                fieldName: 'Số điện thoại',
                input: phoneNumber,
                validate: {
                    required: {
                        value: true,
                    },
                }
            },
            {
                fieldName: 'Mật khẩu',
                input: password,
                validate: {
                    required: {
                        value: true,
                    },
                }
            },
        ];

        return ValidationHelpers.validate(validationArr);
    };

    const onLoginSuccess = async (data, status) => {
        SecureStore.setItemAsync('password', `${password}`);
        SecureStore.setItemAsync('username', `${phoneNumber}`);

        const currentUserInfo = await UserServices.mappingCurrentUserInfo(data.data);
        SecureStore.setItemAsync('api_token', `${currentUserInfo.token}`);
        dispatch(setCurrentUser(currentUserInfo));

        if (status === 200) {
            navigation.reset({
                index: 0,
                routes: [{ name: ScreenName.APP }],
            });

            registerForPushNotificationsAsync();
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
                width: SIZES.WIDTH_BASE * 0.9,
                alignSelf: 'center'
            }}
        >
            <View>
                <Text
                    style={{
                        fontFamily: TEXT_REGULAR,
                        color: COLORS.DEFAULT,
                        fontSize: SIZES.FONT_H4
                    }}
                >
                    Bạn quên mật khẩu?
                </Text>
            </View>
        </TouchableWithoutFeedback>
    );

    return (
        <View
            style={styles.container}
        >
            {isShowSpinner ? (
                <CenterLoader />
            ) : (
                <KeyboardAwareScrollView>
                    <View>
                        <View
                            style={{
                                height: SIZES.HEIGHT_BASE * 0.2
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: TEXT_BOLD,
                                    textAlign: 'center',
                                    color: COLORS.DEFAULT,
                                    fontSize: 24,
                                    height: 100,
                                    marginTop: SIZES.HEIGHT_BASE * 0.1
                                }}
                            >
                                Đăng nhập
                            </Text>
                        </View>

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
                                            width: SIZES.WIDTH_BASE * 0.9
                                        }}
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

                                    {/* for testing */}
                                    <CustomInput
                                        placeholder="Empty or 'test'"
                                        value={deviceIdToSend}
                                        onChangeText={
                                            (deviceIdInput) => {
                                                setDeviceIdToSend(deviceIdInput);
                                            }
                                        }
                                        containerStyle={{
                                            marginVertical: 10,
                                            width: SIZES.WIDTH_BASE * 0.9
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
                    </View>
                </KeyboardAwareScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: SIZES.WIDTH_BASE,
        height: SIZES.HEIGHT_BASE,
        backgroundColor: COLORS.BASE
    },
    button: {
        width: SIZES.WIDTH_BASE * 0.9
    },
});
