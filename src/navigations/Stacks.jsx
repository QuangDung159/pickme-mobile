/* eslint-disable no-unused-vars */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import { NowTheme, ScreenName } from '../constants';
import Onboarding from '../screens/Onboarding';
import {
    BankAccountScreen, CreateBookingScreen,
    BookingDetailScreen,
    CashInScreen,
    CashOutScreen,
    ConversationListScreen,
    CreateAccountScreen,
    HomeScreen,
    LeaderBoardScreen,
    MessageScreen,
    NotificationScreen,
    PaymentScreen,
    PersonalScreen,
    ProfileScreen,
    SettingsScreen,
    SignInScreen,
    SignUpScreen,
    UpdateInfoAccountScreen,
    SupportScreen
} from './StackScreens';
import TabIcon from './TabIcon';

const Stack = createStackNavigator();

const SignUpStack = () => (
    <Stack.Navigator initialRouteName={ScreenName.SIGN_UP} mode="card" headerMode="none">
        {SignUpScreen()}
        {CreateAccountScreen()}
    </Stack.Navigator>
);

const SignInStack = () => (
    <Stack.Navigator initialRouteName={ScreenName.SIGN_IN} mode="card" headerMode="none">
        {SignInScreen()}
    </Stack.Navigator>
);

const PersonalStack = () => (
    <Stack.Navigator initialRouteName={ScreenName.PERSONAL} mode="card" headerMode="screen">
        {PersonalScreen()}
        {CashInScreen()}
        {CashOutScreen()}
        {BookingDetailScreen()}
        {ProfileScreen()}
        {MessageScreen()}
        {CreateBookingScreen()}
        {PaymentScreen()}
        {UpdateInfoAccountScreen()}
        {BankAccountScreen()}
    </Stack.Navigator>
);

const NotificationStack = () => (
    <Stack.Navigator mode="card" headerMode="screen">
        {NotificationScreen()}
        {BookingDetailScreen()}
    </Stack.Navigator>
);

const LeaderBoardStack = () => (
    <Stack.Navigator mode="card" headerMode="screen">
        {LeaderBoardScreen()}
        {ProfileScreen()}
        {MessageScreen()}
        {CreateBookingScreen()}
        {PaymentScreen()}
        {CashInScreen()}
        {CashOutScreen()}
        {BankAccountScreen()}
    </Stack.Navigator>
);

const SupportStack = () => (
    <Stack.Navigator mode="card" headerMode="screen">
        {SupportScreen()}
    </Stack.Navigator>
);

const ConversationListStack = () => (
    <Stack.Navigator mode="card" headerMode="screen">
        {ConversationListScreen()}
        {MessageScreen()}
    </Stack.Navigator>
);

const HomeStack = () => (
    <Stack.Navigator mode="card" headerMode="screen">
        {HomeScreen()}
        {ProfileScreen()}
        {CreateBookingScreen()}
        {PaymentScreen()}
        {CashOutScreen()}
        {CashInScreen()}
        {BankAccountScreen()}
        {MessageScreen()}
        {SupportScreen()}
        {SettingsScreen()}
    </Stack.Navigator>
);

const Tab = createBottomTabNavigator();

const BottomTabMenuStack = () => {
    const numberMessageUnread = useSelector(
        (state) => state.messageReducer.numberMessageUnread
    );

    const numberNotificationUnread = useSelector(
        (state) => state.notificationReducer.numberNotificationUnread
    );

    const tabOptions = {};
    let numberNotiDisplay = 0;

    if (numberNotificationUnread !== 0) {
        if (numberNotificationUnread > 99) {
            numberNotiDisplay = '99+';
        } else {
            numberNotiDisplay = numberNotificationUnread;
        }

        tabOptions.tabBarBadge = numberNotiDisplay;
    }

    return (
        <Tab.Navigator
            initialRouteName={ScreenName.HOME}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color }) => (
                    <TabIcon route={route} color={color} focused={focused} size={24} />
                ),
            })}
            tabBarOptions={{
                activeTintColor: NowTheme.COLORS.ACTIVE,
                inactiveTintColor: NowTheme.COLORS.DEFAULT,
                showLabel: false,
            }}
        >
            <Tab.Screen
                name={ScreenName.LEADER_BOARD}
                component={LeaderBoardStack}
            />
            <Tab.Screen
                name={ScreenName.PERSONAL}
                component={PersonalStack}
            />
            <Tab.Screen
                name={ScreenName.HOME}
                component={HomeStack}
            />
            <Tab.Screen
                name={ScreenName.CONVERSATION_LIST}
                component={ConversationListStack}
                options={
                    numberMessageUnread !== 0
                        ? { tabBarBadge: numberMessageUnread }
                        : {}
                }
            />
            <Tab.Screen
                name={ScreenName.NOTIFICATION}
                component={NotificationStack}
                options={tabOptions}
            />
        </Tab.Navigator>
    );
};

export default function AppStask() {
    return (
        <Stack.Navigator mode="card" headerMode="none">
            <Stack.Screen
                name={ScreenName.ONBOARDING}
                component={Onboarding}
                option={{
                    headerTransparent: true
                }}
            />
            <Stack.Screen
                name={ScreenName.APP}
                component={BottomTabMenuStack}
            />
            <Stack.Screen name={ScreenName.SIGN_UP} component={SignUpStack} />
            <Stack.Screen name={ScreenName.SIGN_IN} component={SignInStack} />
        </Stack.Navigator>
    );
}
