import { CenterLoader, CustomButton, CustomInput } from '@components/uiComponents';
import { NowTheme, Rx } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import { setCurrentUser, setPersonTabActiveIndex } from '@redux/Actions';
import { rxUtil } from '@utils/index';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

const { SIZES, COLORS } = NowTheme;

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
                width: SIZES.WIDTH_BASE * 0.9
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
                width: SIZES.WIDTH_BASE * 0.9
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
                width: SIZES.WIDTH_BASE * 0.9
            }}
            label="Sở thích:"
        />
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
                width: SIZES.WIDTH_BASE * 0.9
            }}
            label="Mô tả:"
        />
    );

    const onChangeYear = (yearInput) => {
        setNewUser({ ...newUser, dob: yearInput });
    };

    const renderInputYear = () => (
        <CustomInput
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            onChangeText={(input) => onChangeYear(input)}
            value={newUser?.dob?.substr(0, 4)}
            label="Năm sinh:"
        />
    );

    const renderButtonPanel = () => (
        <View
            style={{
                paddingTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between'
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
        </View>
    );

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
            dob: `${dob}-01-01T14:00:00`,
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
            (res) => {
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

                ToastHelpers.renderToast(res.data.message, 'success');
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
                    width: SIZES.WIDTH_BASE * 0.9,
                    alignSelf: 'center'
                }}
            >
                <View
                    style={{
                        backgroundColor: COLORS.BASE,
                        marginVertical: 10
                    }}
                >
                    {isShowSpinner ? (
                        <View
                            style={{
                                marginTop: SIZES.HEIGHT_BASE * 0.3
                            }}
                        >
                            <CenterLoader size="small" />
                        </View>
                    ) : (
                        <>
                            {newUser && (
                                <>
                                    {renderInputName()}
                                    {renderInputHometown()}
                                    {renderInputYear()}
                                    {renderInputInterests()}
                                    {renderInputDescription()}
                                    {renderButtonPanel()}
                                </>
                            )}
                        </>
                    )}
                </View>
            </ScrollView>
        </>
    );
}
