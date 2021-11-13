import { CustomButton, CustomInput } from '@components/uiComponents';
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
    Alert, Platform, View
} from 'react-native';
import { useDispatch } from 'react-redux';

const {
    COLORS,
    SIZES
} = Theme;

export default function SignIn({ navigation, setIsShowSpinner, isRegisterPartner }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
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

        if (isRegisterPartner) {
            Alert.alert('Bạn vừa chọn đăng ký trở thành host', 'Bạn có muốn tiếp tục?', [
                {
                    text: 'Huỷ',
                    style: 'cancel',
                    onPress: () => handleNavigation(status)
                },
                {
                    text: 'Tiếp tục',
                    onPress: () => navigation.navigate(ScreenName.PARTNER_REGISTER, {
                        from: ScreenName.ONBOARDING
                    })
                },
            ],
            { cancelable: false });
        } else {
            handleNavigation(status);
        }
    };

    const handleNavigation = (status) => {
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

    return (
        <View
            style={{
                alignSelf: 'center',
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
                    }}
                />

                <CustomInput
                    value={password}
                    onChangeText={(passwordInput) => setPassword(passwordInput)}
                    containerStyle={{
                        marginVertical: 10,
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
                    }}
                />
            </View>

            <CustomButton
                buttonStyle={{
                    width: SIZES.WIDTH_BASE * 0.9
                }}
                type="active"
                onPress={() => onSubmitLogin()}
                label="Đăng nhập"
            />
        </View>
    );
}
