import DateTimePicker from '@react-native-community/datetimepicker';
import {
    Block, Button, Input, Text
} from 'galio-framework';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CenterLoader } from '../components/uiComponents';
import {
    NowTheme, Rx, ScreenName, Utils
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

    const onChangeHeight = (heightInput) => {
        setNewUser({ ...newUser, height: heightInput.toString() });
    };

    const onChangeWeight = (weightInput) => {
        setNewUser({ ...newUser, weight: weightInput.toString() });
    };

    const onChangeDescription = (descriptionInput) => {
        setNewUser({ ...newUser, description: descriptionInput });
    };

    const onChangeInputDOB = (event, selectedDate) => {
        const dateToProcess = moment(selectedDate).format(Utils.TIME_FORMAT.TIME_FROMAT_DDMMYYYY);

        // format time to use
        const stringTimeFormated = moment(dateToProcess.split('-').reverse().join('-'));

        setNewUser({ ...newUser, dob: stringTimeFormated });
    };

    const validate = () => {
        const {
            fullName,
            height,
            weight,
            description,
        } = newUser;

        if (!fullName) {
            ToastHelpers.renderToast('Tên của bạn không hợp lệ!', 'error');
            return false;
        }

        if (!height || height <= 0) {
            ToastHelpers.renderToast('Chiều cao không hợp lệ!', 'error');
            return false;
        }

        if (!weight || weight <= 10) {
            ToastHelpers.renderToast('Cân nặng không hợp lệ!', 'error');
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
            weight
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

    const renderInputHeight = (user) => (
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
                    Chiều cao (cm):
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
                    placeholder="Nhập chiều cao..."
                    value={newUser.height !== undefined ? newUser.height.toString() : user.height.toString()}
                    onChangeText={(input) => onChangeHeight(input)}
                />
            </Block>
        </Block>
    );

    const renderInputWeight = (user) => (
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
                    Cân nặng (kg):
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
                    placeholder="Nhập cân nặng..."
                    value={newUser.weight !== undefined ? newUser.weight.toString() : user.weight.toString()}
                    onChangeText={(input) => onChangeWeight(input)}
                />
            </Block>
        </Block>
    );

    const renderInputDOB = (user) => {
        // convert date for input
        let myDate = moment(newUser.dob || user.dob).format(Utils.TIME_FORMAT.TIME_FROMAT_DDMMYYYY);
        myDate = myDate.split('-');
        const newDate = new Date(myDate[2], myDate[1] - 1, myDate[0]);
        const dobDisplay = new Date(newDate.getTime());

        return (
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
                        Ngày sinh:
                    </Text>

                    <DateTimePicker
                        style={{
                            borderRadius: 5,
                            width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                            height: 44,
                            marginTop: 20
                        }}
                        value={dobDisplay}
                        mode="date"
                        is24Hour
                        display="default"
                        onChange={(event, selectedDate) => { onChangeInputDOB(event, selectedDate); }}
                    />
                </Block>
            </Block>
        );
    };

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
                style={{
                    margin: 0
                }}
            >
                Xác nhận
            </Button>
            <Button
                shadowless
                color={NowTheme.COLORS.DEFAULT}
                style={{
                    margin: 0
                }}
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
                            {renderInputHeight(currentUser)}
                            {renderInputWeight(currentUser)}
                            {renderInputDOB(currentUser)}
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
