import * as SecureStore from 'expo-secure-store';
import {
    Block
} from 'galio-framework';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { CenterLoader, CustomButton, CustomInput } from '../../components/uiComponents';
import { IconFamily, NowTheme, Rx } from '../../constants';
import { ToastHelpers } from '../../helpers';
import { rxUtil } from '../../utils';

export default function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [reNewPassword, setReNewPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [isShowCurrentPassword, setIsShowCurrentPassword] = useState('');
    const [isShowReNewPassword, setIsShowReNewPassword] = useState('');
    const [isShowNewPassword, setIsShowNewPassword] = useState('');

    const [isShowSpinner, setIsShowSpinner] = useState(false);

    const token = useSelector((state) => state.userReducer.token);

    const validateChangePasswordForm = async () => {
        const password = await SecureStore.getItemAsync('password');

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

    const onSubmitChangePassword = () => {
        if (!validateChangePasswordForm) return;

        setIsShowSpinner(true);
        rxUtil(
            Rx.USER.SUBMIT_CHANGE_PASSWORD,
            'POST',
            {
                currentPassword,
                newPassword,
                confirmPassword: reNewPassword
            },
            {
                Authorization: token
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'success');
                SecureStore.setItemAsync('password', newPassword);

                setNewPassword('');
                setCurrentPassword('');
                setReNewPassword('');
                setIsShowSpinner(false);
            },
            (res) => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast(res.data.message, 'error');
            },
            (res) => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast(res.data.message, 'error');
            }
        );
    };

    const renderFormNewPassword = () => (
        <>
            <Block
                style={{
                    marginBottom: 10,
                }}
            >
                <CustomInput
                    value={currentPassword}
                    inputStyle={{
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9
                    }}
                    onChangeText={(passwordInput) => setCurrentPassword(passwordInput)}
                    keyboardType="number-pad"
                    containerStyle={{
                        marginVertical: 10,
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9
                    }}
                    secureTextEntry={!isShowCurrentPassword}
                    placeholder="Nhập mật khẩu hiện tại..."
                    rightIcon={{
                        name: 'eye',
                        family: IconFamily.ENTYPO,
                        size: 20,
                        color: NowTheme.COLORS.DEFAULT
                    }}
                    onPressRightIcon={() => setIsShowCurrentPassword(!isShowCurrentPassword)}
                />

                <CustomInput
                    value={newPassword}
                    inputStyle={{
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9
                    }}
                    onChangeText={(passwordInput) => setNewPassword(passwordInput)}
                    keyboardType="number-pad"
                    containerStyle={{
                        marginVertical: 10,
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9
                    }}
                    secureTextEntry={!isShowNewPassword}
                    placeholder="Nhập mật khẩu mới..."
                    rightIcon={{
                        name: 'eye',
                        family: IconFamily.ENTYPO,
                        size: 20,
                        color: NowTheme.COLORS.DEFAULT
                    }}
                    onPressRightIcon={() => setIsShowNewPassword(!isShowNewPassword)}
                />

                <CustomInput
                    value={reNewPassword}
                    inputStyle={{
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9
                    }}
                    onChangeText={(passwordInput) => setReNewPassword(passwordInput)}
                    keyboardType="number-pad"
                    containerStyle={{
                        marginVertical: 10,
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9
                    }}
                    secureTextEntry={!isShowReNewPassword}
                    placeholder="Nhập lại mật khẩu mới..."
                    rightIcon={{
                        name: 'eye',
                        family: IconFamily.ENTYPO,
                        size: 20,
                        color: NowTheme.COLORS.DEFAULT
                    }}
                    onPressRightIcon={() => setIsShowReNewPassword(!isShowReNewPassword)}
                />
            </Block>

            <Block
                row
                space="between"
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
            </Block>
        </>
    );

    try {
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                    alignSelf: 'center'
                }}
            >
                <Block
                    style={{
                        backgroundColor: NowTheme.COLORS.BASE,
                        marginVertical: 10
                    }}
                >
                    {isShowSpinner ? (
                        <Block
                            style={{
                                marginTop: NowTheme.SIZES.HEIGHT_BASE * 0.3
                            }}
                        >
                            <CenterLoader />
                        </Block>
                    ) : (
                        <>
                            {renderFormNewPassword()}
                        </>
                    )}
                </Block>
            </ScrollView>

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
