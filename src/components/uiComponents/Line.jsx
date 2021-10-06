import React, { PureComponent } from 'react';
import { View } from 'react-native';

export default class Line extends PureComponent {
    render() {
        const {
            borderColor, width, borderWidth, style
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
