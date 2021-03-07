import moment from 'moment';
import React, { PureComponent } from 'react';
import { IconFamily, NowTheme } from '../../constants';
import ProfileInfoItem from './ProfileInfoItem';

class SubInfoProfile extends PureComponent {
    render() {
        const { user } = this.props;

        return (
            <>
                {/* <ProfileInfoItem
                    fontSize={NowTheme.SIZES.FONT_18}
                    iconName="location"
                    IconFamily={IconFamily.ENTYPO}
                    content={`Sống tại ${user.address}`}
                /> */}
                <ProfileInfoItem
                    fontSize={NowTheme.SIZES.FONT_18}
                    iconName="human-male-height"
                    IconFamily={IconFamily.MATERIAL_COMMUNITY_ICONS}
                    content={`${user.height} cm`}
                />
                <ProfileInfoItem
                    fontSize={NowTheme.SIZES.FONT_18}
                    iconName="birthday-cake"
                    IconFamily={IconFamily.FONT_AWESOME}
                    content={moment(user.dob).format('DD-MM-YYYY').toString()}
                />
                {/* <ProfileInfoItem
                    fontSize={NowTheme.SIZES.FONT_18}
                    iconName="home"
                    IconFamily={IconFamily.FONT_AWESOME}
                    content={user.hometown}
                /> */}
            </>
        );
    }
}

export default SubInfoProfile;
