import { GUIDE_CONTENT } from '@constants/Guide';
import { Theme } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

const {
    FONT: {
        TEXT_REGULAR,
    }, SIZES,
    COLORS
} = Theme;

export default function Guide() {
    try {
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    width: SIZES.WIDTH_MAIN,
                    alignItems: 'center',
                    backgroundColor: COLORS.BASE,
                    marginTop: 5,
                    alignSelf: 'center'
                }}
            >
                <Text style={styles.modalText}>
                    {GUIDE_CONTENT}
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
