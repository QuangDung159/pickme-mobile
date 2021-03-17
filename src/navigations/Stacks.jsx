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
    BookingListScreen,
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
    WalletScreen
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
    <Stack.Navigator initialRouteName={ScreenName.SIGN_IN} mode="card" headerMode="screen">
        {SignInScreen()}
    </Stack.Navigator>
);

const PersonalStack = () => (
    <Stack.Navigator initialRouteName={ScreenName.PERSONAL} mode="card" headerMode="screen">
        {PersonalScreen()}
        {BookingListScreen()}
        {WalletScreen()}
        {CashInScreen()}
        {CashOutScreen()}
        {SettingsScreen()}
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
    </Stack.Navigator>
);

const LeaderBoardStack = () => (
    <Stack.Navigator mode="card" headerMode="screen">
        {LeaderBoardScreen()}
        {ProfileScreen()}
        {MessageScreen()}
        {CreateBookingScreen()}
        {PaymentScreen()}
        {WalletScreen()}
        {CashInScreen()}
        {CashOutScreen()}
        {BankAccountScreen()}
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
        {WalletScreen()}
        {CashOutScreen()}
        {CashInScreen()}
        {BankAccountScreen()}
        {MessageScreen()}
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
                options={
                    numberNotificationUnread !== 0
                        ? { tabBarBadge: numberNotificationUnread }
                        : {}
                }
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
