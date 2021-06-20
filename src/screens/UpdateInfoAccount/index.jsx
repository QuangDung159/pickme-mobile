import { TopTabBar } from '@components/uiComponents';
import { ScreenName } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import React, { useEffect, useState } from 'react';
import { SceneMap } from 'react-native-tab-view';
import { useSelector } from 'react-redux';
import ChangePasswordForm from './ChangePasswordForm';
import UpdateInfoForm from './UpdateInfoForm';

export default function UpdateInfoAccount({ navigation }) {
    const [tabActiveIndex, setTabActiveIndex] = useState(0);
    const [routes] = React.useState([
        { key: 'updateInfoForm', title: 'Thông tin\ncá nhân' },
        { key: 'changePasswordForm', title: 'Đổi mật khẩu' },
    ]);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

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
    const renderUpdateInfoFormRoute = () => (
        <UpdateInfoForm navigation={navigation} />
    );

    const renderChangePasswordForm = () => (
        <ChangePasswordForm navigation={navigation} />
    );

    const renderScene = SceneMap({
        updateInfoForm: renderUpdateInfoFormRoute,
        changePasswordForm: renderChangePasswordForm,
    });

    try {
        return (
            <TopTabBar
                routes={routes}
                renderScene={renderScene}
                tabActiveIndex={tabActiveIndex}
                setTabActiveIndex={setTabActiveIndex}
            />
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
