import { Checkbox } from 'galio-framework';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { CustomButton, CustomInput } from '../../components/uiComponents';
import { NowTheme, Rx } from '../../constants';
import { ToastHelpers } from '../../helpers';
import { setShowLoaderStore } from '../../redux/Actions';
import { rxUtil } from '../../utils';

const { FONT, SIZES, COLORS } = NowTheme;

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

                <View
                    style={styles.disclaimerContainer}
                >
                    <Checkbox
                        checkboxStyle={styles.checkbox}
                        color={COLORS.PRIMARY}
                        style={styles.checkboxContainer}
                        initialValue={onCheckedDisclaimer}
                        label=""
                        onChange={(checked) => {
                            setOnCheckedDisclaimer(checked);
                        }}
                    />
                    <View
                        style={styles.disclaimerAgreeContainer}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => {
                                setModalVisible(true);
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: FONT.MONTSERRAT_REGULAR,
                                    color: COLORS.DEFAULT
                                }}
                            >
                                Tôi đồng ý với các Điều khoản và Điều kiện
                            </Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
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
        fontFamily: FONT.MONTSERRAT_BOLD,
        textAlign: 'center'
    },
    stepSessionContainer: {
        height: SIZES.HEIGHT_BASE * 0.3
    },
    checkbox: {
        borderWidth: 1,
        borderRadius: 2,
        borderColor: COLORS.BORDER_COLOR
    },
    checkboxContainer: {
        alignItems: 'flex-start',
    },
    disclaimerContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        width: SIZES.WIDTH_BASE * 0.77,
    },
    disclaimerAgreeContainer: {
        marginLeft: 10,
    },
    formInputContainer: {
        alignItems: 'center',
    }
});
