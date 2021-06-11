import React, { PureComponent } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NowTheme } from '../../constants';

export default class CenterLoader extends PureComponent {
    render() {
        const { size } = this.props;
        return (
            <View
                style={{
                    zIndex: 1,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <ActivityIndicator
                    size={size}
                    color={NowTheme.COLORS.ACTIVE}
                />
            </View>
        );
    }
}
