import Theme from '@constants/Theme';
import React, { PureComponent } from 'react';
import { View } from 'react-native';

const { COLORS, SIZES } = Theme;

export default class Line extends PureComponent {
    render() {
        const {
            borderColor = COLORS.ACTIVE, width = SIZES.WIDTH_BASE * 0.9, borderBottomWidth = 1, style
        } = this.props;
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
}
