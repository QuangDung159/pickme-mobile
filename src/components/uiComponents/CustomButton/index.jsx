import IconCustom from '@components/uiComponents/IconCustom';
import { IconFamily, Theme } from '@constants/index';
import PropTypes from 'prop-types';
import React from 'react';
import {
    StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

CustomButton.propTypes = {
    label: PropTypes.string,
    labelStyle: PropTypes.object,
    buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    leftIcon: PropTypes.object,
    onPressLeftIcon: PropTypes.func,
    type: PropTypes.oneOf(['active', 'default'])
};

CustomButton.defaultProps = {
    label: '',
    labelStyle: {},
    buttonStyle: {},
    leftIcon: null,
    onPressLeftIcon: null,
    type: null
};

export default function CustomButton(
    {
        label,
        labelStyle,
        buttonStyle,
        leftIcon,
        onPressLeftIcon,
        type,
        ...props
    }
) {
    const renderButtonBase = () => (
        <TouchableOpacity
            underlayColor="transparent"
            {...props}
            style={
                [
                    styles.baseButtonStyle,
                    {
                        width: SIZES.WIDTH_BASE * 0.9,
                    },
                    buttonStyle,
                ]
            }
        >
            <Text
                style={
                    [
                        {
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            color: COLORS.ACTIVE
                        },
                        labelStyle
                    ]
                }
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    const renderButtonByType = () => {
        if (type) {
            const colorByType = type === 'active' ? COLORS.ACTIVE : COLORS.DEFAULT;

            return (
                <TouchableOpacity
                    underlayColor="transparent"
                    {...props}
                    style={
                        [
                            styles.baseButtonStyle,
                            {
                                width: SIZES.WIDTH_BASE * 0.44,
                                borderColor: colorByType,
                            },
                            buttonStyle,
                        ]
                    }
                >
                    <Text
                        style={
                            [
                                {
                                    fontSize: SIZES.FONT_H3,
                                    fontFamily: TEXT_BOLD,
                                    color: colorByType,
                                },
                                labelStyle
                            ]
                        }
                    >
                        {label}
                    </Text>
                </TouchableOpacity>
            );
        }

        return (
            <>
                {renderButtonBase()}
            </>
        );
    };

    const renderButtonByLeft = () => {
        const {
            size, color, name, family
        } = leftIcon;
        return (
            <TouchableOpacity
                underlayColor="transparent"
                {...props}
                style={
                    [
                        {
                            height: 40,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            backgroundColor: COLORS.TRANSPARENT,
                            width: SIZES.WIDTH_BASE * 0.9,
                        },
                        buttonStyle,
                    ]
                }
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <IconCustom
                        name={name || 'home'}
                        family={family || IconFamily.FONT_AWESOME}
                        size={size || 24}
                        color={color || COLORS.DEFAULT}
                    />
                    <Text
                        style={
                            [
                                {
                                    fontFamily: TEXT_REGULAR,
                                    fontSize: SIZES.FONT_H3,
                                    color: COLORS.DEFAULT,
                                    marginLeft: 10
                                },
                                labelStyle
                            ]
                        }
                    >
                        {label}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            {leftIcon ? (
                <>
                    {renderButtonByLeft()}
                </>
            ) : (
                <>
                    {renderButtonByType()}
                </>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    baseButtonStyle: {
        borderWidth: 1,
        borderRadius: 8,
        height: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.TRANSPARENT,
        width: SIZES.WIDTH_BASE * 0.8,
        borderColor: COLORS.ACTIVE
    }
});
