import {
    CenterLoader, CustomButton, CustomInput, CustomText, OptionItem, RadioButton
} from '@components/uiComponents';
import { Interests, Theme } from '@constants/index';
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
    // const [listInterest, setListInterest] = useState();
    const [listInterestSelected, setListInterestSelected] = useState(Interests);

    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    useEffect(
        () => {
            setNewUser({ ...currentUser, isMale: currentUser.isMale });
            handleListInterestFromAPI();
        }, []
    );

    const onChangeName = (nameInput) => {
        setNewUser({ ...newUser, fullName: nameInput });
    };

    const onChangeHometown = (hometownInput) => {
        setNewUser({ ...newUser, homeTown: hometownInput });
    };

    // const onChangeInterests = (interestsInput) => {
    //     setNewUser({ ...newUser, interests: interestsInput });
    // };

    const onChangeDescription = (descriptionInput) => {
        setNewUser({ ...newUser, description: descriptionInput });
    };

    const createInterestStr = () => {
        let interestStr = '';

        listInterestSelected.forEach((item) => {
            if (item.selected) {
                interestStr += `${item.value}, `;
            }
        });

        return interestStr;
    };

    const renderInputName = () => (
        <CustomInput
            value={newUser.fullName}
            onChangeText={(input) => onChangeName(input)}
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            autoCapitalize
            label="Tên hiển thị:"
        />
    );

    const renderInputPhone = () => (
        <CustomInput
            value={newUser.phoneNum}
            onChangeText={(input) => setNewUser({ ...newUser, phoneNum: input })}
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            keyboardType="number-pad"
            label="Số điện thoại:"
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
            autoCapitalize
            label="Nơi sinh sống:"
        />
    );

    const renderInputZalo = () => (
        <CustomInput
            value={newUser.zalo}
            onChangeText={(input) => setNewUser({ ...newUser, zalo: input })}
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            keyboardType="number-pad"
            label="SĐT đăng kí Zalo:"
        />
    );

    const renderInputSkype = () => (
        <CustomInput
            value={newUser.skype}
            onChangeText={(input) => setNewUser({ ...newUser, skype: input })}
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            label="ID Skype:"
        />
    );

    const renderInputMessenger = () => (
        <CustomInput
            value={newUser.facebook}
            onChangeText={(input) => setNewUser({ ...newUser, facebook: input })}
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            label="ID Messenger:"
        />
    );

    // const renderInputInterests = () => (
    //     <CustomInput
    //         value={newUser.interests}
    //         onChangeText={(input) => onChangeInterests(input)}
    //         containerStyle={{
    //             marginVertical: 10,
    //             width: SIZES.WIDTH_BASE * 0.9
    //         }}
    //         label="Sở thích:"
    //     />
    // );

    const handlePressInterest = (index) => {
        const list = [...listInterestSelected];
        list[index].selected = !list[index].selected;
        setListInterestSelected(list);
    };

    const handleListInterestFromAPI = () => {
        const list = currentUser?.interests ? currentUser.interests.split(', ') : [];

        if (list.length === 0) {
            return;
        }

        list.splice(list.length - 1, 1);
        const listResult = [...listInterestSelected];

        list.forEach((itemFromAPI) => {
            listResult.forEach((item, index) => {
                if (itemFromAPI === item.value) {
                    listResult[index].selected = true;
                }
            });
        });

        setListInterestSelected(listResult);
    };

    const renderOptionInterests = () => (
        <View
            style={{
                alignItems: 'flex-start',
                width: SIZES.WIDTH_BASE * 0.9,
                marginTop: 10
            }}
        >
            <CustomText
                text="Sở thích:"
                style={{
                    color: COLORS.ACTIVE,
                    fontSize: SIZES.FONT_H3,
                }}
            />
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: 10,
                    flexWrap: 'wrap'
                }}
            >
                {listInterestSelected.map((item, index) => (
                    <OptionItem
                        item={item}
                        index={index}
                        handlePressItem={() => {
                            handlePressInterest(index);
                        }}
                        isSelected={item.selected}
                    />
                ))}
            </View>
        </View>
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
            autoCapitalize
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
                paddingBottom: 20,
            }}
        >
            <CustomButton
                onPress={() => onSubmitUpdateInfo()}
                type="active"
                label="Xác nhận"
                buttonStyle={{
                    width: SIZES.WIDTH_BASE * 0.9
                }}
            />
        </View>
    );

    const validate = () => {
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
                fieldName: 'Tên hiển thị',
                input: newUser.fullName,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 12,
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
                input: createInterestStr(),
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
        if (!validate()) {
            return;
        }

        const body = {
            ...newUser,
            email: currentUser.userName,
            IsMale: newUser.isMale,
            interests: createInterestStr()
        };

        setIsShowSpinner(true);

        const result = await UserServices.submitUpdateInfoAsync(body);
        const { data } = result;

        if (data) {
            dispatch(setCurrentUser(data.data));
            dispatch(setPersonTabActiveIndex(0));
            setNewUser(data.data);
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
                                {renderInputPhone()}
                                {renderDobGender()}
                                {renderInputHeightWeight()}
                                {renderInputHometown()}
                                {/* {renderInputInterests()} */}
                                {renderOptionInterests()}
                                {renderInputDescription()}
                                {renderInputZalo()}
                                {renderInputSkype()}
                                {renderInputMessenger()}
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
