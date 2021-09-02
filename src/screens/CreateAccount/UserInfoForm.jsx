import { CustomButton, CustomInput } from '@components/uiComponents';
import { Gender, Theme } from '@constants/index';
import { ToastHelpers, ValidationHelpers } from '@helpers/index';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Platform, Text, View } from 'react-native';

const {
    SIZES,
    COLORS,
} = Theme;

export default function UserInfoForm({
    registerContainer,
    stepViewContainer,
    stepTitleText, stepFormContainer,
    inputWith,
    newUser,
    setNewUser,
    goToStep
}) {
    const onChangeInputInterests = (userInterestsInput) => {
        const user = { ...newUser, interests: userInterestsInput };
        setNewUser(user);
    };

    const onChangeYear = (yearInput) => {
        const user = { ...newUser, dob: yearInput };
        setNewUser(user);
    };

    const onChangeGender = (genderKey) => {
        setNewUser({ ...newUser, gender: genderKey });
    };

    const validate = () => {
        const {
            interests,
            dob
        } = newUser;

        const validationArr = [
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

    const renderPickerGender = () => (
        <View
            style={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.77
            }}
        >
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

    const renderUserInfoForm = () => (
        <View style={registerContainer}>
            <View
                style={stepViewContainer}
            >
                <Text
                    style={stepTitleText}
                    color="#333"
                    size={24}
                >
                    Thông tin cơ bản
                </Text>
            </View>

            <View
                style={[
                    stepFormContainer,
                    {
                        zIndex: 99
                    }
                ]}
            >
                <CustomInput
                    containerStyle={{
                        marginVertical: 10,
                        width: SIZES.WIDTH_BASE * 0.77
                    }}
                    onChangeText={(userInterests) => onChangeInputInterests(userInterests)}
                    value={newUser.interests}
                    placeholder="Nhập sở thích của bạn..."
                />

                <CustomInput
                    containerStyle={{
                        marginVertical: 10,
                        width: SIZES.WIDTH_BASE * 0.77
                    }}
                    onChangeText={(input) => onChangeYear(input)}
                    value={newUser.dob}
                    placeholder="Nhập năm sinh của bạn..."
                />

                {renderPickerGender()}

            </View>
            <View
                center
            >
                <CustomButton
                    onPress={() => {
                        if (!validate()) {
                            return;
                        }
                        goToStep(5);
                    }}
                    buttonStyle={inputWith}
                    type="active"
                    label="Bước kế tiếp"
                />
            </View>
        </View>
    );

    try {
        return (
            <View>
                {renderUserInfoForm()}
            </View>
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
