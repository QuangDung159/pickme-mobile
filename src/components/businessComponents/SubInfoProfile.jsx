import { IconFamily, Theme } from '@constants/index';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import ListServiceDisplay from './ListServiceDisplay';
import ProfileInfoItem from './ProfileInfoItem';

const {
    SIZES,
} = Theme;

export default function SubInfoProfile({ user }) {
    return (
        <View
            style={{
                width: SIZES.WIDTH_MAIN,
                alignSelf: 'center',
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    width: '100%',
                }}
            >
                <View
                    style={{
                        width: '50%',
                    }}
                >
                    <ProfileInfoItem
                        fontSize={SIZES.FONT_H3}
                        iconName="home"
                        iconFamily={IconFamily.FONT_AWESOME_5}
                        content={`${user.homeTown || 'N/a'}`}
                        iconSize={16}
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '50%',
                    }}
                >
                    <ProfileInfoItem
                        fontSize={SIZES.FONT_H3}
                        iconName={user.isMale ? 'male' : 'female'}
                        iconFamily={IconFamily.FONTISTO}
                        content={`${user.isMale ? 'Nam' : 'Nữ'}`}
                        iconSize={16}
                    />
                    <ProfileInfoItem
                        fontSize={SIZES.FONT_H3}
                        iconName="birthday-cake"
                        iconFamily={IconFamily.FONT_AWESOME}
                        content={moment(user.dob).format('YYYY').toString().toLowerCase() !== 'invalid date'
                            ? moment(user.dob).format('YYYY').toString()
                            : '1990'}
                        iconSize={16}
                    />
                </View>
            </View>
            <ListServiceDisplay userServices={user?.interests || []} />
        </View>
    );
}

SubInfoProfile.propTypes = {
    user: PropTypes.object.isRequired
};
