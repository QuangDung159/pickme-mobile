import { IconCustom } from '@components/uiComponents';
import { IconFamily, Theme } from '@constants/index';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const {
    FONT: {
        TEXT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;
export default function ProfileInfoItem({
    iconName,
    iconFamily,
    iconSize,
    iconColor,
    content,
    fontSize,
}) {
    return (
        <View
            style={styles.container}
        >
            <IconCustom
                name={iconName}
                family={iconFamily}
                size={iconSize ?? SIZES.BASE * 1.375}
                color={iconColor ?? COLORS.DEFAULT}
            />
            <Text
                muted
                style={{
                    fontFamily: TEXT_REGULAR,
                    zIndex: 2,
                    lineHeight: 25,
                    color: COLORS.DEFAULT,
                    paddingHorizontal: 15,
                    fontSize
                }}
            >
                {content}
            </Text>
        </View>
    );
}

ProfileInfoItem.propTypes = {
    iconName: PropTypes.string,
    iconFamily: PropTypes.string,
    iconSize: PropTypes.number,
    iconColor: PropTypes.string,
    fontSize: PropTypes.number
};

ProfileInfoItem.defaultProps = {
    iconName: 'home',
    iconSize: 24,
    iconFamily: IconFamily.FONT_AWESOME,
    iconColor: COLORS.ACTIVE,
    fontSize: 24
};

const styles = StyleSheet.create({
    container: {
        margin: 5,
        flexDirection: 'row'
    },
});
