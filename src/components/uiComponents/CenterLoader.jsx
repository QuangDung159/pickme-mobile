import { NowTheme } from '@constants/index';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const { COLORS } = NowTheme;

export default function CenterLoader({ size }) {
    return (
        <View
            style={{
                zIndex: 1,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <ActivityIndicator
                size={size}
                color={COLORS.ACTIVE}
            />
        </View>
    );
}
