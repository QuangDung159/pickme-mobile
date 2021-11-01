/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import UserDetail from '@components/businessComponents/UserDetail';
import {
    CenterLoader
} from '@components/uiComponents';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function UserInformation({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

    // Render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    return (
        <>
            {isShowSpinner ? (
                <CenterLoader />
            ) : (
                <UserDetail
                    navigation={navigation}
                    userInfo={currentUser}
                    setIsShowSpinner={(showSpinner) => setIsShowSpinner(showSpinner)}
                />
            )}
        </>
    );
}
