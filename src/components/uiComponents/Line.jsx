import React, { PureComponent } from 'react';
import { View } from 'react-native';

export default class Line extends PureComponent {
    render() {
        const {
            borderColor, width, borderWidth, style
        } = this.props;
        return (
            <View style={[{
                borderWidth,
                borderColor,
                width
            }, style]}
            />
        );
    }
}
