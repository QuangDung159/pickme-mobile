/**
 * Created by Hong HP on 3/31/20.
 */
import Theme from '@constants/Theme';
import React from 'react';
import {
    StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

const {
    COLORS, SIZES, FONT: {
        TEXT_BOLD
    }
} = Theme;

export default function OtpItem({
    code, index, onPress, style, isError
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                style,
                {
                    borderBottomColor: isError ? COLORS.ERROR : COLORS.ACTIVE,
                },
            ]}
        >
            <View style={[styles.wrapper]}>
                <Text
                    style={[
                        styles.textCode,
                        {
                            color: isError ? COLORS.ERROR : COLORS.ACTIVE,
                        },
                    ]}
                >
                    {code[index]}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 40,
        height: 40,
        borderBottomWidth: 2,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 4,
    },
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textCode: {
        fontSize: SIZES.FONT_H1,
        fontFamily: TEXT_BOLD
    },
});
