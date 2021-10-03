import { CustomButton, CustomModal } from '@components/uiComponents';
import { Theme } from '@constants/index';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const {
    FONT: {
        TEXT_REGULAR,
    }, SIZES,
    COLORS
} = Theme;

export default function ModalDisclaimer({ modalVisible, setModalVisible }) {
    const renderModalDisclaimer = () => (
        <CustomModal
            modalVisible={modalVisible}
            renderContent={() => (
                <>
                    <Text style={styles.modalText}>
                        I agree to the terms and conditions
                        I agree to the terms and conditions
                        I agree to the terms and conditions
                        I agree to the terms and conditions
                        I agree to the terms and conditions
                        I agree to the terms and conditions
                        I agree to the terms and conditions
                        I agree to the terms and conditions
                        I agree to the terms and conditions
                        I agree to the terms and conditions
                        I agree to the terms and conditions
                        I agree to the terms and conditions
                        I agree to the terms and conditions
                        I agree to the terms and conditions
                    </Text>

                    <View>
                        <CustomButton
                            onPress={() => setModalVisible(!modalVisible)}
                            buttonStyle={styles.button}
                            type="active"
                            label="Đã hiểu"
                        />
                    </View>
                </>
            )}
        />
    );

    return (
        <View>
            {renderModalDisclaimer()}
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        width: SIZES.WIDTH_BASE * 0.9,
        marginVertical: 10
    },
    modalText: {
        margin: 15,
        textAlign: 'center',
        fontFamily: TEXT_REGULAR,
        color: COLORS.DEFAULT
    },
});
