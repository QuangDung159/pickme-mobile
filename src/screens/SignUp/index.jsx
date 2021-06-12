import React, { useState } from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import {
    CenterLoader
} from '../../components/uiComponents';
import {
    Images, NowTheme
} from '../../constants';
import ModalDisclaimer from './ModalDisclaimer';
import OtpForm from './OtpForm';
import PhoneForm from './PhoneForm';

const { FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    }, SIZES, COLORS } = NowTheme;

export default function SignUp({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');

    const deviceIdStore = useSelector((state) => state.appConfigReducer.deviceIdStore);
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
                        deviceIdStore={deviceIdStore}
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
                style={{
                    flex: 1,
                    alignSelf: 'center',
                    alignItems: 'center'
                }}
            >
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
                                    style={styles.stepSessionContainer}
                                >
                                    <Text
                                        style={
                                            [
                                                styles.title,
                                                {
                                                    color: '#333',
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
                                {showLoaderStore ? (
                                    <CenterLoader />
                                ) : (
                                    <>
                                        {renderSignUpViewByStep()}
                                    </>
                                )}

                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </ImageBackground>
            </View>
        </>
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
    title: {
        fontFamily: MONTSERRAT_BOLD,
        textAlign: 'center'
    },
    stepSessionContainer: {
        height: SIZES.HEIGHT_BASE * 0.3,
        alignSelf: 'center',
        alignItems: 'center'
    },
});
