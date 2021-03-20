import { Block } from 'galio-framework';
import React, { PureComponent } from 'react';
import { Text } from 'react-native';
import { NowTheme } from '../../constants';

export default class NoteText extends PureComponent {
    render() {
        const {
            title, content, width, iconComponent,
            backgroundColor,
            contentStyle,
        } = this.props;

        return (
            <Block
                style={{
                    backgroundColor: backgroundColor || NowTheme.COLORS.LIST_ITEM_BACKGROUND_1,
                    width,
                    alignSelf: 'center',
                    borderRadius: 5,
                }}
            >
                <Block
                    style={{
                        margin: 10,
                    }}
                >
                    <Block
                        row
                        style={{
                            alignItems: 'center',
                        }}
                    >
                        {iconComponent}
                        {title && (
                            <Text
                                style={{
                                    fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
                                }}
                            >
                                {iconComponent && ' '}
                                {title}
                            </Text>
                        )}
                    </Block>
                    <Text
                        style={[
                            {
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                alignSelf: 'center'
                            },
                            contentStyle]}
                    >
                        {content}
                    </Text>
                </Block>
            </Block>
        );
    }
}
