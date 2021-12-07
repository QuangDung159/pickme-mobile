import { CenterLoader, CustomButton, CustomInput } from '@components/uiComponents';
import { IconFamily, Theme } from '@constants/index';
import { ToastHelpers, ValidationHelpers } from '@helpers/index';
import { UserServices } from '@services/index';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { DISCLAIMER_CONTENT } from '@constants/Content';


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
                    width: SIZES.WIDTH_BASE,
                    alignItems: 'center',
                    backgroundColor: COLORS.BASE,
                    marginTop: 5
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