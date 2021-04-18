import {
    Block, Button, Input, Text
} from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch, useSelector } from 'react-redux';
import { CenterLoader } from '../components/uiComponents';
import {
    NowTheme, Rx, ScreenName
} from '../constants';
import { ToastHelpers } from '../helpers';
import { setCurrentUser, setPersonTabActiveIndex } from '../redux/Actions';
import { rxUtil } from '../utils';

export default function UpdateInfoAccount(props) {
    const { navigation } = props;
    const [newUser, setNewUser] = useState({});
    const [isShowSpinner, setIsShowSpinner] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const token = useSelector((state) => state.userReducer.token);

    const dispatch = useDispatch();

    useEffect(
        () => {
            setNewUser(currentUser);
        }, []
    );

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
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
            <DropDownPicker
                items={listDOBYear}
                defaultValue={currentUser.dob.substr(0, 4)}
                containerStyle={{
                    borderRadius: 5,
                    width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                    height: 44,
                    marginBottom: 10
                }}
                selectedtLabelStyle={{
                    color: 'red'
                }}
                placeholderStyle={{
                    color: NowTheme.COLORS.MUTED
                }}
                itemStyle={{
                    justifyContent: 'flex-start'
                }}
                activeLabelStyle={{ color: NowTheme.COLORS.ACTIVE }}
                onChangeItem={(item) => onChangeDOBYear(item.value)}
                labelStyle={{
                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                }}
            />
        );
    };

    const onChangeDOBYear = (yearInput) => {
        setNewUser({ ...newUser, dob: `${yearInput}-01-01T14:00:00` });
    };

    const onGetCurrentUserData = () => {
        const headers = {
            Authorization: token
        };

        rxUtil(Rx.USER.CURRENT_USER_INFO, 'GET', '', headers,
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
            () => {
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            });
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
            earningExpected,
            homeTown,
            interests
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
            interests
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

                ToastHelpers.renderToast(
                    'Lỗi hệ thống! Vui lòng thử lại.',
                    'error'
                );
            },
            () => {
                setIsShowSpinner(false);

                ToastHelpers.renderToast(
                    'Lỗi hệ thống! Vui lòng thử lại.',
                    'error'
                );
            }
        );
    };

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderInputName = () => (
        <Block
            middle
            style={{
                paddingTop: 10,
            }}
        >
            <Block>
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
                    style={{
                        borderRadius: 5,
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                        height: 44
                    }}
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
            style={{
                paddingTop: 10
            }}
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
                    style={{
                        borderRadius: 5,
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                        height: 44
                    }}
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
            style={{
                paddingTop: 10
            }}
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
                    style={{
                        borderRadius: 5,
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                        height: 44
                    }}
                    keyboardType="number-pad"
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
                paddingTop: 10,
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
                        marginBottom: 10
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
            style={{
                paddingTop: 10
            }}
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
                    <CenterLoader size="large" />
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
                            {renderInputName()}
                            {renderInputHometown()}
                            {renderInputDOB()}
                            {renderInputInterests()}
                            {renderInputDescription()}
                            {renderButtonPanel()}
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
    }
});
