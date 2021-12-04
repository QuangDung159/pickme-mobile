import Theme from '@constants/Theme';
import React from 'react';
import { Text } from 'react-native';

const {
    FONT: {
        TEXT_REGULAR
    }, COLORS, SIZES
} = Theme;

export default function CustomText({ text, style }) {
    return (
        <>
            <Text
                style={[{
                    fontFamily: TEXT_REGULAR,
                    fontSize: SIZES.FONT_H3,
                    color: COLORS.DEFAULT,
                }, style]}
            >
                {text}
            </Text>
        </>
    );
}
