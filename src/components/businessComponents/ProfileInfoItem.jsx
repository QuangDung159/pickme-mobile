import {
    Block, Text
} from 'galio-framework';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NowTheme } from '../../constants';

export default function ProfileInfoItem({
    label, value
}) {
    return (
        <Block
            middle
            style={styles.subInfoItemContainer}
        >
            <Text
                size={NowTheme.SIZES.FONT_H2}
                color={NowTheme.COLORS.DEFAULT}
                style={styles.subInfoText}
            >
                {value}
            </Text>
            <Text
                style={{ fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR }}
                size={NowTheme.SIZES.FONT_H4}
                color={NowTheme.COLORS.DEFAULT}
            >
                {label}
            </Text>
        </Block>
    );
}

ProfileInfoItem.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
};

ProfileInfoItem.defaultProps = {
    label: 'label',
    value: 'N/a',
};

const styles = StyleSheet.create({
    subInfoText: {
        marginBottom: 4,
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
        color: NowTheme.COLORS.ACTIVE
    },
    subInfoItemContainer: {
        width: NowTheme.SIZES.WIDTH_BASE * 0.3
    }
});
