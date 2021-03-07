import {
    Block, Button, Checkbox, Text
} from 'galio-framework';
import React, { useState } from 'react';
import {
    ActivityIndicator, Alert,
    ImageBackground, Modal, ScrollView,
    StyleSheet, TouchableWithoutFeedback, View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { Input } from '../components/uiComponents';
import {
    Images, NowTheme, Rx, ScreenName
} from '../constants';
import { ToastHelpers } from '../helpers';
import { setToken } from '../redux/Actions';
import { rxUtil } from '../utils';

export default function SignUp(props) {
    const [modalVisible, setModalVisible] = useState(false);
    const [step, setStep] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [onCheckedDisclaimer, setOnCheckedDisclaimer] = useState(false);
    const [isShowSpinner, setIsShowSpinner] = useState(false);

    const { navigation } = props;
    const dispatch = useDispatch();

    const loginWithSignUpInfo = () => {
        const data = {
            username,
            password
        };

        rxUtil(
            Rx.AUTHENTICATION.LOGIN,
            'POST',
            data,
            {},
            (res) => {
                onLoginSucess(res);
            },
            () => {}
        );
    };

    const onLoginSucess = (res) => {
        dispatch(setToken(res.data.data));
        navigation.navigate(ScreenName.CREATE_ACCOUNT);
        setIsShowSpinner(false);
        Toast.show({
            type: 'success',
            text1: 'Tạo tài khoản thành công!'
        });
    };

    const onSucessSubmitSignUp = () => {
        // do login and get token
        loginWithSignUpInfo();
    };

    const onClickSubmit = () => {
        if (validate()) {
            const data = { password, PhoneNumber: phoneNumber, username };

            if (username && password) {
                setIsShowSpinner(true);
                rxUtil(Rx.AUTHENTICATION.SIGN_UP, 'POST', data, {
                    'Content-Type': 'application/json'
                },
                () => onSucessSubmitSignUp(),
                () => {
                    Toast.show({
                        type: 'error',
                        text1: 'Lỗi hệ thống, vui lòng thử lại!'
                    });
                    setIsShowSpinner(false);
                },
                () => {
                    Toast.show({
                        type: 'error',
                        text1: 'Lỗi hệ thống, vui lòng thử lại!'
                    });
                    setIsShowSpinner(false);
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Bạn chưa điền đủ thông tin!'
                });
                setIsShowSpinner(false);
            }
        }
    };

    const validate = () => {
        if (!username) {
            ToastHelpers.renderToast('Tên đăng nhập không hợp lệ!', 'error');
            return false;
        }

        if (!password) {
            ToastHelpers.renderToast('Mật khẩu không hợp lệ!', 'error');
            return false;
        }

        if (!onCheckedDisclaimer) {
            ToastHelpers.renderToast('Bạn vui lòng đồng ý với các Điều khoản và Điều kiện.', 'error');
            return false;
        }

        return true;
    };

    const renderSignUpViewByStep = () => {
        switch (step) {
            case 1: {
                return (
                    <>
                        {isShowSpinner ? (
                            <ActivityIndicator
                                size="large"
                                color={NowTheme.COLORS.ACTIVE}
                            />
                        ) : (
                            <>
                                <Block style={styles.stepSessionContainer}>
                                    <Block
                                        style={styles.formInputContainer}
                                    >
                                        <Input
                                            style={styles.input}
                                            placeholder="Nhập tên đăng nhập..."
                                            value={username}
                                            onChangeText={(usernameInput) => setUsername(usernameInput)}
                                        />

                                        <Input
                                            placeholder="Nhập mật khẩu..."
                                            style={styles.input}
                                            password
                                            viewPass
                                            value={password}
                                            onChangeText={(passwordInput) => setPassword(passwordInput)}
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
                                        onPress={() => onClickSubmit(navigation)}
                                        style={styles.button}
                                        shadowless
                                    >
                                        Xác nhận
                                    </Button>
                                </Block>
                            </>
                        )}

                    </>
                );
            }
            case 2: {
                return (
                    <>
                        <Block style={styles.stepSessionContainer}>
                            <Block
                                row
                                style={styles.formInputContainer}
                            >
                                <Input
                                    style={styles.input}
                                    keyboardType="number-pad"
                                    value={otp}
                                    placeholder="Nhập mã xác thực..."
                                    onChangeText={(otpInput) => setOtp(otpInput)}
                                />
                            </Block>
                        </Block>

                        <Block center>
                            <Button
                                onPress={() => { setStep(3); }}
                                style={styles.button}
                                shadowless
                            >
                                Xác nhận
                            </Button>
                        </Block>
                    </>
                );
            }
            case 3: {
                return (
                    <>
                        {isShowSpinner ? (
                            <ActivityIndicator
                                size="large"
                                color={NowTheme.COLORS.ACTIVE}
                            />
                        ) : (
                            <>
                                <Block style={styles.stepSessionContainer}>
                                    <Block
                                        style={styles.formInputContainer}
                                    >

                                        {/* Why this shit is here, try to remove and you will see the magic, LOL */}
                                        <></>
                                        {/* Why this shit is here, try to remove and you will see the magic, LOL */}

                                        <Input
                                            placeholder="Nhập mật khẩu..."
                                            style={styles.input}
                                            password
                                            viewPass
                                            value={password}
                                            onChangeText={(passwordInput) => setPassword(passwordInput)}
                                        />
                                        <Input
                                            placeholder="Nhập lại mật khẩu..."
                                            style={styles.input}
                                            password
                                            viewPass
                                            value={rePassword}
                                            onChangeText={(rePasswordInput) => setRePassword(rePasswordInput)}
                                        />
                                    </Block>
                                </Block>

                                <Block center>
                                    <Button
                                        onPress={() => onClickSubmit(navigation)}
                                        style={styles.button}
                                        shadowless
                                    >
                                        Xác nhận
                                    </Button>
                                </Block>
                            </>
                        )}
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
                                {renderSignUpViewByStep()}
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
        width: NowTheme.SIZES.WIDTH_90,
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
