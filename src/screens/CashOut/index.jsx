import { ScreenName } from '@constants/index';
import React, { useEffect, useState } from 'react';
import { SceneMap } from 'react-native-tab-view';
import { useSelector } from 'react-redux';
import { TopTabBar } from '@components/uiComponents';
import { ToastHelpers } from '@helpers/index';
import { SafeAreaView } from 'react-native';
import BankAccountForm from './BankAccountForm';
import CashOutForm from './CashOutForm';

export default function CashOut({ navigation }) {
    const [tabActiveIndex, setTabActiveIndex] = useState(0);
    const [routes] = React.useState([
        { key: 'bankAccountForm', title: 'Rút tiền' },
        { key: 'cashOutForm', title: 'Tài khoản\nngân hàng' },
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

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const bankAccountFormRoute = () => (
        <CashOutForm navigation={navigation} />
    );

    const cashOutFormRoute = () => (
        <BankAccountForm setTabActiveIndex={(tabActive) => setTabActiveIndex(tabActive)} />
    );

    const renderScene = SceneMap({
        bankAccountForm: bankAccountFormRoute,
        cashOutForm: cashOutFormRoute,
    });

    try {
        return (
            <SafeAreaView
                style={{
                    flex: 1
                }}
            >
                <TopTabBar
                    routes={routes}
                    renderScene={renderScene}
                    tabActiveIndex={tabActiveIndex}
                    setTabActiveIndex={setTabActiveIndex}
                />
            </SafeAreaView>
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
