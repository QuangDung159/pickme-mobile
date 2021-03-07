import { Block } from 'galio-framework';
import React, { PureComponent } from 'react';

export default class Line extends PureComponent {
    render() {
        const {
            borderColor, width, borderWidth, style
        } = this.props;
        return (
            <Block style={[{
                borderWidth,
                borderColor,
                width
            }, style]}
            />
        );
    }
}
