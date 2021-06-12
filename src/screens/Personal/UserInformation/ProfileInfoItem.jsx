import {
    Block, Text
} from 'galio-framework';
import PropTypes from 'prop-types';
import React from 'react';
import { NowTheme } from '../../../constants';

const {
    FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = NowTheme;

export default function ProfileInfoItem({
    label, value
}) {
    let handleValue = value;
    if (value === null || value === undefined || value.toString() === '') {
        handleValue = 'N/a';
    }
    return (
        <Block
            style={{
                margin: 5
            }}
            row
        >
            <Text
                style={{ fontFamily: MONTSERRAT_REGULAR }}
                size={SIZES.FONT_H2}
                color={COLORS.DEFAULT}
            >
                {`${label}: `}
            </Text>

            <Text
                size={SIZES.FONT_H2}
                color={COLORS.ACTIVE}
                style={{
                    fontFamily: MONTSERRAT_BOLD
                }}
            >
                {handleValue}
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
