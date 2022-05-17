import { IconCustom, TopTabBar } from '@components/uiComponents';
import {
    IconFamily, Rx, ScreenName, Theme
} from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import React, { useEffect, useState } from 'react';
import { SceneMap } from 'react-native-tab-view';
import { useSelector } from 'react-redux';
import LeaderBoadViewByType from './LeaderBoadViewByType';

const {
    COLORS
} = Theme;

const tabArr = [
    { key: 'booking', title: 'Yêu cầu thuê' },
    { key: 'earningExpected', title: 'Xu' },
];

export default function LeaderBoard({ navigation }) {
    const [tabActiveIndex, setTabActiveIndex] = useState(0);

    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const [routes] = useState(tabArr);

    const tabs = [
        {
            tabLabel: tabArr[0].title,
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
            tabLabel: tabArr[1].title,
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
            tabCode={tabArr[0].key}
        />
    );

    const EarningExpectedRoute = () => (
        <LeaderBoadViewByType
            navigation={navigation}
            tabActiveIndex={tabActiveIndex}
            tabs={tabs}
            tabCode={tabArr[1].key}
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
