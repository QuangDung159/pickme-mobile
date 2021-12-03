import { CustomButton, CustomModal } from '@components/uiComponents';
import { DISCLAIMER_CONTENT } from '@constants/Content';
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
                        {DISCLAIMER_CONTENT}
                    </Text>

                    <View>
                        <CustomButton
                            onPress={() => setModalVisible(false)}
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
        width: SIZES.WIDTH_BASE * 0.8,
        marginVertical: 10
    },
    modalText: {
        fontSize: SIZES.FONT_H4,
        fontFamily: TEXT_REGULAR,
        color: COLORS.DEFAULT
    },
});
