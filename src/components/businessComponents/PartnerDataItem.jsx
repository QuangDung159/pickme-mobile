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
    dataRow
}) {
    let handleValue = dataRow.value;
    if (dataRow.value === undefined || dataRow.value === null || dataRow.value.toString() === '') {
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
                    alignItems: 'center'
                }}
            >
                <Text
                    style={{
                        fontFamily: TEXT_BOLD,
                        fontSize: SIZES.FONT_H3,
                        color: COLORS.ACTIVE,
                    }}
                >
                    {dataRow.label}
                </Text>
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
