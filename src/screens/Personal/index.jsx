import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { TopTabBar } from '../../components/uiComponents';
import { ScreenName } from '../../constants';
import { setPersonTabActiveIndex } from '../../redux/Actions';
import BookingList from './BookingList';
import UserInformation from './UserInformation';
import Wallet from './Wallet';

export default function Personal({ navigation }) {
    const personTabActiveIndex = useSelector((state) => state.appConfigReducer.personTabActiveIndex);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

    const tabs = [
        {
            tabLabel: 'Cá nhân',
        },
        {
            tabLabel: 'Ví tiền',
        },
        {
            tabLabel: 'Đơn hẹn',
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

    // Render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderTabByIndex = () => {
        switch (personTabActiveIndex) {
            case 0: {
                return (
                    <UserInformation navigation={navigation} />
                );
            }
            case 1: {
                return (
                    <Wallet navigation={navigation} />
                );
            }
            case 2: {
                return (
                    <BookingList navigation={navigation} />
                );
            }
            default: {
                return null;
            }
        }
    };

    return (
        <View
            style={{
                flex: 1
            }}
        >
            <TopTabBar
                tabs={tabs}
                tabActiveIndex={personTabActiveIndex}
                setTabActiveIndex={(index) => { dispatch(setPersonTabActiveIndex(index)); }}
            />
            {renderTabByIndex()}
        </View>

    );
}
