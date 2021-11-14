import IconCustom from '@components/uiComponents/IconCustom';
import { IconFamily, Theme } from '@constants/index';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

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
    defaultChecked, onPressLabel
}) {
    const [checked, setChecked] = useState(false);

    const renderCustomerCheckbox = () => {
        let background = COLORS.BASE;
        let active = false;
        if (defaultChecked) {
            background = defaultChecked || checked ? COLORS.ACTIVE : COLORS.TRANSPARENT;
            active = defaultChecked || checked;
        } else {
            background = checked ? COLORS.ACTIVE : COLORS.TRANSPARENT;
            active = checked;
        }

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
                                borderColor: active ? COLORS.ACTIVE : COLORS.INPUT,
                                backgroundColor: background,
                                marginRight: 5,
                            },
                            checkboxStyle
                        ]
                    }
                    onPress={() => {
                        setChecked(!checked);
                        if (onChange) onChange(!checked);
                    }}
                >
                    {active && (
                        <IconCustom
                            name="check"
                            family={IconFamily.ENTYPO}
                            size={16}
                            color={COLORS.BASE}
                        />
                    )}
                </TouchableOpacity>
                <TouchableWithoutFeedback
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
                </TouchableWithoutFeedback>
            </View>
        );
    };

    return (
        <>
            {renderCustomerCheckbox()}
        </>
    );
}
