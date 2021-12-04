import { CenterLoader, CustomButton, CustomInput } from '@components/uiComponents';
import { IconFamily, Theme } from '@constants/index';
import { ToastHelpers, ValidationHelpers } from '@helpers/index';
import { UserServices } from '@services/index';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const { SIZES, COLORS } = Theme;

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [reNewPassword, setReNewPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [isShowCurrentPassword, setIsShowCurrentPassword] = useState('');
    const [isShowReNewPassword, setIsShowReNewPassword] = useState('');
    const [isShowNewPassword, setIsShowNewPassword] = useState('');

    const [isShowSpinner, setIsShowSpinner] = useState(false);

    const validate = async () => {
        const password = await SecureStore.getItemAsync('password');

        const validationArr = [
            {
                fieldName: 'Mật khẩu hiện tại',
                input: currentPassword,
                validate: {
                    required: {
                        value: true,
                    },
                }
            },
            {
                fieldName: 'Mật khẩu mới',
                input: newPassword,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 50,
                    },
                    minLength: {
                        value: 8,
                    },
                }
            },
            {
                fieldName: 'Xác nhận mật khẩu mới',
                input: reNewPassword,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 50,
                    },
                    minLength: {
                        value: 8,
                    },
                }
            }
        ];

        if (!ValidationHelpers.validate(validationArr)) return false;

        if (password !== currentPassword) {
            ToastHelpers.renderToast('Mật khẩu hiện tại không đúng.', 'error');
            return false;
        }

        if (newPassword !== reNewPassword) {
            ToastHelpers.renderToast('Mật khẩu mới không giống nhau.', 'error');
            return false;
        }

        return true;
    };

    const onSubmitChangePassword = async () => {
        if (!(await validate())) return;

        setIsShowSpinner(true);

        const result = await UserServices.submitChangePasswordAsync({
            currentPassword,
            newPassword,
            confirmPassword: reNewPassword
        });

        const { data } = result;
        if (data) {
            SecureStore.setItemAsync('password', newPassword);
            setNewPassword('');
            setCurrentPassword('');
            setReNewPassword('');
            ToastHelpers.renderToast(data.message, 'success');
        }

        setIsShowSpinner(false);
    };

    const renderFormNewPassword = () => (
        <>
            <CustomInput
                value={currentPassword}
                inputStyle={{
                    width: SIZES.WIDTH_BASE * 0.9
                }}
                onChangeText={(passwordInput) => setCurrentPassword(passwordInput)}
                keyboardType="number-pad"
                containerStyle={{
                    marginVertical: 10,
                    width: SIZES.WIDTH_BASE * 0.9
                }}
                secureTextEntry={!isShowCurrentPassword}
                placeholder="Nhập mật khẩu hiện tại"
                rightIcon={{
                    name: 'eye',
                    family: IconFamily.ENTYPO,
                    size: 20,
                    color: COLORS.DEFAULT
                }}
                label="Mật khẩu hiện tại:"
                onPressRightIcon={() => setIsShowCurrentPassword(!isShowCurrentPassword)}
            />

            <CustomInput
                value={newPassword}
                inputStyle={{
                    width: SIZES.WIDTH_BASE * 0.9
                }}
                onChangeText={(passwordInput) => setNewPassword(passwordInput)}
                keyboardType="number-pad"
                containerStyle={{
                    marginVertical: 10,
                    width: SIZES.WIDTH_BASE * 0.9
                }}
                secureTextEntry={!isShowNewPassword}
                placeholder="Nhập mật khẩu mới"
                rightIcon={{
                    name: 'eye',
                    family: IconFamily.ENTYPO,
                    size: 20,
                    color: COLORS.DEFAULT
                }}
                label="Mật khẩu mới:"
                onPressRightIcon={() => setIsShowNewPassword(!isShowNewPassword)}
            />

            <CustomInput
                value={reNewPassword}
                inputStyle={{
                    width: SIZES.WIDTH_BASE * 0.9
                }}
                onChangeText={(passwordInput) => setReNewPassword(passwordInput)}
                keyboardType="number-pad"
                containerStyle={{
                    marginVertical: 10,
                    width: SIZES.WIDTH_BASE * 0.9
                }}
                secureTextEntry={!isShowReNewPassword}
                placeholder="Xác nhận mật khẩu mới"
                rightIcon={{
                    name: 'eye',
                    family: IconFamily.ENTYPO,
                    size: 20,
                    color: COLORS.DEFAULT
                }}
                label="Xác nhận mật khẩu mới:"
                onPressRightIcon={() => setIsShowReNewPassword(!isShowReNewPassword)}
            />

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 20
                }}
            >
                <CustomButton
                    onPress={() => {
                        setCurrentPassword('');
                        setNewPassword('');
                        setReNewPassword('');
                    }}
                    type="default"
                    label="Huỷ bỏ"
                />
                <CustomButton
                    onPress={() => onSubmitChangePassword()}
                    type="active"
                    label="Xác nhận"
                />
            </View>
        </>
    );

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            width: SIZES.WIDTH_BASE,
                            alignItems: 'center',
                            backgroundColor: COLORS.BASE,
                            marginTop: 5
                        }}
                    >
                        <View>
                            {renderFormNewPassword()}
                        </View>
                    </ScrollView>
                )}
            </>
        );
    } catch (exception) {
        console.log('exception :>> ', exception);
        return (
            <>
                {ToastHelpers.renderToast()}
            </>
        );
    }
}
