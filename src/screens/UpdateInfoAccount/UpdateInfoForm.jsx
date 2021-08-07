import { CenterLoader, CustomButton, CustomInput } from '@components/uiComponents';
import { Gender, Theme } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import ValidationHelpers from '@helpers/ValidationHelpers';
import { Picker } from '@react-native-picker/picker';
import { setCurrentUser, setPersonTabActiveIndex } from '@redux/Actions';
import { UserServices } from '@services/index';
import React, { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';

const { SIZES, COLORS, FONT: { TEXT_REGULAR } } = Theme;

export default function UpdateInfoForm() {
    const [newUser, setNewUser] = useState({});
    const [isShowSpinner, setIsShowSpinner] = useState(false);

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

    const onChangeGender = (genderKey) => {
        setNewUser({ ...newUser, gender: genderKey });
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

    const renderPickerGender = () => (
        <View
            style={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
        >
            <Text
                style={{
                    fontFamily: TEXT_REGULAR,
                    fontSize: SIZES.FONT_H3,
                    color: COLORS.ACTIVE,
                    marginBottom: 10
                }}
            >
                Giới tính:
            </Text>
            <View
                style={{
                    marginVertical: Platform.OS === 'ios' ? -30 : -20
                }}
            >
                <Picker
                    selectedValue={newUser.gender}
                    onValueChange={(itemValue) => onChangeGender(itemValue)}
                    itemStyle={{
                        fontSize: SIZES.FONT_H2,
                        color: COLORS.DEFAULT
                    }}
                    mode="dropdown"
                    dropdownIconColor={COLORS.ACTIVE}
                    style={{
                        fontSize: SIZES.FONT_H2,
                        color: COLORS.ACTIVE
                    }}
                >
                    {Gender.GENDER_ARRAY.map((item) => (
                        <Picker.Item value={item.value} label={item.label} key={item.value} />
                    ))}
                </Picker>
            </View>
        </View>
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
            label="Mô tả bản thân:"
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
                justifyContent: 'space-between',
                paddingBottom: 20,
                width: SIZES.WIDTH_BASE * 0.9
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
            homeTown, interests,
            dob
        } = newUser;

        const validationArr = [
            {
                fieldName: 'Tên hiển thị',
                input: fullName,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 255,
                    },
                }
            },
            {
                fieldName: 'Quê quán',
                input: homeTown,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 255,
                    },
                }
            },
            {
                fieldName: 'Sở thích',
                input: interests,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 255,
                    },
                }
            },
            {
                fieldName: 'Mô tả bạn thân',
                input: description,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 255,
                    },
                }
            },
            {
                fieldName: 'Năm sinh',
                input: dob,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 4,
                    },
                    minLength: {
                        value: 4
                    }
                }
            },
        ];

        return ValidationHelpers.validate(validationArr);
    };

    const onSubmitUpdateInfo = async () => {
        const {
            fullName,
            description,
            dob,
            homeTown,
            interests,
            address,
            gender,
            url,
        } = newUser;

        if (!validate()) {
            return;
        }

        const body = {
            fullName,
            description,
            dob: `${dob}-01-01T14:00:00`,
            homeTown,
            interests,
            address,
            email: 'N/a',
            gender,
            url,
        };

        setIsShowSpinner(true);

        const result = await UserServices.submitUpdateInfoAsync(body);
        const { data } = result;

        if (data) {
            const userInfo = {
                ...currentUser,
                fullName,
                dob,
                homeTown,
                interests,
                gender,
                genderDisplay: data.data.genderDisplay,
            };

            dispatch(setCurrentUser(userInfo));
            dispatch(setPersonTabActiveIndex(0));
            setNewUser(userInfo);
            ToastHelpers.renderToast(data.message, 'success');
        }
        setIsShowSpinner(false);
    };

    return (
        <>
            {isShowSpinner ? (
                <CenterLoader />
            ) : (
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        backgroundColor: COLORS.BLOCK,
                        alignItems: 'center',
                        width: SIZES.WIDTH_BASE,
                        marginTop: 5,
                        marginBottom: 5,
                    }}
                >
                    {newUser && (
                        <>
                            {renderInputName()}
                            {renderPickerGender()}
                            {renderInputHometown()}
                            {renderInputYear()}
                            {renderInputInterests()}
                            {renderInputDescription()}
                            {renderButtonPanel()}
                        </>
                    )}
                </KeyboardAwareScrollView>
            )}
        </>
    );
}
