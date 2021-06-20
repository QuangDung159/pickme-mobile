import { ExpoNotification } from '@components/businessComponents';
import {
    CenterLoader, CustomButton, CustomInput, IconCustom, NoteText
} from '@components/uiComponents';
import {
    IconFamily,
    Images, NowTheme, Rx, ScreenName
} from '@constants';
import { ToastHelpers } from '@helpers';
import {
    setIsSignInOtherDeviceStore,
    setToken
} from '@redux/Actions';
import { UserServices } from '@services';
import { rxUtil } from '@utils';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground,
    StyleSheet,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';

const {
    FONT: {
        MONTSERRAT_REGULAR,
    },
    SIZES,
    COLORS
} = NowTheme;

export default function SignInWithOTP({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [otp, setOtp] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');

    const expoToken = useSelector((state) => state.appConfigReducer.expoToken);
    const deviceIdStore = useSelector((state) => state.appConfigReducer.deviceIdStore);

    const dispatch = useDispatch();

    useEffect(
        () => {
            getLocalValue();
        }, []
    );

    const getLocalValue = async () => {
        const phoneNumberLocalStore = await SecureStore.getItemAsync('phoneNumber');
        const passwordLocalStore = await SecureStore.getItemAsync('password');

        setPassword(passwordLocalStore);
        setPhoneNumber(phoneNumberLocalStore);
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
            },
            () => {},
            (res) => ToastHelpers.renderToast(res.data.message, 'error'),
            (res) => ToastHelpers.renderToast(res.data.message, 'error')
        );
    };

    const onLogin = async () => {
        const body = {
            username: phoneNumber,
            password,
            deviceId: deviceIdStore
        };

        setIsShowSpinner(true);
        const result = await UserServices.loginAsync(body);
        const {
            isSuccess, data
        } = result;

        if (isSuccess) {
            onLoginSuccess(data);
        } else {
            setIsShowSpinner(false);
        }
    };

    const onSubmitOTP = async () => {
        setIsShowSpinner(true);
        const data = {
            phoneNum: phoneNumber,
            password,
            deviceId: deviceIdStore,
            code: otp
        };

        if (!deviceIdStore) {
            const deviceIdLocal = await SecureStore.getItemAsync('deviceId');
            data.deviceId = deviceIdLocal;
        }

        rxUtil(
            Rx.USER.SUBMIT_CHANGE_DEVICE_CONFIRM,
            'POST',
            data,
            null,
            () => {
                onLogin();
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
            }
        );
        return true;
    };

    const onClickGetOTPWhenChangeDevice = () => {
        setIsShowSpinner(true);
        rxUtil(
            Rx.USER.GENERATE_OTP_WHEN_CHANGE_DEVICE,
            'POST',
            {
                phoneNum: phoneNumber
            },
            null,
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'success');

                // in testing, will remove when prod
                setOtp(res.data.data.code);
                setIsShowSpinner(false);
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

    const onLoginSuccess = (tokenFromAPI) => {
        const bearerToken = `Bearer ${tokenFromAPI}`;
        dispatch(setToken(tokenFromAPI));

        navigation.reset({
            index: 0,
            routes: [{ name: ScreenName.APP }],
        });

        updateExpoTokenToServer(bearerToken);
        SecureStore.setItemAsync('api_token', `Bearer ${tokenFromAPI}`);

        dispatch(setIsSignInOtherDeviceStore(false));
        setIsShowSpinner(false);
    };

    return (
        <View
            style={{
                flex: 1,
                alignSelf: 'center',
                alignItems: 'center'
            }}
        >
            <ExpoNotification navigation={navigation} />
            <ImageBackground
                source={Images.RegisterBackground}
                style={styles.imageBackgroundContainer}
                imageStyle={styles.imageBackground}
            >
                <KeyboardAwareScrollView>
                    <View
                        style={{
                            flex: 1,
                            alignSelf: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <View style={styles.registerContainer}>
                            <View
                                style={{
                                    height: SIZES.HEIGHT_BASE * 0.2,
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    marginTop: SIZES.HEIGHT_BASE * 0.1
                                }}
                            >
                                <NoteText
                                    width={SIZES.WIDTH_BASE * 0.77}
                                    title="Dường như bạn đang đăng nhập từ một thiết bị khác:"
                                    content="Bạn vui lòng đăng nhập lại để xác thực thiết bị này."
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

                            {isShowSpinner ? (
                                <CenterLoader />
                            ) : (
                                <>
                                    <View style={{
                                        height: SIZES.HEIGHT_BASE * 0.2
                                    }}
                                    >
                                        <View
                                            style={{
                                                marginBottom: 10,
                                                alignItems: 'center'
                                            }}
                                        >

                                            {!otp ? (
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
                                            ) : (
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
                                            )}
                                        </View>
                                    </View>

                                    <View style={{
                                        alignSelf: 'center'
                                    }}
                                    >
                                        {!otp ? (
                                            <CustomButton
                                                onPress={() => onClickGetOTPWhenChangeDevice()}
                                                type="active"
                                                label="Yêu cầu mã xác thực"
                                                buttonStyle={[styles.button, {
                                                    marginVertical: 10
                                                }]}
                                            />
                                        ) : (
                                            <CustomButton
                                                onPress={() => onSubmitOTP()}
                                                type="active"
                                                label="Xác thực và đăng nhập"
                                                buttonStyle={[styles.button, {
                                                    marginVertical: 10
                                                }]}
                                            />
                                        )}
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
