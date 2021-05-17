import {
    Block, Text
} from 'galio-framework';
import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { IconFamily, NowTheme } from '../../constants';
import { IconCustom } from '../uiComponents';

export default function ProfileInfoItem({
    iconName,
    iconFamily,
    iconSize,
    iconColor,
    content,
    fontSize,
}) {
    return (
        <Block
            row
            style={[styles.container]}
        >
            <IconCustom
                name={iconName}
                family={iconFamily}
                size={iconSize ?? NowTheme.SIZES.BASE * 1.375}
                color={iconColor ?? NowTheme.COLORS.DEFAULT}
            />
            <Text
                size={fontSize}
                muted
                style={{
                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                    zIndex: 2,
                    lineHeight: 25,
                    color: NowTheme.COLORS.DEFAULT,
                    paddingHorizontal: 15
                }}
            >
                {content}
            </Text>
        </Block>
    );
}

ProfileInfoItem.propTypes = {
    iconName: PropTypes.string,
    iconFamily: PropTypes.string,
    iconSize: PropTypes.number,
    iconColor: PropTypes.string,
    content: PropTypes.string.isRequired,
    fontSize: PropTypes.number
};

ProfileInfoItem.defaultProps = {
    iconName: 'home',
    iconSize: 24,
    iconFamily: IconFamily.FONT_AWESOME,
    iconColor: NowTheme.COLORS.ACTIVE,
    fontSize: 24
};

const styles = StyleSheet.create({
    container: {
        margin: 5
    },
});
