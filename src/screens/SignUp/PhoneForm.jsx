import { CustomButton, CustomCheckbox, CustomInput } from '@components/uiComponents';
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
    phoneNumber,
    setPhoneNumber,
    setStep, setOtp,
    setModalVisible
}) {
    const [onCheckedDisclaimer, setOnCheckedDisclaimer] = useState(false);

    const dispatch = useDispatch();

    const validate = () => {
        const validateArr = [
            {
                fieldName: 'Số điện thoại',
                input: phoneNumber,
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
            phoneNum: phoneNumber
        });
        const { data } = result;

        if (data) {
            setStep(2);

            // in testing, will remove when prod
            setOtp(data.message);
        }
        dispatch(setShowLoaderStore(false));
    };

    const renderPhoneForm = () => (
        <>
            <View style={styles.stepSessionContainer}>
                <View
                    style={styles.formInputContainer}
                >
                    <CustomInput
                        value={phoneNumber}
                        inputStyle={{
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        onChangeText={(phoneNumberInput) => setPhoneNumber(phoneNumberInput)}
                        keyboardType="number-pad"
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        placeholder="Nhập số điện thoại..."
                    />
                </View>

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

            <View center>
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
    },
    button: {
        width: SIZES.WIDTH_BASE * 0.9,
        marginVertical: 10
    },
    title: {
        fontFamily: TEXT_BOLD,
        textAlign: 'center'
    },
    stepSessionContainer: {
        height: SIZES.HEIGHT_BASE * 0.3
    },
    formInputContainer: {
        alignItems: 'center',
    }
});
