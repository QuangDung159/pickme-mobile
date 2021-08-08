import { IconCustom } from '@components/uiComponents';
import { Theme } from '@constants/index';
import React from 'react';
import { Text, View } from 'react-native';

const {
    FONT: {
        TEXT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;

export default function UserInfoItem({
    value, icon: {
        name, family, color, size
    },
}) {
    let handleValue = value;
    if (value === undefined || value === null || value.toString() === '') {
        handleValue = 'N/a';
    }

    return (
        <View
            style={{
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center'
            }}
        >
            <View
                style={{
                    marginRight: 5
                }}
            >
                <IconCustom
                    name={name}
                    family={family}
                    color={color}
                    size={size}
                />
            </View>
            <View
                style={{
                    flexDirection: 'row'
                }}
            >
                <Text
                    style={{
                        fontFamily: TEXT_REGULAR,
                        fontSize: SIZES.FONT_H2,
                        color: COLORS.DEFAULT,
                        marginLeft: 10
                    }}
                >
                    {handleValue}
                </Text>
            </View>
        </View>
    );
}
