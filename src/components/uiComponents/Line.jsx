import Theme from '@constants/Theme';
import React, { PureComponent } from 'react';
import { View } from 'react-native';

const { COLORS, SIZES } = Theme;

export default class Line extends PureComponent {
    render() {
        const {
            borderColor = COLORS.ACTIVE, width = SIZES.WIDTH_BASE * 0.9, borderWidth = 0.5, style
        } = this.props;
        return (
            <View style={[{
                marginVertical: 10
            }, {
                borderWidth,
                borderColor,
                width
            }, style]}
            />
        );
    }
}
