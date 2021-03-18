import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { IconFamily, NowTheme } from '../../constants';
import ProfileInfoItem from './ProfileInfoItem';

export default function SubInfoProfile({ user }) {
    return (
        <>
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
                content={moment(user.dob).format('DD-MM-YYYY').toString()}
            />
        </>
    );
}

SubInfoProfile.propTypes = {
    user: PropTypes.object.isRequired
};
