import { Theme } from '@constants/index';
import React, { PureComponent } from 'react';
import { Platform, Switch } from 'react-native';

const { COLORS } = Theme;

class MkSwitch extends PureComponent {
    render() {
        const { value, ...props } = this.props;

        // const thumbColor = Platform.OS === 'ios'
        //     ? COLORS.PRIMARY
        //     : Platform.OS === 'android' && value
        //         ? COLORS.SWITCH_ON
        //         : COLORS.SWITCH_OFF;

        return (
            <Switch
                value={value}
                thumbColor={[
                    value === true
                        ? COLORS.SWITCH_ON
                        : '#ffffff'
                ]}
                ios_backgroundColor="#D8D8D8"
                trackColor={{
                    true: '#d3d3d3',
                    false: Platform.OS === 'ios' ? '#d3d3d3' : '#333'
                }}
                {...props}
            />
        );
    }
}

export default MkSwitch;
