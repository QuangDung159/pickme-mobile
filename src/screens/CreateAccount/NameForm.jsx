import { CustomButton, CustomInput } from '@components/uiComponents';
import { Theme } from '@constants/index';
import { ToastHelpers, ValidationHelpers } from '@helpers/index';
import React from 'react';
import { Text, View } from 'react-native';

const {
    SIZES,
} = Theme;

export default function NameForm({
    registerContainer,
    stepViewContainer,
    stepTitleText, stepFormContainer,
    inputWith,
    newUser,
    setNewUser,
    goToStep
}) {
    const onChangeInputName = (nameInput) => {
        const user = { ...newUser, fullName: nameInput };
        setNewUser(user);
    };

    const validate = () => {
        const {
            fullName
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
        ];

        return ValidationHelpers.validate(validationArr);
    };

    const renderNameForm = () => (
        <View style={registerContainer}>
            <View
                style={stepViewContainer}
            >
                <Text
                    style={stepTitleText}
                    size={24}
                >
                    {!newUser.fullName
                        ? 'Xin hỏi, bạn là...?'
                        : `Chào bạn, ${newUser.fullName}!`}
                </Text>
            </View>

            <View
                style={stepFormContainer}
            >
                <CustomInput
                    value={newUser.fullName}
                    onChangeText={(name) => onChangeInputName(name)}
                    containerStyle={{
                        marginVertical: 10,
                        width: SIZES.WIDTH_BASE * 0.9
                    }}
                    placeholder="Nhập tên của bạn..."
                />
            </View>

            <CustomButton
                onPress={() => {
                    if (!validate()) {
                        return;
                    }
                    goToStep(2);
                }}
                buttonStyle={inputWith}
                type="active"
                label="Bước kế tiếp"
            />
        </View>
    );

    try {
        return (
            <View>
                {renderNameForm()}
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
