import IconCustom from '@components/uiComponents/IconCustom';
import { IconFamily, NowTheme } from '@constants/index';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const {
    COLORS,
    FONT: {
        MONTSERRAT_REGULAR
    },
    SIZES
} = NowTheme;

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
                            width: SIZES.WIDTH_BASE * 0.77,
                        },
                        containerStyle
                    ]
                }
            >
                <TouchableOpacity
                    style={
                        [
                            {
                                borderWidth: 0.5,
                                width: 20,
                                height: 20,
                                borderRadius: 2,
                                borderColor: COLORS.INPUT,
                                backgroundColor: background,
                                marginRight: 5
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
                            size={18}
                            color={COLORS.BASE}
                        />
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        if (onPressLabel) onPressLabel();
                    }}
                    style={{
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={
                            [
                                {
                                    fontFamily: MONTSERRAT_REGULAR,
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
    };

    return (
        <>
            {renderCustomerCheckbox()}
        </>
    );
}
