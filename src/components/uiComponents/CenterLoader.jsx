import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { NowTheme } from '../../constants';
import { ToastHelpers } from '../../helpers';

export default function CenterLoader({ size, content }) {
    try {
        return (
            <View
                style={{
                    zIndex: 1,
                    width: NowTheme.SIZES.WIDTH_BASE,
                    height: NowTheme.SIZES.HEIGHT_BASE * 0.8,
                    justifyContent: 'center',
                }}
            >
                <ActivityIndicator
                    size={size}
                    color={NowTheme.COLORS.ACTIVE}
                />
                {content && (
                    <Text
                        style={{
                            color: NowTheme.COLORS.ACTIVE,
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                            fontSize: NowTheme.SIZES.FONT_H3,
                            textAlign: 'center',
                            padding: 10
                        }}
                    >
                        {content}
                    </Text>
                )}
            </View>
        );
    } catch (exception) {
        console.log('exception :>> ', exception);
        return (
            <>
                {ToastHelpers.renderToast()}
            </>
        );
    }
}
