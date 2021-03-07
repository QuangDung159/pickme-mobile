/* eslint-disable react/jsx-props-no-spreading */
import { Button } from 'galio-framework';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { NowTheme } from '../../constants';

class ArButton extends PureComponent {
    render() {
        const {
            small, shadowless, children, color, style, fontSize, round, fontFamily, fontColor, ...props
        } = this.props;

        const buttonStyles = [
            small && styles.smallButton,
            { backgroundColor: color },
            round && { borderRadius: NowTheme.SIZES.BASE * 2 },
            !shadowless && styles.shadow,
            { ...style }
        ];

        return (
            <Button
                style={buttonStyles}
                shadowless
                textStyle={{
                    fontSize: fontSize || 12,
                    fontWeight: '700',
                    fontFamily: fontFamily || NowTheme.FONT.MONTSERRAT_REGULAR,
                    color: fontColor || NowTheme.COLORS.ACTIVE
                }}
                {...props}
            >
                {children}
            </Button>
        );
    }
}

ArButton.propTypes = {
    small: PropTypes.bool,
    shadowless: PropTypes.bool,
    color: PropTypes.string
};

ArButton.defaultProps = {
    small: false,
    shadowless: true,
    color: NowTheme.COLORS.DEFAULT
};

const styles = StyleSheet.create({
    smallButton: {
        width: 75,
        height: 28
    }
});

export default ArButton;
