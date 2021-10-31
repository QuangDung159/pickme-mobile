import {
    CenterLoader
} from '@components/uiComponents';
import { Theme } from '@constants/index';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import ModalDisclaimer from './ModalDisclaimer';
import OtpForm from './OtpForm';
import UsernameForm from './UsernameForm';

const {
    FONT: {
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function SignUp({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [step, setStep] = useState(1);
    const [isEmail, setIsEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const showLoaderStore = useSelector((state) => state.appConfigReducer.showLoaderStore);

    const renderSignUpViewByStep = () => {
        switch (step) {
            case 1: {
                return (
                    <UsernameForm
                        isEmail={isEmail}
                        username={username}
                        setUsername={(usernameInput) => setUsername(usernameInput)}
                        setModalVisible={(isVisible) => setModalVisible(isVisible)}
                        setOtp={(otpCode) => setOtp(otpCode)}
                        setIsEmail={(isEmailLogin) => setIsEmail(isEmailLogin)}
                        setStep={(stepIndex) => setStep(stepIndex)}
                    />
                );
            }
            case 2: {
                return (
                    <OtpForm
                        navigation={navigation}
                        otp={otp}
                        password={password}
                        username={username}
                        setOtp={(otpCode) => setOtp(otpCode)}
                        setPassword={(passwordStr) => setPassword(passwordStr)}
                        isEmail={isEmail}
                    />
                );
            }
            default: {
                return (<></>);
            }
        }
    };

    return (
        <>
            <ModalDisclaimer
                modalVisible={modalVisible}
                setModalVisible={(isVisible) => setModalVisible(isVisible)}
            />

            <View
                style={styles.container}
            >
                {showLoaderStore ? (
                    <CenterLoader />
                ) : (
                    <KeyboardAwareScrollView>
                        <View
                            style={{
                                flex: 1,
                                alignSelf: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <View
                                style={styles.stepSessionContainer}
                            >
                                <Text
                                    style={
                                        [
                                            styles.title,
                                            {
                                                color: COLORS.DEFAULT,
                                                fontSize: 24,
                                                marginTop: SIZES.HEIGHT_BASE * 0.15
                                            }
                                        ]
                                    }
                                >
                                    Đăng ký
                                </Text>
                            </View>
                            {renderSignUpViewByStep()}
                        </View>
                    </KeyboardAwareScrollView>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: SIZES.WIDTH_BASE,
        height: SIZES.HEIGHT_BASE,
        backgroundColor: COLORS.BASE,
    },
    title: {
        fontFamily: TEXT_BOLD,
        textAlign: 'center'
    },
    stepSessionContainer: {
        height: SIZES.HEIGHT_BASE * 0.3,
        alignSelf: 'center',
        alignItems: 'center'
    },
});
