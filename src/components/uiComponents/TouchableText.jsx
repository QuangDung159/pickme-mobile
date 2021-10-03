import Theme from '@constants/Theme';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const {
    COLORS, FONT: {
        TEXT_REGULAR
    },
    SIZES
} = Theme;

export default function TouchableText({ onPress, style, text }) {
    return (
        <TouchableOpacity
            onPress={() => { onPress && onPress(); }}
        >
            <Text
                style={[styles.defaultText, style]}
            >
                {text}
            </Text>
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
