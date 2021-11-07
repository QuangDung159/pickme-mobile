import { IconCustom } from '@components/uiComponents';
import { IconFamily, Theme } from '@constants/index';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const {
    FONT: {
        TEXT_REGULAR,
    },
    COLORS
} = Theme;
export default function ProfileInfoItem({
    iconName,
    iconFamily,
    iconSize,
    iconColor,
    content,
    fontSize,
    containerStyle,
    iconContainerStyle
}) {
    return (
        <View
            style={[styles.container, containerStyle]}
        >
            <View
                style={[{
                    width: 25
                }, iconContainerStyle]}
            >
                <IconCustom
                    name={iconName}
                    family={iconFamily}
                    size={iconSize}
                    color={iconColor ?? COLORS.DEFAULT}
                />
            </View>
            <Text
                muted
                style={{
                    fontFamily: TEXT_REGULAR,
                    zIndex: 2,
                    lineHeight: 25,
                    color: COLORS.DEFAULT,
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
        flexDirection: 'row',
        alignItems: 'center'
    },
});
