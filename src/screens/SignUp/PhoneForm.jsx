import { CustomButton, CustomCheckbox, CustomInput } from '@components/uiComponents';
import { NowTheme, Rx } from '@constants';
import { ToastHelpers } from '@helpers';
import { setShowLoaderStore } from '@redux/Actions';
import { rxUtil } from '@utils';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

const {
    FONT: {
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = NowTheme;

export default function PhoneForm({
    phoneNumber,
    setPhoneNumber,
    setStep, setOtp,
    setModalVisible
}) {
    const [onCheckedDisclaimer, setOnCheckedDisclaimer] = useState(false);

    const dispatch = useDispatch();

    const onClickGetOTP = () => {
        if (!phoneNumber) {
            ToastHelpers.renderToast('Số điện thoại không hợp lệ!', 'error');
            return;
        }

        if (!onCheckedDisclaimer) {
            ToastHelpers.renderToast('Bạn vui lòng đồng ý với các Điều khoản và Điều kiện.', 'error');
            return;
        }

        dispatch(setShowLoaderStore(true));
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
                dispatch(setShowLoaderStore(false));
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                dispatch(setShowLoaderStore(false));
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                dispatch(setShowLoaderStore(false));
            }
        );
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
                            width: SIZES.WIDTH_BASE * 0.77
                        }}
                        onChangeText={(phoneNumberInput) => setPhoneNumber(phoneNumberInput)}
                        keyboardType="number-pad"
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.77
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
        width: SIZES.WIDTH_BASE * 0.77,
        marginVertical: 10
    },
    title: {
        fontFamily: MONTSERRAT_BOLD,
        textAlign: 'center'
    },
    stepSessionContainer: {
        height: SIZES.HEIGHT_BASE * 0.3
    },
    formInputContainer: {
        alignItems: 'center',
    }
});
