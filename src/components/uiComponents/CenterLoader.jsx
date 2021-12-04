import { Theme } from '@constants/index';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const { COLORS } = Theme;

export default function ImageLoader({ size, containerStyle }) {
    return (
        <View
            style={[{
                zIndex: 1,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.TRANSPARENT,
            }, containerStyle]}
        >
            <ActivityIndicator
                size={size || 'small'}
                color={COLORS.ACTIVE}
            />
        </View>
    );
}
