import { TopTabBar } from '@components/uiComponents';
import { ScreenName } from '@constants/index';
import { setPersonTabActiveIndex } from '@redux/Actions';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { SceneMap } from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';
import BookingList from './BookingList';
import UserInformation from './UserInformation';
import Wallet from './Wallet';

export default function Personal({ navigation }) {
    const [routes] = React.useState([
        { key: 'userInformation', title: 'Cá nhân' },
        { key: 'wallet', title: 'Ví tiền' },
        { key: 'bookingList', title: 'Đơn hẹn' },
    ]);

    const personTabActiveIndex = useSelector((state) => state.appConfigReducer.personTabActiveIndex);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

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

    const UserInformationRoute = () => (
        <UserInformation navigation={navigation} />
    );

    const WalletRoute = () => (
        <Wallet navigation={navigation} />
    );

    const BookingListRoute = () => (
        <BookingList navigation={navigation} />
    );

    const renderScene = SceneMap({
        userInformation: UserInformationRoute,
        wallet: WalletRoute,
        bookingList: BookingListRoute
    });

    // Render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    return (
        <SafeAreaView
            style={{
                flex: 1,
            }}
        >
            <TopTabBar
                routes={routes}
                renderScene={renderScene}
                tabActiveIndex={personTabActiveIndex}
                setTabActiveIndex={(index) => {
                    dispatch(setPersonTabActiveIndex(index));
                }}
            />
        </SafeAreaView>
    );
}
