import { CenterLoader, CustomButton, CustomInput } from '@components/uiComponents';
import {
    IconFamily,
    Images, ScreenName, Theme
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
import React, { useState } from 'react';
import {
    Alert,
    ImageBackground,
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';

const {
    FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function SignIn({ navigation }) {
    const [phoneNumber, setPhoneNumber] = useState('dongvu');
    const [password, setPassword] = useState('0000');
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [deviceIdToSend, setDeviceIdToSend] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);

    // const expoToken = useSelector((state) => state.appConfigReducer.expoToken);

    const dispatch = useDispatch();

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const updateExpoTokenToServer = async (expoTokenFromServer) => {
        await SystemServices.submitUpdateExpoTokenAsync({
            token: expoTokenFromServer
        });
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
            console.log('expoTokenFromServer :>> ', expoTokenFromServer);
            dispatch(setExpoToken(expoTokenFromServer));
            console.log(expoTokenFromServer);
            updateExpoTokenToServer(expoTokenFromServer);
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
        SecureStore.setItemAsync('phoneNumber', `${phoneNumber}`);

        const currentUserInfo = await UserServices.mappingCurrentUserInfo(data.data);
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
                width: SIZES.WIDTH_BASE * 0.77,
                alignSelf: 'center'
            }}
        >
            <View>
                <Text
                    style={{
                        fontFamily: MONTSERRAT_REGULAR,
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
        <View>
            <ImageBackground
                source={Images.RegisterBackground}
                style={styles.imageBackgroundContainer}
                imageStyle={styles.imageBackground}
            >
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
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
                                                    width: SIZES.WIDTH_BASE * 0.77
                                                }}
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
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                )}

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
