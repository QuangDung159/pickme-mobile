import { Theme } from '@constants/index';
import React from 'react';
import { Text, View } from 'react-native';

const {
    FONT: {
        TEXT_BOLD,
    },
    SIZES,
    COLORS
} = Theme;

export default function PartnerDataItem({
    value
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
                alignItems: 'center',
            }}
        >
            <View
                style={{
                    flexDirection: 'row'
                }}
            >
                <Text
                    style={{
                        fontFamily: TEXT_BOLD,
                        fontSize: SIZES.FONT_H3,
                        color: COLORS.ACTIVE,
                    }}
                >
                    {handleValue}
                </Text>
            </View>
        </View>
    );
}
