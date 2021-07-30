import PropTypes from 'prop-types';
import React from 'react';
import { Text, View } from 'react-native';
import { Theme } from '../../../constants';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function ProfileInfoItem({
    label, value
}) {
    let handleValue = value;
    if (value === null || value === undefined || value.toString() === '') {
        handleValue = 'N/a';
    }
    return (
        <View
            style={{
                margin: 5,
                flexDirection: 'row'
            }}
        >
            <Text
                style={{
                    fontFamily: TEXT_REGULAR,
                    fontSize: SIZES.FONT_H2,
                    color: COLORS.DEFAULT,
                }}

            >
                {`${label}: `}
            </Text>

            <Text
                style={{
                    fontFamily: TEXT_BOLD,
                    fontSize: SIZES.FONT_H2,
                    color: COLORS.ACTIVE,
                }}
            >
                {handleValue}
            </Text>
        </View>
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
