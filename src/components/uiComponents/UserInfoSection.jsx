import React from 'react';
import UserInfoItem from './UserInfoItem';

export default function UserInfoSection({ listUserInfo }) {
    return (
        <>
            {listUserInfo.map(({ value, icon }) => (
                <UserInfoItem value={value} icon={icon} key={icon.name} />
            ))}
        </>
    );
}
