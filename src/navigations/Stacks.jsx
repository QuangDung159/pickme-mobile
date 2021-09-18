/* eslint-disable no-unused-vars */
import { Theme, ScreenName } from '@constants/index';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import {
    BookingDetailScreen,
    CashInScreen,
    ConversationListScreen,
    CreateAccountScreen, CreateBookingScreen,
    ForgotPasswordScreen, HomeScreen,
    LeaderBoardScreen,
    MessageScreen,
    NotificationScreen,
    OnboardingScreen,
    PersonalScreen,
    ProfileScreen,
    SettingsScreen,
    SignInScreen,
    SignInWithOTPScreen, SignUpScreen,
    SupportScreen, UpdateInfoAccountScreen,
    VerificationScreen
} from './StackScreens';
import TabIcon from './TabIcon';

const { COLORS } = Theme;

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
        {SignInWithOTPScreen()}
        {ForgotPasswordScreen()}
    </Stack.Navigator>
);

const SignInWithOTPStack = () => (
    <Stack.Navigator initialRouteName={ScreenName.SIGN_IN} mode="card" headerMode="none">
        {SignInWithOTPScreen()}
    </Stack.Navigator>
);

const LeaderBoardStack = () => (
    <Stack.Navigator mode="card" headerMode="screen">
        {LeaderBoardScreen()}
        {ProfileScreen()}
        {MessageScreen()}
        {CreateBookingScreen()}
    </Stack.Navigator>
);

const PersonalStack = () => (
    <Stack.Navigator initialRouteName={ScreenName.PERSONAL} mode="card" headerMode="screen">
        {PersonalScreen()}
        {UpdateInfoAccountScreen()}
        {CashInScreen()}
        {BookingDetailScreen()}
        {CreateBookingScreen()}
        {MessageScreen()}
        {SupportScreen()}
        {SettingsScreen()}
        {VerificationScreen()}
    </Stack.Navigator>
);

const HomeStack = () => (
    <Stack.Navigator mode="card" headerMode="screen">
        {HomeScreen()}
        {ProfileScreen()}
        {CreateBookingScreen()}
        {MessageScreen()}
        {SupportScreen()}
        {SettingsScreen()}
    </Stack.Navigator>
);

const NotificationStack = () => (
    <Stack.Navigator mode="card" headerMode="screen">
        {NotificationScreen()}
        {BookingDetailScreen()}
        {CreateBookingScreen()}
        {PersonalScreen()}
        {CashInScreen()}
        {SupportScreen()}
        {SettingsScreen()}
    </Stack.Navigator>
);

const ConversationListStack = () => (
    <Stack.Navigator mode="card" headerMode="screen">
        {ConversationListScreen()}
        {MessageScreen()}
        {ProfileScreen()}
    </Stack.Navigator>
);

const OnboardingStack = () => (
    <Stack.Navigator initialRouteName={ScreenName.ONBOARDING} mode="card" headerMode="none">
        {OnboardingScreen()}
        {SignInWithOTPScreen()}
        {HomeScreen()}
        {ForgotPasswordScreen()}
    </Stack.Navigator>
);

const Tab = createBottomTabNavigator();

const BottomTabMenuStack = () => {
    const numberMessageUnread = useSelector(
        (state) => state.messageReducer.numberMessageUnread
    );

    let numberMessageUnreadDisplay = 0;
    if (numberMessageUnread > 99) {
        numberMessageUnreadDisplay = '99+';
    } else if (numberMessageUnread > 0) {
        numberMessageUnreadDisplay = numberMessageUnread;
    }

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
                activeTintColor: COLORS.ACTIVE,
                inactiveTintColor: COLORS.DEFAULT,
                showLabel: false,
                activeBackgroundColor: COLORS.BLOCK,
                inactiveBackgroundColor: COLORS.BLOCK
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
                    numberMessageUnreadDisplay !== 0
                        ? { tabBarBadge: numberMessageUnreadDisplay }
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

export default function AppStack() {
    return (
        <Stack.Navigator mode="card" headerMode="none">
            <Stack.Screen name={ScreenName.ONBOARDING} component={OnboardingStack} />
            <Stack.Screen
                name={ScreenName.APP}
                component={BottomTabMenuStack}
            />
            <Stack.Screen name={ScreenName.SIGN_UP} component={SignUpStack} />
            <Stack.Screen name={ScreenName.SIGN_IN} component={SignInStack} />
            <Stack.Screen name={ScreenName.SIGN_IN_WITH_OTP} component={SignInWithOTPStack} />
        </Stack.Navigator>
    );
}
