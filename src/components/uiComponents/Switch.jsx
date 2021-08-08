import { Theme } from '@constants/index';
import React, { PureComponent } from 'react';
import { Switch } from 'react-native';

const { COLORS } = Theme;

class MkSwitch extends PureComponent {
    render() {
        const { value, ...props } = this.props;

        return (
            <Switch
                value={value}
                thumbColor={[
                    value === true
                        ? COLORS.ACTIVE
                        : COLORS.DEFAULT
                ]}
                ios_backgroundColor={COLORS.BLOCK}
                trackColor={{
                    true: COLORS.ACTIVE,
                    false: COLORS.DEFAULT
                }}
                {...props}
            />
        );
    }
}

export default MkSwitch;
