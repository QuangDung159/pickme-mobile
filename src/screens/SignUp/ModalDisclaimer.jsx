import { CustomButton, CustomModal } from '@components/uiComponents';
import { NowTheme } from '@constants/index';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const {
    FONT: {
        MONTSERRAT_REGULAR,
    }, SIZES
} = NowTheme;

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
        width: SIZES.WIDTH_BASE * 0.77,
        marginVertical: 10
    },
    modalText: {
        margin: 15,
        textAlign: 'center',
        fontFamily: MONTSERRAT_REGULAR
    },
});
