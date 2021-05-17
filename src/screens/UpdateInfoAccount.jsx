import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import {
    Block, Button, Text
} from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { CenterLoader, IconCustom, Input } from '../components/uiComponents';
import {
    IconFamily,
    NowTheme, Rx, ScreenName
} from '../constants';
import { ToastHelpers } from '../helpers';
import { setCurrentUser, setPersonTabActiveIndex } from '../redux/Actions';
import { rxUtil } from '../utils';

export default function UpdateInfoAccount(props) {
    const { navigation } = props;
    const [newUser, setNewUser] = useState({});
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [reNewPassword, setReNewPassword] = useState('');
    const [isShowFormChangePassword, setIsShowFormChangePassword] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const token = useSelector((state) => state.userReducer.token);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

    useEffect(
        () => {
            setNewUser(currentUser);
        }, []
    );

    useEffect(
        () => {
            if (isSignInOtherDeviceStore) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: ScreenName.SIGN_IN_WITH_OTP }],
                });
            }
        }, [isSignInOtherDeviceStore]
    );

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderListPickerItem = (list) => list.map((item) => (
        <Picker.Item label={item.label} value={item.value} key={item.value} />
    ));

    const renderDropdownDOBYear = () => {
        const currentYear = new Date().getFullYear();
        const DOBStartYear = currentYear - 58;
        const listDOBYear = [];
        for (let i = 0; i < 40; i += 1) {
            listDOBYear.unshift({
                label: (DOBStartYear + i).toString(),
                value: (DOBStartYear + i).toString()
            });
        }

        return (
            <Picker
                selectedValue={newUser?.dob?.substr(0, 4)}
                onValueChange={(itemValue) => onChangeDOBYear(itemValue)}
                fontFamily={NowTheme.FONT.MONTSERRAT_REGULAR}
            >
                {renderListPickerItem(listDOBYear)}
            </Picker>
        );
    };

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

    const renderFormNewPassword = () => (
        <>
            <Block
                style={{
                    marginBottom: 10,
                }}
            >
                <Text
                    color={NowTheme.COLORS.ACTIVE}
                    size={16}
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                    }}
                >
                    Mật khẩu hiện tại:
                </Text>

                <Input
                    placeholder="Nhập mật khẩu hiện tại..."
                    style={styles.input}
                    password
                    keyboardType="number-pad"
                    viewPass
                    value={currentPassword}
                    color={NowTheme.COLORS.HEADER}
                    onChangeText={
                        (passwordInput) => setCurrentPassword(passwordInput)
                    }
                />

                <Text
                    color={NowTheme.COLORS.ACTIVE}
                    size={16}
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                    }}
                >
                    Mật khẩu mới:
                </Text>

                <Input
                    placeholder="Nhập mật khẩu mới..."
                    style={styles.input}
                    password
                    keyboardType="number-pad"
                    viewPass
                    value={newPassword}
                    color={NowTheme.COLORS.HEADER}
                    onChangeText={
                        (passwordInput) => setNewPassword(passwordInput)
                    }
                />

                <Text
                    color={NowTheme.COLORS.ACTIVE}
                    size={16}
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                    }}
                >
                    Xác nhận mật khẩu mới:
                </Text>

                <Input
                    placeholder="Nhập lại mật khẩu mới..."
                    style={[styles.input, {
                        marginBottom: 0
                    }]}
                    password
                    keyboardType="number-pad"
                    viewPass
                    value={reNewPassword}
                    color={NowTheme.COLORS.HEADER}
                    onChangeText={
                        (rePasswordInput) => setReNewPassword(rePasswordInput)
                    }
                />
            </Block>

            <Block
                row
                space="between"
            >
                <Button
                    shadowless
                    onPress={() => onSubmitChangePassword()}
                    style={styles.button}
                >
                    Xác nhận
                </Button>
                <Button
                    shadowless
                    color={NowTheme.COLORS.DEFAULT}
                    style={styles.button}
                    onPress={() => {
                        setIsShowFormChangePassword(false);
                    }}
                >
                    Huỷ bỏ
                </Button>
            </Block>
        </>
    );

    const renderButtonChangePassword = () => (
        <TouchableWithoutFeedback
            onPress={() => setIsShowFormChangePassword(true)}
            containerStyle={{
                width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                alignSelf: 'center',
                marginBottom: 10
            }}
        >
            <Block
                row
                style={{
                    alignItems: 'center'
                }}
            >
                <IconCustom
                    name="sign-out"
                    size={NowTheme.SIZES.FONT_H3}
                    color={NowTheme.COLORS.ACTIVE}
                    family={IconFamily.FONT_AWESOME}
                />
                <Text
                    color={NowTheme.COLORS.ACTIVE}
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                        marginLeft: 5
                    }}
                    size={NowTheme.SIZES.FONT_H3}
                >
                    Đổi mật khẩu
                </Text>
            </Block>
        </TouchableWithoutFeedback>
    );

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
                setIsShowFormChangePassword(false);

                SecureStore.setItemAsync('password', newPassword)
                    .then(console.log('password :>> ', newPassword));

                setCurrentUser('');
                setNewPassword('');
                setReNewPassword('');

                setIsShowSpinner(false);
            },
            () => setIsShowSpinner(false),
            () => setIsShowSpinner(false)
        );
    };

    const onChangeDOBYear = (yearInput) => {
        setNewUser({ ...newUser, dob: `${yearInput}-01-01T14:00:00` });
    };

    const onGetCurrentUserData = () => {
        const headers = {
            Authorization: token
        };

        rxUtil(
            Rx.USER.CURRENT_USER_INFO, 'GET', '', headers,
            (res) => {
                dispatch(setCurrentUser(res.data.data));
                setIsShowSpinner(false);
                ToastHelpers.renderToast(
                    'Cập nhật thông tin thành công!',
                    'success'
                );
                navigation.navigate(ScreenName.PERSONAL);
                dispatch(setPersonTabActiveIndex(0));
            },
            () => setIsShowSpinner(false),
            () => setIsShowSpinner(false)
        );
    };

    const onChangeName = (nameInput) => {
        setNewUser({ ...newUser, fullName: nameInput });
    };

    const onChangeHometown = (hometownInput) => {
        setNewUser({ ...newUser, homeTown: hometownInput });
    };

    const onChangeInterests = (interestsInput) => {
        setNewUser({ ...newUser, interests: interestsInput });
    };

    const onChangeDescription = (descriptionInput) => {
        setNewUser({ ...newUser, description: descriptionInput });
    };

    const validate = () => {
        const {
            fullName,
            description,
        } = newUser;

        if (!fullName) {
            ToastHelpers.renderToast('Tên của bạn không hợp lệ!', 'error');
            return false;
        }

        if (!description) {
            ToastHelpers.renderToast('Mô tả không hợp lệ!', 'error');
            return false;
        }

        return true;
    };

    const onSubmitUpdateInfo = () => {
        const {
            fullName,
            description,
            dob,
            height,
            weight,
            homeTown,
            interests,
            earningExpected,
            address
        } = newUser;

        if (!validate()) {
            return;
        }

        const data = {
            fullName,
            description,
            dob,
            height,
            earningExpected,
            weight,
            homeTown,
            interests,
            address
        };

        const headers = {
            Authorization: token
        };

        setIsShowSpinner(true);

        rxUtil(
            Rx.USER.UPDATE_USER_INFO,
            'POST',
            data,
            headers,
            () => {
                onGetCurrentUserData();
            },
            () => {
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            }
        );
    };

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderInputName = () => (
        <Block
            middle
        >
            <Block>
                {renderButtonChangePassword()}

                <Text
                    color={NowTheme.COLORS.ACTIVE}
                    size={16}
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                    }}
                >
                    Tên hiển thị:
                </Text>

                <Input
                    numberOfLines={2}
                    style={styles.input}
                    color={NowTheme.COLORS.HEADER}
                    placeholder="Nhập tên hiển thị..."
                    value={newUser.fullName}
                    onChangeText={(input) => onChangeName(input)}
                />
            </Block>
        </Block>
    );

    const renderInputHometown = () => (
        <Block
            middle
        >
            <Block>
                <Text
                    color={NowTheme.COLORS.ACTIVE}
                    size={16}
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                    }}
                >
                    Quê quán:
                </Text>

                <Input
                    numberOfLines={2}
                    style={styles.input}
                    color={NowTheme.COLORS.HEADER}
                    placeholder="Nhập quê quán..."
                    value={newUser.homeTown}
                    onChangeText={(input) => onChangeHometown(input)}
                />
            </Block>
        </Block>
    );

    const renderInputInterests = () => (
        <Block
            middle
        >
            <Block>
                <Text
                    color={NowTheme.COLORS.ACTIVE}
                    size={16}
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                    }}
                >
                    Sở thích:
                </Text>

                <Input
                    numberOfLines={2}
                    style={styles.input}
                    color={NowTheme.COLORS.HEADER}
                    placeholder="Nhập sở thích..."
                    value={newUser.interests}
                    onChangeText={(input) => onChangeInterests(input)}
                />
            </Block>
        </Block>
    );

    const renderInputDOB = () => (
        <Block
            middle
            style={{
                zIndex: 99
            }}
        >
            <Block>
                <Text
                    color={NowTheme.COLORS.ACTIVE}
                    size={16}
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                    }}
                >
                    Năm sinh:
                </Text>

                {renderDropdownDOBYear()}
            </Block>
        </Block>
    );

    const renderInputDescription = () => (
        <Block
            middle
        >
            <Block>
                <Text
                    color={NowTheme.COLORS.ACTIVE}
                    size={16}
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                    }}
                >
                    Mô tả:
                </Text>

                <Input
                    multiline
                    numberOfLines={2}
                    style={{
                        borderRadius: 5,
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                        height: 60
                    }}
                    color={NowTheme.COLORS.HEADER}
                    placeholder="Nhập mô tả..."
                    value={newUser.description}
                    onChangeText={(input) => onChangeDescription(input)}
                />
            </Block>
        </Block>
    );

    const renderButtonPanel = () => (
        <Block
            row
            space="between"
            style={{
                paddingTop: 10
            }}
        >
            <Button
                shadowless
                onPress={() => onSubmitUpdateInfo()}
                style={styles.button}
            >
                Xác nhận
            </Button>
            <Button
                shadowless
                color={NowTheme.COLORS.DEFAULT}
                style={styles.button}
                onPress={() => {
                    navigation.goBack();
                }}
            >
                Huỷ bỏ
            </Button>
        </Block>
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
                            {isShowFormChangePassword ? (
                                <>
                                    {renderFormNewPassword()}
                                </>
                            ) : (
                                <>
                                    {newUser && (
                                        <>
                                            {renderInputName()}
                                            {renderInputHometown()}
                                            {renderInputDOB()}
                                            {renderInputInterests()}
                                            {renderInputDescription()}
                                            {renderButtonPanel()}
                                        </>
                                    )}
                                </>
                            )}
                        </Block>
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

const styles = StyleSheet.create({
    button: {
        margin: 0,
        width: NowTheme.SIZES.WIDTH_BASE * 0.44
    },
    input: {
        borderRadius: 5,
        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
        height: 44,
        marginBottom: 10
    }
});
