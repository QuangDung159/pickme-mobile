import { Input } from 'galio-framework';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { IconFamily, NowTheme } from '../../constants';
import IconCustom from './IconCustom';

class ArInput extends PureComponent {
    render() {
        const {
            shadowless, success, error, primary, style, icon
        } = this.props;

        const inputStyles = [
            styles.input,
            !shadowless,
            success && styles.success,
            error && styles.error,
            primary && styles.primary,
            { ...style }
        ];

        return (
            <Input
                placeholder="write something here"
                placeholderTextColor={NowTheme.COLORS.MUTED}
                style={inputStyles}
                color={NowTheme.COLORS.HEADER}
                iconContent={icon ? (
                    <IconCustom
                        size={NowTheme.SIZES.FONT_H4}
                        color={NowTheme.COLORS.ICON}
                        name="link"
                        family={IconFamily.ANT_DESIGN}
                    />
                ) : (null)}
                {...this.props}
            />
        );
    }
}

ArInput.defaultProps = {
    shadowless: false,
    success: false,
    error: false,
    primary: false
};

ArInput.propTypes = {
    shadowless: PropTypes.bool,
    success: PropTypes.bool,
    error: PropTypes.bool,
    primary: PropTypes.bool
};

const styles = StyleSheet.create({
    input: {
        borderColor: NowTheme.COLORS.BORDER,
        height: 44,
        backgroundColor: NowTheme.COLORS.BASE
    },
    success: {
        borderColor: NowTheme.COLORS.INPUT_SUCCESS
    },
    error: {
        borderColor: NowTheme.COLORS.INPUT_ERROR
    },
    primary: {
        borderColor: NowTheme.COLORS.ACTIVE
    },
    shadow: {
        shadowColor: NowTheme.COLORS.BLACK,
        shadowOffset: { width: 0, height: 0.5 },
        shadowRadius: 1,
        shadowOpacity: 0.13,
        elevation: 2,
    }
});

export default ArInput;
