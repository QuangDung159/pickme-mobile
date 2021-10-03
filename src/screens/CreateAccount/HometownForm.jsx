import { CustomButton, CustomInput } from '@components/uiComponents';
import { Theme } from '@constants/index';
import { ToastHelpers, ValidationHelpers } from '@helpers/index';
import React from 'react';
import { Text, View } from 'react-native';

const {
    SIZES,
} = Theme;

export default function HometownForm({
    registerContainer,
    stepViewContainer,
    stepTitleText, stepFormContainer,
    inputWith,
    newUser,
    setNewUser,
    goToStep
}) {
    const onChangeInputHometown = (hometownInput) => {
        const user = { ...newUser, hometown: hometownInput };
        setNewUser(user);
    };

    const validate = () => {
        const {
            hometown
        } = newUser;

        const validationArr = [
            {
                fieldName: 'Quê quán',
                input: hometown,
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

    const renderHometownForm = () => (
        <View style={registerContainer}>
            <View
                style={stepViewContainer}
            >
                <Text
                    style={stepTitleText}
                    color="#333"
                    size={24}
                >

                    {!newUser.hometown
                        ? 'Quê quán?'
                        : `${newUser.hometown} là một nơi tuyệt vời nhỉ!`}
                </Text>
            </View>

            <View
                style={stepFormContainer}
            >
                <CustomInput
                    value={newUser.hometown}
                    onChangeText={(name) => onChangeInputHometown(name)}
                    containerStyle={{
                        marginVertical: 10,
                        width: SIZES.WIDTH_BASE * 0.9
                    }}
                    placeholder="Nhập quê quán..."
                />
            </View>

            <View center>
                <CustomButton
                    onPress={() => {
                        if (!validate()) return;
                        goToStep(3);
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
                {renderHometownForm()}
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
