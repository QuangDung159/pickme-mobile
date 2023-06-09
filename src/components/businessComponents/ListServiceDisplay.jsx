import { OptionItem } from '@components/uiComponents';
import React from 'react';
import { View } from 'react-native';

export default function ListServiceDisplay({ userServices, onPressServiceItem }) {
    const handleList = () => {
        if (!userServices) {
            return [];
        }

        const result = userServices.split(', ');
        result.splice(result.length - 1, 1);
        return result;
    };

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                flexWrap: 'wrap'
            }}
        >
            {handleList().map((item, index) => (
                <OptionItem
                    key={item}
                    item={{ value: item }}
                    index={index}
                    isSelected
                    containerStyle={{
                        marginBottom: 5
                    }}
                    handlePressItem={() => onPressServiceItem && onPressServiceItem(item)}
                />
            ))}
        </View>
    );
}
