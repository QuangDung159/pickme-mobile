import IconCustom from '@components/uiComponents/IconCustom';
import { IconFamily, Theme } from '@constants/index';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import CustomText from '../CustomText';

const {
    COLORS,
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
                        width: SIZES.WIDTH_MAIN,
                        justifyContent: 'center',
                        alignItems: 'center'
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
                            borderColor: COLORS.ACTIVE,
                            backgroundColor: background,
                            marginRight: 5,
                        },
                        checkboxStyle
                    ]
                }
                onPress={() => {
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
                    width: SIZES.WIDTH_MAIN - 25,
                }}
            >
                <CustomText
                    text={label}
                    style={
                        [
                            {
                                marginLeft: 5,
                                fontSize: SIZES.FONT_H4
                            },
                            labelStyle
                        ]
                    }
                />
            </TouchableOpacity>
        </View>
    );
}
