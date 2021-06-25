import { NowTheme } from '@constants/index';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const { COLORS, SIZES } = NowTheme;

export default function CenterLoader({ size, isShow = false }) {
    return (
        <>
            {isShow && (
                <View
                    style={{
                        zIndex: 99,
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: SIZES.HEIGHT_BASE,
                        width: SIZES.WIDTH_BASE,
                        backgroundColor: COLORS.BASE
                    }}
                >
                    <ActivityIndicator
                        size={size || 'small'}
                        color={COLORS.ACTIVE}
                        style={{
                            marginTop: -SIZES.HEIGHT_BASE * 0.2
                        }}
                    />
                </View>
            )}
        </>
    );
}
