import React from 'react';
import { Text, View } from 'react-native';
import { IconCustom } from '../../../components/uiComponents';
import { NowTheme } from '../../../constants';

const {
    FONT: {
        MONTSERRAT_REGULAR,
    },
    SIZES,
    COLORS
} = NowTheme;

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
                flexDirection: 'row'
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
                        fontFamily: MONTSERRAT_REGULAR,
                        fontSize: SIZES.FONT_H2,
                        color: COLORS.DEFAULT
                    }}
                >
                    {handleValue}
                </Text>
            </View>
        </View>
    );
}
