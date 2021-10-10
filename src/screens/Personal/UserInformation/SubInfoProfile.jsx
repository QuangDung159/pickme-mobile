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
                flexDirection: 'column'
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    width: SIZES.WIDTH_BASE * 0.6,
                    marginTop: 15
                }}
            >
                <View
                    style={{
                        flex: 1
                    }}
                >
                    <ProfileInfoItem
                        fontSize={SIZES.FONT_H3}
                        iconName={user.isMale ? 'male' : 'female'}
                        iconFamily={IconFamily.FONTISTO}
                        content={`${user.isMale ? 'Nam' : 'Nữ'}`}
                    />
                    <ProfileInfoItem
                        fontSize={SIZES.FONT_H3}
                        iconName="weight"
                        iconFamily={IconFamily.FONT_AWESOME_5}
                        content={`${user.weight} kg`}
                    />
                </View>

                <View
                    style={{
                        flex: 1
                    }}
                >
                    <ProfileInfoItem
                        fontSize={SIZES.FONT_H3}
                        iconName="birthday-cake"
                        iconFamily={IconFamily.FONT_AWESOME}
                        content={moment(user.dob).format('YYYY').toString()}
                    />
                    <ProfileInfoItem
                        fontSize={SIZES.FONT_H3}
                        iconName="human-male-height"
                        iconFamily={IconFamily.MATERIAL_COMMUNITY_ICONS}
                        content={`${user.height} cm`}
                    />

                </View>
            </View>
            <ProfileInfoItem
                fontSize={SIZES.FONT_H3}
                iconName="home"
                iconFamily={IconFamily.FONT_AWESOME_5}
                content={`${user.homeTown}`}
            />
            <ProfileInfoItem
                fontSize={SIZES.FONT_H3}
                iconName="badminton"
                iconFamily={IconFamily.MATERIAL_COMMUNITY_ICONS}
                content={`${user.interests}`}
            />
        </View>
    );
}

SubInfoProfile.propTypes = {
    user: PropTypes.object.isRequired
};
