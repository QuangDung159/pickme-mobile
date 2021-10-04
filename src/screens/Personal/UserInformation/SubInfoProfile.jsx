import { IconFamily, Theme } from '@constants/index';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import ProfileInfoItem from './ProfileInfoItem';

const {
    SIZES,
} = Theme;

export default function SubInfoProfile({ user }) {
    return (
        <View
            style={{
                flexDirection: 'row'
            }}
        >
            <View
                style={{
                    flex: 1
                }}
            >
                <ProfileInfoItem
                    fontSize={SIZES.FONT_H2}
                    iconName="weight"
                    iconFamily={IconFamily.FONT_AWESOME_5}
                    content={`${user.weight} kg`}
                />
                <ProfileInfoItem
                    fontSize={SIZES.FONT_H2}
                    iconName="home"
                    iconFamily={IconFamily.FONT_AWESOME_5}
                    content={`${user.homeTown}`}
                />
            </View>

            <View
                style={{
                    flex: 1
                }}
            >
                <ProfileInfoItem
                    fontSize={SIZES.FONT_H2}
                    iconName="birthday-cake"
                    iconFamily={IconFamily.FONT_AWESOME}
                    content={moment(user.dob).format('YYYY').toString()}
                />
                <ProfileInfoItem
                    fontSize={SIZES.FONT_H2}
                    iconName="human-male-height"
                    iconFamily={IconFamily.MATERIAL_COMMUNITY_ICONS}
                    content={`${user.height} cm`}
                />
            </View>
        </View>
    );
}

SubInfoProfile.propTypes = {
    user: PropTypes.object.isRequired
};
