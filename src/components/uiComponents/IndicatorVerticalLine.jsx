import { Theme } from '@constants/index';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const { COLORS } = Theme;

export default function IndicatorVerticalLine({
    active
}) {
    return (
        <View
            style={styles.stepIndicatorContainer}
        >
            <View
                style={{
                    height: 6,
                    borderLeftWidth: 3,
                    borderColor: active ? COLORS.ACTIVE : COLORS.INPUT,
                    justifyContent: 'center'
                }}
            />
        </View>
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
        alignItems: 'center'
    }
});
