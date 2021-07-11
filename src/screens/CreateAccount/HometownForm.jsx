import { Theme } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import React from 'react';
import { Text, View } from 'react-native';
import { CustomButton, CustomInput } from '@components/uiComponents';

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
                        width: SIZES.WIDTH_BASE * 0.77
                    }}
                    placeholder="Nhập quê quán..."
                />
            </View>

            <View center>
                <CustomButton
                    onPress={() => goToStep(3)}
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
