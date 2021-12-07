import { DISCLAIMER_CONTENT } from '@constants/Content';
import { Theme } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const {
    FONT: {
        TEXT_REGULAR,
    }, SIZES,
    COLORS
} = Theme;

export default function ChangePassword() {
    try {
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    width: SIZES.WIDTH_BASE * 0.9,
                    alignItems: 'center',
                    backgroundColor: COLORS.BASE,
                    marginTop: 5,
                    alignSelf: 'center'
                }}
            >
                <Text style={styles.modalText}>
                    {DISCLAIMER_CONTENT}
                </Text>
            </ScrollView>
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
    modalText: {
        fontSize: SIZES.FONT_H4,
        fontFamily: TEXT_REGULAR,
        color: COLORS.DEFAULT,
    },
});
