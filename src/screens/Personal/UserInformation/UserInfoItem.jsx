import { Block, Text } from 'galio-framework';
import React from 'react';
import { IconCustom } from '../../../components/uiComponents';
import { NowTheme } from '../../../constants';

const { FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    }, SIZES, COLORS } = NowTheme;

export default function UserInfoItem({
    value, icon: {
        name, family, color, size
    }
}) {
    let handleValue = value;
    if (value === null || value === undefined || value.toString() === '') {
        handleValue = 'N/a';
    }

    return (
        <Block
            row
            style={{
                alignSelf: 'center',
                marginBottom: 10
            }}
        >
            <Block
                flex={1}
            >
                <IconCustom
                    name={name}
                    family={family}
                    color={color}
                    size={size}
                />
            </Block>
            <Block
                row
                flex={7}
            >
                <Text
                    size={SIZES.FONT_H2}
                    color={COLORS.DEFAULT}
                    style={{
                        fontFamily: MONTSERRAT_REGULAR
                    }}
                >
                    {handleValue}
                </Text>
            </Block>
        </Block>
    );
}
