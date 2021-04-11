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
                    iconName="human-male-height"
                    iconFamily={IconFamily.MATERIAL_COMMUNITY_ICONS}
                    content={`${user.height} cm`}
                />
                <ProfileInfoItem
                    fontSize={NowTheme.SIZES.FONT_H2}
                    iconName="birthday-cake"
                    iconFamily={IconFamily.FONT_AWESOME}
                    content={moment(user.dob).format('YYYY').toString()}
                />

            </Block>

            <Block
                flex={1}
            >
                <ProfileInfoItem
                    fontSize={NowTheme.SIZES.FONT_H2}
                    iconName="diamond"
                    iconFamily={IconFamily.SIMPLE_LINE_ICONS}
                    content={user.walletAmount + 1000}
                />
                <ProfileInfoItem
                    fontSize={NowTheme.SIZES.FONT_H2}
                    iconName="weight"
                    iconFamily={IconFamily.FONT_AWESOME_5}
                    content="45 kg"
                />

            </Block>
        </Block>
    );
}

SubInfoProfile.propTypes = {
    user: PropTypes.object.isRequired
};
