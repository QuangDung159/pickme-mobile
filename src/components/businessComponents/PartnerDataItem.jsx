import { CustomText } from '@components/uiComponents';
import { Theme } from '@constants/index';
import React from 'react';
import { View } from 'react-native';

const {
    FONT: {
        TEXT_BOLD,
    },
    SIZES,
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
                <CustomText
                    style={{
                        fontFamily: TEXT_BOLD,
                        fontSize: SIZES.FONT_H3,
                    }}
                    text={dataRow.label}
                />
                <CustomText
                    style={{
                        fontFamily: TEXT_BOLD,
                        fontSize: SIZES.FONT_H3,
                    }}
                    text={handleValue}
                />
            </View>
        </View>
    );
}
