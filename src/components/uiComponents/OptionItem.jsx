import Theme from '@constants/Theme';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import CustomText from './CustomText';

const { COLORS } = Theme;

export default function OptionItem({ item, index, handlePressItem }) {
    return (
        <TouchableOpacity
            key={item.value}
            onPress={() => handlePressItem(index)}
            style={{
                borderColor: COLORS.ACTIVE,
                borderWidth: 1,
                borderRadius: 20,
                marginRight: 10,
                marginBottom: 10,
                backgroundColor: item.selected ? COLORS.ACTIVE : COLORS.BASE
            }}
        >
            <CustomText
                style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    color: item.selected ? COLORS.BASE : COLORS.DEFAULT
                }}
                text={item.value}
            />
        </TouchableOpacity>
    );
}
