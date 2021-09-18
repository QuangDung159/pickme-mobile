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
import PhoneForm from './PhoneForm';

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
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');

    const showLoaderStore = useSelector((state) => state.appConfigReducer.showLoaderStore);

    const renderSignUpViewByStep = () => {
        switch (step) {
            case 1: {
                return (
                    <PhoneForm
                        phoneNumber={phoneNumber}
                        setModalVisible={(isVisible) => setModalVisible(isVisible)}
                        setOtp={(otpCode) => setOtp(otpCode)}
                        setPhoneNumber={(phoneNum) => setPhoneNumber(phoneNum)}
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
                        phoneNumber={phoneNumber}
                        setOtp={(otpCode) => setOtp(otpCode)}
                        setPassword={(passwordStr) => setPassword(passwordStr)}
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
                                                height: 100,
                                                marginTop: SIZES.HEIGHT_BASE * 0.1
                                            }
                                        ]
                                    }
                                >
                                    Đăng kí
                                </Text>
                            </View>

                            {/* render from this shit */}
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
        backgroundColor: COLORS.BLOCK,
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
