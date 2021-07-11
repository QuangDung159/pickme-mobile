import { CustomButton, CustomInput } from '@components/uiComponents';
import { Theme } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import React from 'react';
import { Text, View } from 'react-native';

const {
    SIZES,
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

            </View>
            <View
                center
            >
                <CustomButton
                    onPress={() => goToStep(5)}
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
