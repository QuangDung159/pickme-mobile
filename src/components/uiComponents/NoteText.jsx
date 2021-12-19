import { Theme } from '@constants/index';
import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    }, COLORS,
    SIZES
} = Theme;

export default class NoteText extends PureComponent {
    render() {
        const {
            title, content, width, iconComponent,
            backgroundColor,
            contentStyle,
            iconComponentRight, titleStyle, containerStyle
        } = this.props;

        return (
            <View
                style={[
                    {
                        backgroundColor: backgroundColor || COLORS.BASE,
                        width,
                        alignSelf: 'center',
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: COLORS.ACTIVE
                    }, containerStyle
                ]}
            >
                <View
                    style={{
                        marginVertical: 5,
                        marginHorizontal: 10
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row'
                        }}
                    >
                        {iconComponent}
                        {title && (
                            <Text
                                style={[
                                    {
                                        fontFamily: TEXT_BOLD,
                                        color: COLORS.DEFAULT,
                                        fontSize: SIZES.FONT_H3
                                    }, titleStyle
                                ]}
                            >
                                {iconComponent && ' '}
                                {title}
                            </Text>
                        )}
                        {iconComponentRight}
                    </View>
                    <Text
                        style={
                            [
                                {
                                    fontFamily: TEXT_REGULAR,
                                    alignSelf: 'center',
                                    color: COLORS.DEFAULT
                                },
                                contentStyle
                            ]
                        }
                    >
                        {content}
                    </Text>
                </View>
            </View>
        );
    }
}
