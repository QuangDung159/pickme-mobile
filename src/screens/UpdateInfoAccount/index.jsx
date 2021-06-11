import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TopTabBar } from '../../components/uiComponents';
import { ScreenName } from '../../constants';
import { ToastHelpers } from '../../helpers';
import ChangePasswordForm from './ChangePasswordForm';
import UpdateInfoForm from './UpdateInfoForm';

export default function UpdateInfoAccount({ navigation }) {
    const [tabActiveIndex, setTabActiveIndex] = useState(0);

    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const tabs = [
        {
            tabLabel: 'Thông tin\ncá nhân',
        },
        {
            tabLabel: 'Đổi mật khẩu',
        }
    ];

    useEffect(
        () => {
            if (isSignInOtherDeviceStore) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: ScreenName.SIGN_IN_WITH_OTP }],
                });
            }
        }, [isSignInOtherDeviceStore]
    );

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderTabByIndex = () => {
        switch (tabActiveIndex) {
            case 0: {
                return (
                    <UpdateInfoForm navigation={navigation} />
                );
            }
            case 1: {
                return (
                    <ChangePasswordForm navigation={navigation} />
                );
            }
            default: {
                return null;
            }
        }
    };

    try {
        return (
            <>
                <TopTabBar
                    tabs={tabs}
                    tabActiveIndex={tabActiveIndex}
                    setTabActiveIndex={(index) => setTabActiveIndex(index)}
                />
                {renderTabByIndex()}
            </>
        );
    } catch (exception) {
        console.log('exception :>> ', exception);
        return (
            <>
                {ToastHelpers.renderToast()}
            </>
        );
    }
}
