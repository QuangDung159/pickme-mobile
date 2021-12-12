import Theme from '@constants/Theme';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import CustomText from './CustomText';

const { COLORS, SIZES } = Theme;

export default function OptionItem({
    item, index, handlePressItem, isSelected
}) {
    return (
        <TouchableOpacity
            key={item.value}
            onPress={() => handlePressItem(index)}
            style={{
                borderColor: COLORS.ACTIVE,
                borderWidth: 1,
                borderRadius: 20,
                marginRight: 5,
                marginBottom: 5,
                backgroundColor: isSelected ? COLORS.ACTIVE : COLORS.BASE
            }}
        >
            <CustomText
                style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    color: isSelected ? COLORS.BASE : COLORS.DEFAULT,
                    fontSize: SIZES.FONT_H4
                }}
                text={item.value}
            />
        </TouchableOpacity>
    );
}
