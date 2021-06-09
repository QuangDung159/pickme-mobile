import {
    Block, Text
} from 'galio-framework';
import PropTypes from 'prop-types';
import React from 'react';
import { NowTheme } from '../../../constants';

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
                style={{ fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR }}
                size={NowTheme.SIZES.FONT_H2}
                color={NowTheme.COLORS.DEFAULT}
            >
                {`${label}: `}
            </Text>

            <Text
                size={NowTheme.SIZES.FONT_H2}
                color={NowTheme.COLORS.ACTIVE}
                style={{
                    fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
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
