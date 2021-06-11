import { Picker } from '@react-native-picker/picker';
import {
    Block, Text
} from 'galio-framework';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react/cjs/react.development';
import { CenterLoader, CustomButton, CustomInput } from '../../components/uiComponents';
import { NowTheme, Rx } from '../../constants';
import { ToastHelpers } from '../../helpers';
import { setCurrentUser, setPersonTabActiveIndex } from '../../redux/Actions';
import { rxUtil } from '../../utils';

export default function UpdateInfoForm() {
    const [newUser, setNewUser] = useState({});
    const [isShowSpinner, setIsShowSpinner] = useState(false);

    const token = useSelector((state) => state.userReducer.token);
    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    useEffect(
        () => {
            setNewUser({ ...currentUser, dob: currentUser?.dob?.substr(0, 4) });
        }, []
    );

    const onChangeDOBYear = (yearInput) => {
        setNewUser({ ...newUser, dob: `${yearInput}-01-01T14:00:00` });
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

    const renderInputName = () => (
        <CustomInput
            value={newUser.fullName}
            onChangeText={(input) => onChangeName(input)}
            containerStyle={{
                marginVertical: 10,
                width: NowTheme.SIZES.WIDTH_BASE * 0.9
            }}
            label="Tên hiển thị:"
        />
    );

    const renderInputHometown = () => (
        <CustomInput
            value={newUser.homeTown}
            onChangeText={(input) => onChangeHometown(input)}
            containerStyle={{
                marginVertical: 10,
                width: NowTheme.SIZES.WIDTH_BASE * 0.9
            }}
            label="Quê quán:"
        />
    );

    const renderInputInterests = () => (
        <CustomInput
            value={newUser.interests}
            onChangeText={(input) => onChangeInterests(input)}
            containerStyle={{
                marginVertical: 10,
                width: NowTheme.SIZES.WIDTH_BASE * 0.9
            }}
            label="Sở thích:"
        />
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
        <CustomInput
            multiline
            value={newUser.description}
            onChangeText={(input) => onChangeDescription(input)}
            inputStyle={{
                height: 60
            }}
            containerStyle={{
                marginVertical: 10,
                width: NowTheme.SIZES.WIDTH_BASE * 0.9
            }}
            label="Mô tả:"
        />
    );

    const renderButtonPanel = () => (
        <Block
            row
            space="between"
            style={{
                paddingTop: 10
            }}
        >
            <CustomButton
                onPress={() => {
                    setNewUser({ ...currentUser, dob: currentUser?.dob?.substr(0, 4) });
                }}
                type="default"
                label="Huỷ bỏ"
            />
            <CustomButton
                onPress={() => onSubmitUpdateInfo()}
                type="active"
                label="Xác nhận"
            />
        </Block>
    );

    const renderListPickerItem = (list) => list.map(({ value, label }) => (
        <Picker.Item label={label} value={value} key={value} />
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
                itemStyle={{
                    fontSize: NowTheme.SIZES.FONT_H2,
                    marginTop: -20,
                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                }}
                style={{
                    fontSize: NowTheme.SIZES.FONT_H2,
                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                }}
            >
                {renderListPickerItem(listDOBYear)}
            </Picker>
        );
    };

    const validate = () => {
        const {
            fullName,
            description,
            homeTown, interests
        } = newUser;

        if (!fullName) {
            ToastHelpers.renderToast('Tên của bạn không được trống!', 'error');
            return false;
        }

        if (!homeTown) {
            ToastHelpers.renderToast('Quê quán không được trống!', 'error');
            return false;
        }

        if (!interests) {
            ToastHelpers.renderToast('Sở thích không được trống!', 'error');
            return false;
        }

        if (!description) {
            ToastHelpers.renderToast('Mô tả không được trống!', 'error');
            return false;
        }

        return true;
    };

    const onSubmitUpdateInfo = () => {
        const {
            fullName,
            description,
            dob,
            homeTown,
            interests,
            address
        } = newUser;

        if (!validate()) {
            return;
        }

        const data = {
            fullName,
            description,
            dob,
            height: 0,
            earningExpected: 0,
            weight: 0,
            homeTown,
            interests,
            address,
            email: 'N/a'
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
                const userInfo = {
                    ...currentUser,
                    fullName,
                    dob,
                    homeTown,
                    interests
                };

                dispatch(setCurrentUser(userInfo));
                dispatch(setPersonTabActiveIndex(0));

                setNewUser(userInfo);
                setIsShowSpinner(false);

                ToastHelpers.renderToast(
                    'Cập nhật thông tin thành công!',
                    'success'
                );
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
            }
        );
    };

    return (
        <>
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
                            <CenterLoader size="small" />
                        </Block>
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
        </>
    );
}
