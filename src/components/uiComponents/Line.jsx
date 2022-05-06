import Theme from '@constants/Theme';
import React from 'react';
import { View } from 'react-native';

const { COLORS, SIZES } = Theme;

export default function Line({
    borderColor = COLORS.ACTIVE, width = SIZES.WIDTH_BASE * 0.9, borderBottomWidth = 0.5, style
}) {
    return (
        <View style={[{
            marginVertical: 10
        }, {
            borderBottomWidth,
            borderColor,
            width
        }, style]}
        />
    );
}
