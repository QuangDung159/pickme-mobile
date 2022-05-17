import { OtpForm, UsernameForm } from '@components/businessComponents';
import {
    CenterLoader, IconCustom, NoteText
} from '@components/uiComponents';
import { IconFamily, ScreenName, Theme } from '@constants/index';
import React, { useState } from 'react';
import {
    StyleSheet, View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';

const {
    FONT: {
        TEXT_BOLD,
        TEXT_REGULAR
    },
    SIZES,
    COLORS
} = Theme;

export default function ForgotPassword({ navigation }) {
    const [step, setStep] = useState(1);
    const [isEmail, setIsEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [username, setUsername] = useState('');

    const showLoaderStore = useSelector((state) => state.appConfigReducer.showLoaderStore);

    const renderForgotPasswordViewByStep = () => {
        switch (step) {
            case 1: {
                return (
                    <UsernameForm
                        isEmail={isEmail}
                        username={username}
                        setUsername={(usernameInput) => setUsername(usernameInput)}
                        setOtp={(otpCode) => setOtp(otpCode)}
                        setIsEmail={(isEmailLogin) => setIsEmail(isEmailLogin)}
                        setStep={(stepIndex) => setStep(stepIndex)}
                        renderFrom={ScreenName.FORGOT_PASSWORD}
                    />
                );
            }
            case 2: {
                return (
                    <OtpForm
                        navigation={navigation}
                        otp={otp}
                        password={password}
                        rePassword={rePassword}
                        username={username}
                        setOtp={(otpCode) => setOtp(otpCode)}
                        setPassword={(input) => setPassword(input)}
                        setRePassword={(input) => setRePassword(input)}
                        isEmail={isEmail}
                        renderFrom={ScreenName.FORGOT_PASSWORD}
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
                                style={{
                                    height: SIZES.HEIGHT_BASE * 0.3,
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        marginTop: SIZES.HEIGHT_BASE * 0.1
                                    }}
                                >
                                    <NoteText
                                        width={SIZES.WIDTH_MAIN}
                                        title="Bạn đang yêu cầu lấy lại mật khẩu:"
                                        content="Bạn vui lòng nhập username đã đăng ký để nhận mã xác thực."
                                        contentStyle={{
                                            fontSize: SIZES.FONT_H4,
                                            color: COLORS.DEFAULT,
                                            fontFamily: TEXT_REGULAR,
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
                                    />
                                </View>
                            </View>
                            {renderForgotPasswordViewByStep()}
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
