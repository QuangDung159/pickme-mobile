import { TouchableText } from '@components/uiComponents';
import Theme from '@constants/Theme';
import React from 'react';

const {
    FONT: {
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function BecomePartnerText({ onPress }) {
    return (
        <TouchableText
            text={'Cải thiện thu nhập?\nHãy trở thành host của PickMe'}
            style={{
                color: COLORS.ACTIVE,
                fontSize: SIZES.FONT_H3,
                textAlign: 'center',
                fontFamily: TEXT_BOLD,
                marginTop: 20,
                marginBottom: 5
            }}
            onPress={() => onPress()}
        />
    );
}
