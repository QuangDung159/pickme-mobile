import {
    CustomButton, CustomCheckbox, CustomInput, RadioButton
} from '@components/uiComponents';
import { Theme } from '@constants/index';
import { ToastHelpers, ValidationHelpers } from '@helpers/index';
import { setShowLoaderStore } from '@redux/Actions';
import { UserServices } from '@services/index';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

const {
    FONT: {
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function PhoneForm({
    username,
    setUsername,
    setStep, setOtp,
    setModalVisible,
    isEmail, setIsEmail
}) {
    const [onCheckedDisclaimer, setOnCheckedDisclaimer] = useState(false);

    const dispatch = useDispatch();

    const validate = () => {
        let validateArr = [];
        if (isEmail) {
            validateArr = [
                {
                    fieldName: 'Email',
                    input: username,
                    validate: {
                        required: {
                            value: true
                        },
                        isEmail: {
                            value: true
                        }
                    }
                }
            ];
        } else {
            validateArr = [
                {
                    fieldName: 'Số điện thoại',
                    input: username,
                    validate: {
                        required: {
                            value: true
                        },
                        isPhone: {
                            value: true
                        }
                    }
                }
            ];
        }

        return ValidationHelpers.validate(validateArr);
    };

    const onClickGetOTP = async () => {
        if (!validate()) return;

        if (!onCheckedDisclaimer) {
            ToastHelpers.renderToast('Bạn vui lòng đồng ý với các Điều khoản và Điều kiện.', 'error');
            return;
        }

        dispatch(setShowLoaderStore(true));
        const result = await UserServices.fetchOtpSignUpAsync({
            username,
            isEmail
        });
        const { data } = result;

        if (data) {
            setStep(2);

            // in testing, will remove when prod
            setOtp(data.message);
            ToastHelpers.renderToast('OTP đã được gửi, vui lòng kiểm tra', 'success');
        }
        dispatch(setShowLoaderStore(false));
    };

    const renderLoginType = () => (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 15,
            width: SIZES.WIDTH_BASE * 0.9
        }}
        >
            <RadioButton
                label="Số điện thoại"
                selected={!isEmail}
                onPress={() => {
                    setIsEmail(false);
                }}
            />
            <RadioButton
                label="Email"
                selected={isEmail}
                onPress={() => {
                    setIsEmail(true);
                }}
            />
        </View>
    );

    const renderPhoneForm = () => (
        <>
            <View style={styles.formContainer}>
                <View
                    style={styles.formInputContainer}
                >
                    {isEmail ? (
                        <CustomInput
                            value={username}
                            inputStyle={{
                                width: SIZES.WIDTH_BASE * 0.9,
                                textAlign: 'center',
                                fontFamily: TEXT_BOLD
                            }}
                            onChangeText={(input) => setUsername(input.trim())}
                            containerStyle={{
                                marginVertical: 10,
                                width: SIZES.WIDTH_BASE * 0.9
                            }}
                            placeholder="Nhập email..."
                        />
                    ) : (
                        <CustomInput
                            value={username}
                            inputStyle={{
                                width: SIZES.WIDTH_BASE * 0.9,
                                textAlign: 'center',
                                fontFamily: TEXT_BOLD
                            }}
                            onChangeText={(input) => setUsername(input.trim())}
                            keyboardType="number-pad"
                            containerStyle={{
                                marginVertical: 10,
                                width: SIZES.WIDTH_BASE * 0.9
                            }}
                            placeholder="Nhập số điện thoại..."
                        />
                    )}
                </View>

                {renderLoginType()}

                <CustomCheckbox
                    label="Tôi đồng ý với các Điều khoản và Điều kiện"
                    onPressLabel={() => {
                        setModalVisible(true);
                    }}
                    onChange={(checked) => {
                        setOnCheckedDisclaimer(checked);
                    }}
                />
            </View>

            <View
                style={{
                    position: 'absolute',
                    bottom: 0
                }}
            >
                <CustomButton
                    onPress={() => onClickGetOTP()}
                    buttonStyle={styles.button}
                    type="active"
                    label="Xác nhận"
                />
            </View>
        </>
    );
    return (
        <View>
            {renderPhoneForm()}
        </View>
    );
}

const styles = StyleSheet.create({
    registerContainer: {
        marginTop: 55,
        width: SIZES.WIDTH_BASE * 0.9,
        height: SIZES.HEIGHT_BASE < 812 ? SIZES.HEIGHT_BASE * 0.8 : SIZES.HEIGHT_BASE * 0.8,
        backgroundColor: COLORS.BASE,
    },
    button: {
        width: SIZES.WIDTH_BASE * 0.9,
        marginVertical: 10
    },
    title: {
        fontFamily: TEXT_BOLD,
        textAlign: 'center'
    },
    formContainer: {
        height: SIZES.HEIGHT_BASE * 0.65
    },
    formInputContainer: {
        alignItems: 'center',
    }
});
