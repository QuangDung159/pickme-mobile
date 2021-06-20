import { NowTheme } from '@constants/index';
import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

const {
    FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    }, COLORS
} = NowTheme;

export default class NoteText extends PureComponent {
    render() {
        const {
            title, content, width, iconComponent,
            backgroundColor,
            contentStyle,
        } = this.props;

        return (
            <View
                style={{
                    backgroundColor: backgroundColor || COLORS.LIST_ITEM_BACKGROUND_1,
                    width,
                    alignSelf: 'center',
                    borderRadius: 5,
                }}
            >
                <View
                    style={{
                        margin: 10,
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
                                style={{
                                    fontFamily: MONTSERRAT_BOLD
                                }}
                            >
                                {iconComponent && ' '}
                                {title}
                            </Text>
                        )}
                    </View>
                    <Text
                        style={[
                            {
                                fontFamily: MONTSERRAT_REGULAR,
                                alignSelf: 'center'
                            },
                            contentStyle]}
                    >
                        {content}
                    </Text>
                </View>
            </View>
        );
    }
}
