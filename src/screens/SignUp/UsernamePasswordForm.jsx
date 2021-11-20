import {
    CustomButton, CustomCheckbox, CustomInput
} from '@components/uiComponents';
import { ScreenName, Theme, IconFamily } from '@constants/index';
import { ToastHelpers, ValidationHelpers } from '@helpers/index';
import { setShowLoaderStore } from '@redux/Actions';
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

export default function UsernamePasswordForm({
    setModalVisible,
    isEmail, renderFrom,
}) {
    const [onCheckedDisclaimer, setOnCheckedDisclaimer] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowRePassword, setIsShowRePassword] = useState('');
    const [password, setPassword] = useState();
    const [rePassword, setRePassword] = useState();
    const [username, setUsername] = useState();

    const dispatch = useDispatch();

    const validate = () => {
        const validateArr = [
            {
                fieldName: 'Tên đăng nhập',
                input: username,
                validate: {
                    required: {
                        value: true
                    },
                }
            }
        ];

        return ValidationHelpers.validate(validateArr);
    };

    const onSubmitSignUp = () => {
        if (!validate()) return;

        if (renderFrom === ScreenName.SIGN_UP) {
            if (!onCheckedDisclaimer) {
                ToastHelpers.renderToast('Bạn vui lòng đồng ý với các Điều khoản và Điều kiện.', 'error');
                return;
            }
        }

        const body = {
            username,
            isEmail
        };

        dispatch(setShowLoaderStore(true));
        // handle
        dispatch(setShowLoaderStore(false));
    };

    const renderRegisterForm = () => (
        <>
            <View style={styles.formContainer}>
                <View
                    style={styles.formInputContainer}
                >
                    <CustomInput
                        value={username}
                        inputStyle={{
                            width: SIZES.WIDTH_BASE * 0.9,
                            textAlign: 'center',
                        }}
                        onChangeText={(input) => setUsername(input.trim())}
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        placeholder="Nhập tên đăng nhập"
                    />

                    <CustomInput
                        value={password}
                        inputStyle={{
                            width: SIZES.WIDTH_BASE * 0.9,
                            textAlign: 'center',
                        }}
                        onChangeText={(passwordInput) => setPassword(passwordInput)}
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        secureTextEntry={!isShowPassword}
                        placeholder="Nhập mật khẩu"
                        rightIcon={{
                            name: 'eye',
                            family: IconFamily.ENTYPO,
                            size: 20,
                            color: COLORS.DEFAULT
                        }}
                        onPressRightIcon={() => setIsShowPassword(!isShowPassword)}
                    />

                    <CustomInput
                        value={rePassword}
                        inputStyle={{
                            width: SIZES.WIDTH_BASE * 0.9,
                            textAlign: 'center',
                        }}
                        onChangeText={(input) => setRePassword(input)}
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        secureTextEntry={!isShowPassword}
                        placeholder="Xác nhận mật khẩu"
                        rightIcon={{
                            name: 'eye',
                            family: IconFamily.ENTYPO,
                            size: 20,
                            color: COLORS.DEFAULT
                        }}
                        onPressRightIcon={() => setIsShowRePassword(!isShowRePassword)}
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

            <View
                style={{
                    position: 'absolute',
                    bottom: 0
                }}
            >
                <CustomButton
                    onPress={() => onSubmitSignUp()}
                    buttonStyle={styles.button}
                    type="active"
                    label="Xác nhận"
                />
            </View>
        </>
    );
    return (
        <View>
            {renderRegisterForm()}
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
