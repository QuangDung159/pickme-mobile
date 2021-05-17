import { Block } from 'galio-framework';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { IconFamily, NowTheme } from '../../constants';
import ProfileInfoItem from './ProfileInfoItem';

export default function SubInfoProfile({ user }) {
    return (
        <Block
            row
        >
            <Block
                flex={1}
            >
                <ProfileInfoItem
                    fontSize={NowTheme.SIZES.FONT_H2}
                    iconName="birthday-cake"
                    iconFamily={IconFamily.FONT_AWESOME}
                    content={moment(user.dob).format('YYYY').toString()}
                />
                <ProfileInfoItem
                    fontSize={NowTheme.SIZES.FONT_H2}
                    iconName="home"
                    iconFamily={IconFamily.FONT_AWESOME_5}
                    content={user.homeTown}
                />
            </Block>

            <Block
                flex={1}
            >
                <ProfileInfoItem
                    fontSize={NowTheme.SIZES.FONT_H2}
                    iconName="diamond"
                    iconFamily={IconFamily.SIMPLE_LINE_ICONS}
                    content={user.walletAmount}
                />
                <ProfileInfoItem
                    fontSize={NowTheme.SIZES.FONT_H2}
                    iconName="badminton"
                    iconFamily={IconFamily.MATERIAL_COMMUNITY_ICONS}
                    content={user.interests}
                />
            </Block>
        </Block>
    );
}

SubInfoProfile.propTypes = {
    user: PropTypes.object.isRequired
};
