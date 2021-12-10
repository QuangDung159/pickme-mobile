import IconCustom from '@components/uiComponents/IconCustom';
import { IconFamily, Theme } from '@constants/index';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const {
    COLORS,
    FONT: {
        TEXT_REGULAR
    },
    SIZES
} = Theme;

export default function CustomCheckbox({
    containerStyle,
    checkboxStyle,
    labelStyle,
    label,
    onChange,
    isChecked,
    onPressLabel
}) {
    const background = isChecked ? COLORS.ACTIVE : COLORS.TRANSPARENT;

    return (
        <View
            style={
                [
                    {
                        flexDirection: 'row',
                        alignSelf: 'center',
                        width: SIZES.WIDTH_BASE * 0.9,
                    },
                    containerStyle
                ]
            }
        >
            <TouchableOpacity
                style={
                    [
                        {
                            borderWidth: 2,
                            width: 20,
                            height: 20,
                            borderRadius: 2,
                            borderColor: isChecked ? COLORS.ACTIVE : COLORS.INPUT,
                            backgroundColor: background,
                            marginRight: 5,
                        },
                        checkboxStyle
                    ]
                }
                onPress={() => {
                    // Alert.alert('before: ' + isChecked)
                    if (onChange) onChange(!isChecked);
                }}
            >
                {isChecked && (
                    <IconCustom
                        name="check"
                        family={IconFamily.ENTYPO}
                        size={16}
                        color={COLORS.BASE}
                    />
                )}
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    if (onPressLabel) onPressLabel();
                }}
                style={{
                    justifyContent: 'center',
                    width: SIZES.WIDTH_BASE * 0.9 - 25,
                }}
            >
                <Text
                    style={
                        [
                            {
                                fontFamily: TEXT_REGULAR,
                                fontSize: SIZES.FONT_H4,
                                color: COLORS.DEFAULT,
                                marginLeft: 5,
                            },
                            labelStyle
                        ]
                    }
                >
                    {label}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
