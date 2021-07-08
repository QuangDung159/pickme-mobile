import { CustomButton, CustomInput } from '@components/uiComponents';
import { NowTheme } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import React from 'react';
import { Text, View } from 'react-native';

const {
    SIZES,
} = NowTheme;

export default function DescForm({
    registerContainer,
    stepViewContainer,
    stepTitleText, stepFormContainer,
    inputWith,
    newUser,
    setNewUser,
    goToStep
}) {
    const onChangeInputDescription = (descriptionInput) => {
        const user = { ...newUser, description: descriptionInput };
        setNewUser(user);
    };

    const renderDescForm = () => (
        <View style={registerContainer}>
            <View
                style={stepViewContainer}
            >
                <Text
                    style={stepTitleText}
                    color="#333"
                    size={24}
                >
                    {!newUser.description
                        ? 'Mô tả về bạn'
                        : `${newUser.description}`}
                </Text>
            </View>

            <View
                style={stepFormContainer}
            >
                <View
                    style={{
                        height: 50,
                        justifyContent: 'flex-end'
                    }}
                >
                    <CustomInput
                        value={newUser.description}
                        multiline
                        onChangeText={(description) => onChangeInputDescription(description)}
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.77
                        }}
                        inputStyle={{
                            height: 80,
                        }}
                        placeholder="Mô tả về mình đi nào..."
                    />
                </View>
            </View>

            <View center>
                <CustomButton
                    onPress={() => goToStep(4)}
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
                {renderDescForm()}
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
