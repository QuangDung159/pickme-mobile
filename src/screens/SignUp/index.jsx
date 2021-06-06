import {
    Block, Button, Checkbox, Text
} from 'galio-framework';
import React, { useState } from 'react';
import {
    Alert,
    ImageBackground, Modal, ScrollView,
    StyleSheet, TouchableWithoutFeedback, View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { CenterLoader, Input } from '../../components/uiComponents';
import {
    Images, NowTheme, Rx, ScreenName
} from '../../constants';
import { ToastHelpers } from '../../helpers';
import { setIsSignInOtherDeviceStore, setToken } from '../../redux/Actions';
import { rxUtil } from '../../utils';

export default function SignUp({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [onCheckedDisclaimer, setOnCheckedDisclaimer] = useState(false);
    const [isShowSpinner, setIsShowSpinner] = useState(false);

    const deviceIdStore = useSelector((state) => state.appConfigReducer.deviceIdStore);

    const dispatch = useDispatch();

    const loginWithSignUpInfo = () => {
        const data = {
            username: phoneNumber,
            password,
            deviceId: deviceIdStore !== null ? deviceIdStore : ''
        };

        rxUtil(
            Rx.AUTHENTICATION.LOGIN,
            'POST',
            data,
            {},
            (res) => {
                onLoginSuccess(res.data.data);
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
    };

    const onLoginSuccess = (tokenFromAPI) => {
        dispatch(setToken(tokenFromAPI));
        dispatch(setIsSignInOtherDeviceStore(false));
        navigation.navigate(ScreenName.CREATE_ACCOUNT);
        Toast.show({
            type: 'success',
            text1: 'Tạo tài khoản thành công!'
        });
        setIsShowSpinner(false);
    };

    const onClickGetOTP = () => {
        if (!phoneNumber) {
            ToastHelpers.renderToast('Số điện thoại không hợp lệ!', 'error');
            return;
        }

        if (!onCheckedDisclaimer) {
            ToastHelpers.renderToast('Bạn vui lòng đồng ý với các Điều khoản và Điều kiện.', 'error');
            return;
        }

        setIsShowSpinner(true);
        rxUtil(
            Rx.USER.GET_OTP_REGISTER,
            'POST',
            {
                phoneNum: phoneNumber
            },
            null,
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'success');
                setStep(2);

                // in testing, will remove when prod
                setOtp(res.data.data.code);
                setIsShowSpinner(false);
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
    };

    const onClickSubmitRegister = () => {
        if (!otp) {
            ToastHelpers.renderToast('Mã OTP không hợp lệ!', 'error');
            return;
        }

        if (!password) {
            ToastHelpers.renderToast('Mật khẩu không hợp lệ!', 'error');
            return;
        }

        const data = {
            password,
            phoneNum: phoneNumber,
            code: otp,
            deviceId: deviceIdStore !== null ? deviceIdStore : ''
        };

        setIsShowSpinner(true);
        rxUtil(Rx.AUTHENTICATION.SIGN_UP, 'POST', data, {
            'Content-Type': 'application/json'
        },
        () => loginWithSignUpInfo(),
        (res) => {
            setIsShowSpinner(false);
            ToastHelpers.renderToast(res.data.message, 'error');
        },
        (res) => {
            setIsShowSpinner(false);
            ToastHelpers.renderToast(res.data.message, 'error');
        });
    };

    const renderSignUpViewByStep = () => {
        switch (step) {
            case 1: {
                return (
                    <>
                        <Block style={styles.stepSessionContainer}>
                            <Block
                                style={styles.formInputContainer}
                            >
                                <Input
                                    style={styles.input}
                                    placeholder="Nhập số diện thoại..."
                                    value={phoneNumber}
                                    keyboardType="number-pad"
                                    onChangeText={(phoneNumberInput) => setPhoneNumber(phoneNumberInput)}
                                />
                            </Block>

                            <Block
                                style={styles.disclaimerContainer}
                                row
                                width={NowTheme.SIZES.WIDTH_BASE * 0.77}
                                height={NowTheme.SIZES.HEIGHT_BASE * 0.2}
                            >
                                <>
                                    <Checkbox
                                        checkboxStyle={styles.checkbox}
                                        color={NowTheme.COLORS.PRIMARY}
                                        style={styles.checkboxContainer}
                                        initialValue={onCheckedDisclaimer}
                                        label=""
                                        onChange={(checked) => {
                                            setOnCheckedDisclaimer(checked);
                                        }}
                                    />
                                    <Block
                                        flex
                                        style={styles.disclaimerAgreeContainer}
                                    >
                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                setModalVisible(true);
                                            }}
                                        >
                                            <Text
                                                fontFamily={NowTheme.FONT.MONTSERRAT_REGULAR}
                                                color={NowTheme.COLORS.DEFAULT}
                                            >
                                                Tôi đồng ý với các Điều khoản và Điều kiện
                                            </Text>
                                        </TouchableWithoutFeedback>
                                    </Block>
                                </>
                            </Block>
                        </Block>

                        <Block center>
                            <Button
                                onPress={() => onClickGetOTP()}
                                style={styles.button}
                                shadowless
                            >
                                Xác nhận
                            </Button>
                        </Block>
                    </>
                );
            }
            case 2: {
                return (
                    <>
                        <Block style={styles.stepSessionContainer}>
                            <Block
                                style={styles.formInputContainer}
                            >
                                <Input
                                    style={styles.input}
                                    keyboardType="number-pad"
                                    value={otp}
                                    placeholder="Nhập mã xác thực..."
                                    onChangeText={(otpInput) => setOtp(otpInput)}
                                />

                                <Input
                                    placeholder="Nhập mật khẩu..."
                                    style={styles.input}
                                    keyboardType="number-pad"
                                    password
                                    viewPass
                                    value={password}
                                    onChangeText={(passwordInput) => setPassword(passwordInput)}
                                />
                            </Block>
                        </Block>

                        <Block center>
                            <Button
                                onPress={() => onClickSubmitRegister()}
                                style={styles.button}
                                shadowless
                            >
                                Xác nhận
                            </Button>
                        </Block>
                    </>
                );
            }
            default: {
                return (<></>);
            }
        }
    };

    return (
        <>
            <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                                I agree to the terms and conditions
                            </Text>

                            <Block center>
                                <Button
                                    onPress={() => setModalVisible(!modalVisible)}
                                    style={styles.button}
                                    shadowless
                                >
                                    Đã hiểu
                                </Button>
                            </Block>
                        </View>
                    </View>
                </ScrollView>
            </Modal>

            <Block flex middle>
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
                                    style={styles.stepSessionContainer}
                                >
                                    <Text
                                        style={styles.title}
                                        color="#333"
                                        size={24}
                                        height={100}
                                    >
                                        Đăng kí
                                    </Text>
                                </Block>

                                {/* render from this shit */}
                                {isShowSpinner ? (
                                    <CenterLoader />
                                ) : (
                                    <>
                                        {renderSignUpViewByStep()}
                                    </>
                                )}

                            </Block>
                        </Block>
                    </KeyboardAwareScrollView>
                </ImageBackground>
            </Block>
        </>
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
        width: NowTheme.SIZES.WIDTH_BASE * 0.77,
        marginVertical: 10
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
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
    },
    title: {
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
        textAlign: 'center'
    },
    stepSessionContainer: {
        height: NowTheme.SIZES.HEIGHT_BASE * 0.3
    },
    input: {
        borderRadius: 5,
        width: NowTheme.SIZES.WIDTH_BASE * 0.77
    },
    checkbox: {
        borderWidth: 1,
        borderRadius: 2,
        borderColor: NowTheme.COLORS.BORDER_COLOR
    },
    checkboxContainer: {
        alignItems: 'flex-start',
    },
    disclaimerContainer: {
        alignSelf: 'center',
    },
    disclaimerAgreeContainer: {
        marginLeft: 10,
    },
    formInputContainer: {
        alignItems: 'center',
        marginBottom: 10,
    }
});
