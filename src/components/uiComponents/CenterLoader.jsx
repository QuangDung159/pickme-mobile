import { Block, Text } from 'galio-framework';
import React, { PureComponent } from 'react';
import { ActivityIndicator } from 'react-native';
import { NowTheme } from '../../constants';

export default class CenterLoader extends PureComponent {
    render() {
        const { size, content } = this.props;
        return (
            <Block
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
                {content && (
                    <Block
                        style={{
                            width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                            marginBottom: 15
                        }}
                    >
                        <Text
                            color={NowTheme.COLORS.ACTIVE}
                            size={NowTheme.SIZES.FONT_H3}
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                textAlign: 'center',
                            }}
                        >
                            {content}
                        </Text>
                    </Block>
                )}

                <ActivityIndicator
                    size={size}
                    color={NowTheme.COLORS.ACTIVE}
                />
            </Block>
        );
    }
}
