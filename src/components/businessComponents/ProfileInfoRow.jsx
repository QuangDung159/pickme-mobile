import { Block } from 'galio-framework';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NowTheme } from '../../constants';
import ProfileInfoItem from './ProfileInfoItem';

export default function ProfileInfoRow({
    listProfileInfo,
    style
}) {
    return (
        <Block style={[
            styles.info,
            style
        ]}
        >
            <Block row space="around">
                {listProfileInfo.map(({ value, label }) => (
                    <ProfileInfoItem
                        value={value}
                        label={label}
                        key={label}
                    />
                ))}

            </Block>
        </Block>
    );
}

const styles = StyleSheet.create({
    subInfoText: {
        marginBottom: 4,
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
        color: NowTheme.COLORS.ACTIVE
    },
    subInfoItemContainer: {
        width: NowTheme.SIZES.WIDTH_BASE * 0.3
    },
    info: {
        paddingHorizontal: 10,
        marginBottom: 20,
        marginTop: -13
    },
});
