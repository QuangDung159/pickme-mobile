/* eslint-disable no-unused-vars */
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NowTheme, ScreenName, ScreenTitle } from '../constants';
import Header from '../containers/Header';
// screens
import {
    BankAccount,
    CreateBooking,
    BookingDetail,
    BookingList,
    CashIn, CashOut,
    ConversationList, CreateAccount, Home,
    LeaderBoard,
    Message, Notification,
    Payment, Personal,
    Profile, Settings, SignIn, SignUp,
    UpdateInfoAccount,
    Wallet,
    Support
} from '../screens';

const Stack = createStackNavigator();

export const PaymentScreen = () => (
    <Stack.Screen
        name={ScreenName.PAYMENT}
        component={Payment}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title={ScreenTitle.PAYMENT}
                    options
                    navigation={navigation}
                    scene={scene}
                />
            ),
            cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
        }}
    />
);

export const PersonalScreen = () => (
    <Stack.Screen
        name={ScreenName.PERSONAL}
        component={Personal}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title={ScreenTitle.PERSONAL}
                    options
                    navigation={navigation}
                    scene={scene}
                />
            ),
            cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
        }}
    />
);

export const UpdateInfoAccountScreen = () => (
    <Stack.Screen
        name={ScreenName.UPDATE_INFO_ACCOUNT}
        component={UpdateInfoAccount}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title={ScreenTitle.UPDATE_INFO_ACCOUNT}
                    options
                    navigation={navigation}
                    scene={scene}
                />
            ),
            cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
        }}
    />
);

export const ProfileScreen = () => (
    <Stack.Screen
        name={ScreenName.PROFILE}
        component={Profile}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title=""
                    back
                    white
                    transparent
                    navigation={navigation}
                    scene={scene}
                />
            ),
            headerTransparent: true
        }}
    />
);

export const HomeScreen = () => (
    <Stack.Screen
        name={ScreenName.HOME}
        component={Home}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title={ScreenTitle.HOME}
                    options
                    navigation={navigation}
                    scene={scene}
                />
            ),
            cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
        }}
    />
);

export const LeaderBoardScreen = () => (
    <Stack.Screen
        name={ScreenName.LEADER_BOARD}
        component={LeaderBoard}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title={ScreenTitle.LEADER_BOARD}
                    options
                    navigation={navigation}
                    scene={scene}
                />
            ),
            cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
        }}
    />
);

export const BankAccountScreen = () => (
    <Stack.Screen
        name={ScreenName.BANK_ACCOUNT}
        component={BankAccount}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title={ScreenTitle.BANK_ACCOUNT}
                    options
                    navigation={navigation}
                    scene={scene}
                />
            ),
            cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
        }}
    />
);

export const CreateBookingScreen = () => (
    <Stack.Screen
        name={ScreenName.CREATE_BOOKING}
        component={CreateBooking}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title={ScreenTitle.CREATE_BOOKING}
                    options
                    navigation={navigation}
                    scene={scene}
                />
            ),
            cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
        }}
    />
);

export const BookingDetailScreen = () => (
    <Stack.Screen
        name={ScreenName.BOOKING_DETAIL}
        component={BookingDetail}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title={ScreenTitle.BOOKING_DETAIL}
                    options
                    navigation={navigation}
                    scene={scene}
                />
            ),
            cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
        }}
    />
);

export const BookingListScreen = () => (
    <Stack.Screen
        name={ScreenName.BOOKING_LIST}
        component={BookingList}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title={ScreenTitle.BOOKING_LIST}
                    options
                    navigation={navigation}
                    scene={scene}
                />
            ),
            cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
        }}
    />
);

export const CashInScreen = () => (
    <Stack.Screen
        name={ScreenName.CASH_IN}
        component={CashIn}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title={ScreenTitle.CASH_IN}
                    options
                    navigation={navigation}
                    scene={scene}
                />
            ),
            cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
        }}
    />
);

export const CashOutScreen = () => (
    <Stack.Screen
        name={ScreenName.CASH_OUT}
        component={CashOut}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title={ScreenTitle.CASH_OUT}
                    options
                    navigation={navigation}
                    scene={scene}
                />
            ),
            cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
        }}
    />
);

export const CreateAccountScreen = () => (
    <Stack.Screen
        name={ScreenName.CREATE_ACCOUNT}
        component={CreateAccount}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title={ScreenTitle.CREATE_ACCOUNT}
                    options
                    navigation={navigation}
                    scene={scene}
                />
            ),
            cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
        }}
    />
);

export const MessageScreen = () => (
    <Stack.Screen
        name={ScreenName.MESSAGE}
        component={Message}
        options={
            ({ route, navigation, scene }) => ({
                header: () => (
                    <Header
                        title={route.params.name}
                        options
                        navigation={navigation}
                        scene={scene}
                        screenNameProp={ScreenName.MESSAGE}
                        userStatus={route.params.userStatus}
                    />
                ),
                cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
            })
        }
    />
);

export const ConversationListScreen = () => (
    <Stack.Screen
        name={ScreenName.CONVERSATION_LIST}
        component={ConversationList}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title={ScreenTitle.CONVERSATION_LIST}
                    options
                    navigation={navigation}
                    scene={scene}
                />
            ),
            cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
        }}
    />
);

export const NotificationScreen = () => (
    <Stack.Screen
        name={ScreenName.NOTIFICATION}
        component={Notification}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title={ScreenTitle.NOTIFICATION}
                    options
                    navigation={navigation}
                    scene={scene}
                    screenNameProp={ScreenName.NOTIFICATION}
                />
            ),
            cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
        }}
    />
);

export const SettingsScreen = () => (
    <Stack.Screen
        name={ScreenName.SETTINGS}
        component={Settings}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title={ScreenTitle.SETTINGS}
                    options
                    navigation={navigation}
                    scene={scene}
                />
            ),
            cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
        }}
    />
);

export const WalletScreen = () => (
    <Stack.Screen
        name={ScreenName.WALLET}
        component={Wallet}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title={ScreenTitle.WALLET}
                    options
                    navigation={navigation}
                    scene={scene}
                />
            ),
            cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
        }}
    />
);

export const SignUpScreen = () => (
    <Stack.Screen
        name={ScreenName.SIGN_UP}
        component={SignUp}
        options={{
            headerTransparent: true
        }}
    />
);

export const SignInScreen = () => (
    <Stack.Screen
        name={ScreenName.SIGN_IN}
        component={SignIn}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title=""
                    back
                    white
                    transparent
                    navigation={navigation}
                    scene={scene}
                />
            ),
            headerTransparent: true
        }}
    />
);

export const SupportScreen = () => (
    <Stack.Screen
        name={ScreenName.SUPPORT}
        component={Support}
        options={{
            header: ({ navigation, scene }) => (
                <Header
                    title={ScreenTitle.SUPPORT}
                    options
                    navigation={navigation}
                    scene={scene}
                />
            ),
            cardStyle: { backgroundColor: NowTheme.COLORS.BASE }
        }}
    />
);
