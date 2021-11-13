import {
    CenterLoader, CustomButton, CustomInput, CustomText, RadioButton
} from '@components/uiComponents';
import { Theme } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import ValidationHelpers from '@helpers/ValidationHelpers';
import { setCurrentUser, setPersonTabActiveIndex } from '@redux/Actions';
import { UserServices } from '@services/index';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';

const { SIZES, COLORS } = Theme;

export default function UpdateInfoAccount() {
    const [newUser, setNewUser] = useState({});
    const [isShowSpinner, setIsShowSpinner] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    useEffect(
        () => {
            setNewUser({ ...currentUser, dob: currentUser?.dob?.substr(0, 4), isMale: currentUser.isMale });
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
            label="Nơi sinh sống:"
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

    const renderInputHeightWeight = () => (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 10,
                width: '90%'
            }}
        >

            <View>
                <CustomText
                    style={{
                        color: COLORS.ACTIVE,
                        marginBottom: 10
                    }}
                    text="Chiều cao (cm):"
                />
                <CustomInput
                    inputStyle={{
                        width: SIZES.WIDTH_BASE * 0.44
                    }}
                    onChangeText={(input) => setNewUser({ ...newUser, height: input })}
                    value={newUser.height}
                    placeholder="Chiều cao (cm)..."
                    keyboardType="number-pad"
                />
            </View>

            <View>
                <CustomText
                    style={{
                        color: COLORS.ACTIVE,
                        marginBottom: 10
                    }}
                    text="Cân nặng (kg):"
                />
                <CustomInput
                    inputStyle={{
                        width: SIZES.WIDTH_BASE * 0.44
                    }}
                    onChangeText={(input) => setNewUser({ ...newUser, weight: input })}
                    value={newUser.weight}
                    placeholder="Cân nặng (kg)..."
                    keyboardType="number-pad"
                />
            </View>
        </View>
    );

    const renderDobGender = () => (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 10,
                width: '90%',
            }}
        >
            <CustomInput
                inputStyle={{
                    width: SIZES.WIDTH_BASE * 0.44
                }}
                onChangeText={(input) => onChangeYear(input)}
                placeholder="Năm sinh..."
                value={newUser?.dob?.substr(0, 4)}
                label="Năm sinh:"
                keyboardType="number-pad"
            />

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: SIZES.WIDTH_BASE * 0.44,
                marginTop: 30
            }}
            >
                <RadioButton
                    label="Nam"
                    selected={newUser.isMale}
                    onPress={() => setNewUser({ ...newUser, isMale: true })}
                />
                <RadioButton
                    label="Nữ"
                    selected={!newUser.isMale}
                    onPress={() => setNewUser({ ...newUser, isMale: false })}
                />
            </View>
        </View>
    );

    const onChangeYear = (yearInput) => {
        setNewUser({ ...newUser, dob: yearInput });
    };

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
        console.log('newUser :>> ', newUser);
        const validateArr = [
            {
                fieldName: 'Tên hiển thị',
                input: newUser.fullName,
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
                input: newUser.dob,
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
            {
                fieldName: 'Chiều cao',
                input: newUser.height,
                validate: {
                    required: {
                        value: true,
                    },
                }
            },
            {
                fieldName: 'Cân nặng',
                input: newUser.weight,
                validate: {
                    required: {
                        value: true,
                    },
                }
            },
            {
                fieldName: 'Sở thích',
                input: newUser.interests,
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
                fieldName: 'Nơi sinh sống',
                input: newUser.homeTown,
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
                fieldName: 'Mô tả bản thân\n',
                input: newUser.description,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 255,
                    },
                }
            },
        ];

        if (!validateYearsOld(newUser.dob)) {
            ToastHelpers.renderToast('Bạn phải đủ 16 tuổi!', 'error');
            return false;
        }

        return ValidationHelpers.validate(validateArr);
    };

    const validateYearsOld = (dob) => {
        const dateString = moment(dob).format('YYYY-MM-DD');
        const years = moment().diff(dateString, 'years');

        return !(years < 16);
    };

    const onSubmitUpdateInfo = async () => {
        const {
            fullName,
            description,
            dob,
            homeTown,
            interests,
            address,
            url,
            height, weight,
            isMale
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
            email: currentUser.userName,
            IsMale: isMale,
            url,
            height: +height,
            weight: +weight
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
                isMale,
                height,
                weight
            };
            dispatch(setCurrentUser(userInfo));
            dispatch(setPersonTabActiveIndex(0));
            setNewUser(userInfo);
            ToastHelpers.renderToast(data.message, 'success');
        }
        setIsShowSpinner(false);
    };

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            backgroundColor: COLORS.BASE,
                            alignItems: 'center',
                            width: SIZES.WIDTH_BASE,
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                    >
                        {newUser && (
                            <>
                                {renderInputName()}
                                {renderDobGender()}
                                {renderInputHeightWeight()}
                                {renderInputHometown()}
                                {renderInputInterests()}
                                {renderInputDescription()}
                                {renderButtonPanel()}
                            </>
                        )}
                    </KeyboardAwareScrollView>
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
