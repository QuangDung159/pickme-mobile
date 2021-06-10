import { Block } from 'galio-framework';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NowTheme } from '../../constants';

export default function IndicatorVerticalLine({
    active
}) {
    return (
        <Block
            middle
            style={styles.stepIndicatorContainer}
        >
            <Block
                style={{
                    height: 6,
                    borderLeftWidth: 3,
                    borderColor: active ? NowTheme.COLORS.ACTIVE : NowTheme.COLORS.INPUT,
                    justifyContent: 'center'
                }}
            />
        </Block>
    );
}

IndicatorVerticalLine.propTypes = {
    active: PropTypes.bool
};

IndicatorVerticalLine.defaultProps = {
    active: true
};

const styles = StyleSheet.create({
    stepIndicatorContainer: {
        width: 30,
    }
});
