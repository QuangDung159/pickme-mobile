/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { IconCustom, TopTabBar } from '@components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import React, { useEffect, useState } from 'react';
import { SceneMap } from 'react-native-tab-view';
import { useSelector } from 'react-redux';
import LeaderBoadViewByType from './LeaderBoadViewByType';

const {
    COLORS
} = NowTheme;

export default function LeaderBoard({ navigation }) {
    const [tabActiveIndex, setTabActiveIndex] = useState(0);

    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const [routes] = React.useState([
        { key: 'booking', title: 'Đơn hẹn' },
        { key: 'earningExpected', title: 'Mức chi trả' },
    ]);

    const tabs = [
        {
            tabLabel: 'Đơn hẹn',
            tabIcon: (
                <IconCustom
                    name="list-alt"
                    family={IconFamily.FONT_AWESOME}
                    size={28}
                    color={COLORS.ACTIVE}
                />
            ),
            endpoint: Rx.PARTNER.LEADER_BOARD_BOOKING
        },
        {
            tabLabel: 'Mức chi trả',
            tabIcon: (
                <></>
            ),
            endpoint: Rx.PARTNER.LEADER_BOARD_DIAMOND
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

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const BookingRoute = () => (
        <LeaderBoadViewByType
            navigation={navigation}
            tabActiveIndex={tabActiveIndex}
            tabs={tabs}
            tabCode="booking"
        />
    );

    const EarningExpectedRoute = () => (
        <LeaderBoadViewByType
            navigation={navigation}
            tabActiveIndex={tabActiveIndex}
            tabs={tabs}
            tabCode="diamon"
        />
    );

    const renderScene = SceneMap({
        booking: BookingRoute,
        earningExpected: EarningExpectedRoute,
    });

    try {
        return (
            <TopTabBar
                routes={routes}
                renderScene={renderScene}
                tabActiveIndex={tabActiveIndex}
                setTabActiveIndex={(index) => setTabActiveIndex(index)}
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
