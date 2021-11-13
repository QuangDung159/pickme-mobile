import React from 'react';
import { View } from 'react-native';
import PartnerDataItem from './PartnerDataItem';

export default function PartnerDataSection({ listData }) {
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            {listData?.map(({ value }) => (
                <PartnerDataItem value={value} key={`${value}${Date()}`} />
            ))}
        </View>
    );
}
