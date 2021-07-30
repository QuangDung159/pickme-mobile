import React from 'react';
import { Text, View } from 'react-native';
import { IconCustom } from '../../../components/uiComponents';
import { Theme } from '../../../constants';

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
    }
}) {
    let handleValue = value;
    if (value === null || value === undefined || value.toString() === '') {
        handleValue = 'N/a';
    }

    return (
        <View
            style={{
                alignSelf: 'center',
                marginBottom: 10,
                flexDirection: 'row',
            }}
        >
            <View
                style={{
                    flex: 1
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
                    flexDirection: 'row',
                    flex: 7
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
