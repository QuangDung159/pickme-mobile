import { CustomButton } from '@components/uiComponents';
import { Theme, ScreenName } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import { setToken } from '@redux/Actions';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

const {
    SIZES,
} = Theme;

export default function DoneSection({
    registerContainer,
    stepTitleText,
    inputWith,
    navigation
}) {
    const dispatch = useDispatch();

    const renderDoneSection = () => (
        <View style={registerContainer}>
            <View
                middle
                style={styles.finishStepViewContainer}
            >
                <Text
                    style={stepTitleText}
                    color="#333"
                    size={24}
                >
                    Hoàn tất quá trình tạo tài khoản!
                </Text>
                <View
                    style={{
                        marginTop: 20
                    }}
                >
                    <Text
                        style={stepTitleText}
                        color="#333"
                        size={24}
                    >
                        {`Cảm ơn bạn đã ở đây ${'<3'}!`}
                    </Text>
                </View>
            </View>

            <View
                center
                style={{
                    marginTop: 50,
                }}
            >
                <CustomButton
                    onPress={() => {
                        dispatch(setToken(''));
                        navigation.navigate(ScreenName.ONBOARDING);
                    }}
                    buttonStyle={inputWith}
                    type="active"
                    label="Quay về trang đăng nhập"
                />
            </View>
        </View>
    );

    try {
        return (
            <View>
                {renderDoneSection()}
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

const styles = StyleSheet.create({
    finishStepViewContainer: {
        height: SIZES.HEIGHT_BASE * 0.6,
        marginHorizontal: 20,
        justifyContent: 'center',
    }
});
