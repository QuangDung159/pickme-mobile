import {
    Block, Text
} from 'galio-framework';
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { NowTheme } from '../../constants';
import { IconCustom } from '../uiComponents';

export default class ProfileInfoItem extends PureComponent {
    render() {
        const {
            iconName,
            IconFamily,
            iconSize,
            iconColor,
            content,
            fontSize,
        } = this.props;
        return (
            <Block
                row
                style={[styles.container, {
                    alignItems: 'center'
                }]}
            >
                <IconCustom
                    name={iconName}
                    family={IconFamily}
                    size={iconSize ?? NowTheme.SIZES.BASE * 1.375}
                    color={iconColor ?? NowTheme.COLORS.DEFAULT}
                />
                <Text
                    size={fontSize}
                    muted
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        zIndex: 2,
                        lineHeight: 25,
                        color: NowTheme.COLORS.DEFAULT,
                        paddingHorizontal: 15
                    }}
                >
                    {content}
                </Text>
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 5
    },
});
