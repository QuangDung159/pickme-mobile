import Theme from '@constants/Theme';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from './CustomText';

const {
    COLORS, FONT: {
        TEXT_REGULAR
    },
    SIZES
} = Theme;

export default function TouchableText({
    onPress, style, text, disabled = false, onLongPress = false
}) {
    return (
        <TouchableOpacity
            onPress={() => { onPress && onPress(); }}
            onLongPress={() => onLongPress && onLongPress()}
            disabled={disabled}
        >
            <CustomText
                style={[styles.defaultText, style, {
                    color: disabled ? COLORS.PLACE_HOLDER : style.color || styles.defaultText.color
                }]}
                text={text}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    defaultText: {
        fontFamily: TEXT_REGULAR,
        fontSize: SIZES.FONT_H4,
        color: COLORS.DEFAULT,
    }
});
