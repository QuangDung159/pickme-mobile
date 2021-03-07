import React, { PureComponent } from 'react';
import { Platform, Switch } from 'react-native';
import { NowTheme } from '../../constants';

class MkSwitch extends PureComponent {
    render() {
        const { value, ...props } = this.props;

        // const thumbColor = Platform.OS === 'ios'
        //     ? NowTheme.COLORS.PRIMARY
        //     : Platform.OS === 'android' && value
        //         ? NowTheme.COLORS.SWITCH_ON
        //         : NowTheme.COLORS.SWITCH_OFF;

        return (
            <Switch
                value={value}
                thumbColor={[
                    value === true
                        ? NowTheme.COLORS.SWITCH_ON
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
