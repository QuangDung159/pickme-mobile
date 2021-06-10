import PropTypes from 'prop-types';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { IconFamily, NowTheme } from '../../../constants';
import IconCustom from '../IconCustom';

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
    const baseButtonStyle = {
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: NowTheme.COLORS.TRANSPARENT,
    };

    const renderButtonBase = () => (
        <TouchableHighlight
            underlayColor="transparent"
            {...props}
            style={
                [
                    baseButtonStyle,
                    {
                        borderColor: NowTheme.COLORS.DEFAULT,
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                    },
                    buttonStyle,
                ]
            }
        >
            <Text
                style={
                    [
                        {
                            fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                            fontSize: NowTheme.SIZES.FONT_H2,
                            color: NowTheme.COLORS.DEFAULT
                        },
                        labelStyle
                    ]
                }
            >
                {label}
            </Text>
        </TouchableHighlight>
    );

    const renderButtonByType = () => {
        if (type) {
            const colorByType = type === 'active' ? NowTheme.COLORS.ACTIVE : NowTheme.COLORS.DEFAULT;

            return (
                <TouchableHighlight
                    underlayColor="transparent"
                    {...props}
                    style={
                        [
                            baseButtonStyle,
                            {
                                width: NowTheme.SIZES.WIDTH_BASE * 0.44,
                                borderColor: colorByType
                            },
                            buttonStyle,
                        ]
                    }
                >
                    <Text
                        style={
                            [
                                {
                                    fontSize: NowTheme.SIZES.FONT_H3,
                                    fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                                    color: colorByType
                                },
                                labelStyle
                            ]
                        }
                    >
                        {label}
                    </Text>
                </TouchableHighlight>
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
            <TouchableHighlight
                underlayColor="transparent"
                {...props}
                style={
                    [
                        {
                            height: 40,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            backgroundColor: NowTheme.COLORS.TRANSPARENT,
                            width: NowTheme.SIZES.WIDTH_BASE * 0.9,
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
                        color={color || NowTheme.COLORS.DEFAULT}
                    />
                    <Text
                        style={
                            [
                                {
                                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                    fontSize: NowTheme.SIZES.FONT_H3,
                                    color: NowTheme.COLORS.DEFAULT,
                                    marginLeft: 10
                                },
                                labelStyle
                            ]
                        }
                    >
                        {label}
                    </Text>
                </View>
            </TouchableHighlight>
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
