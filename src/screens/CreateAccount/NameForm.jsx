import { CustomButton, CustomInput } from '@components/uiComponents';
import { NowTheme } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import React from 'react';
import { Text, View } from 'react-native';

const {
    SIZES,
} = NowTheme;

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
                        width: SIZES.WIDTH_BASE * 0.77
                    }}
                    placeholder="Nhập tên của bạn..."
                />
            </View>

            <CustomButton
                onPress={() => goToStep(2)}
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
