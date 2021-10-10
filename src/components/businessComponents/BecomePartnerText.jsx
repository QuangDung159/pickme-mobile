import { TouchableText } from '@components/uiComponents';
import ScreenName from '@constants/ScreenName';
import Theme from '@constants/Theme';
import React from 'react';

const {
    FONT: {
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function BecomePartnerText({ navigation }) {
    return (
        <TouchableText
            text={'Cải thiện thu nhập?\nHãy trở thành đối tác của PickMe'}
            style={{
                color: COLORS.ACTIVE,
                fontSize: SIZES.FONT_H3,
                textAlign: 'center',
                fontFamily: TEXT_BOLD,
                marginTop: 40,
                marginBottom: 10
            }}
            onPress={() => navigation.navigate(ScreenName.PARTNER_REGISTER)}
        />
    );
}
