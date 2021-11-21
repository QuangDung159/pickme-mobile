/* eslint-disable max-len */
import { TopTabBar } from '@components/uiComponents';
import { GraphQueryString, ScreenName } from '@constants/index';
import {
    setListBookingStore,
    setListConversation,
    setListNotification,
    setNumberMessageUnread,
    setNumberNotificationUnread,
    setPersonTabActiveIndex
} from '@redux/Actions';
import BookingServices from '@services/BookingServices';
import NotificationServices from '@services/NotificationServices';
import socketRequestUtil from '@utils/socketRequestUtil';
import React, { useEffect, useState } from 'react';
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
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const messageListened = useSelector((state) => state.messageReducer.messageListened);
    const [listConversationGetAtHome, setListConversationGetAtHome] = useState([]);
    const chattingWith = useSelector((state) => state.messageReducer.chattingWith);
    const numberMessageUnread = useSelector((state) => state.messageReducer.numberMessageUnread);

    const navigateFrom = navigation?.params?.navigateFrom;

    const dispatch = useDispatch();

    useEffect(
        () => {
            fetchListNotification();
            fetchListBooking();
            getListConversationFromSocket();
        }, []
    );

    useEffect(
        () => {
            const onFocus = navigation.addListener('focus', () => {
                if (navigateFrom && navigateFrom === ScreenName.BOOKING_DETAIL) {
                    fetchListBooking();
                }
            });

            return onFocus;
        }, []
    );

    useEffect(
        () => {
            const intervalUpdateLatest = setIntervalToUpdateLastActiveOfUserStatus();
            return () => {
                clearInterval(intervalUpdateLatest);
            };
        }, []
    );

    useEffect(
        () => {
            const conversationPayLoad = getConversationByMessage(
                messageListened,
                listConversationGetAtHome
            );

            if (!conversationPayLoad) {
                return;
            }

            // in case user on chatting screen
            if (messageListened.from === chattingWith) {
                return;
            }

            const { conversation, indexInSource } = conversationPayLoad;

            if (conversation.isRead === true) {
                dispatch(setNumberMessageUnread(numberMessageUnread + 1));

                // re-assign recentlyMessage.isRead = false
                // to ignore increase numberOfUnreadMessage
                // in case next incoming message is belong to this conversation
                // because we don't refetch listRecentlyMessage from API
                const listConversationTemp = [...listConversationGetAtHome];
                listConversationTemp[indexInSource].isRead = false;
                setListConversationGetAtHome(listConversationTemp);
            }
        }, [messageListened]
    );

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

    const setIntervalToUpdateLastActiveOfUserStatus = () => {
        const intervalUpdateLastActive = setInterval(() => {
            const data = {
                query: GraphQueryString.UPDATE_LAST_ACTIVE,
                variables: { url: currentUser.url }
            };

            socketRequestUtil(
                'POST',
                data,
                currentUser.token
            );
        }, 300000);
        return intervalUpdateLastActive;
    };

    const fetchListBooking = async () => {
        const res = await BookingServices.fetchListBookingAsync();
        let listBooking = [];

        if (res.data) {
            listBooking = res.data.data;
            dispatch(setListBookingStore(listBooking));
        }
    };

    const getConversationByMessage = (message, listConversationSource) => {
        const index = listConversationSource.findIndex(
            (conversation) => conversation.from === message.from || conversation.from === message.to
        );

        if (index === -1) {
            return null;
        }

        return {
            conversation: listConversationSource[index],
            indexInSource: index
        };
    };

    const fetchListNotification = async () => {
        const result = await NotificationServices.fetchListNotificationAsync();
        const { data } = result;

        if (data) {
            dispatch(setListNotification(data.data));
            countNumberNotificationUnread(data.data);
        }
    };

    const countNumberNotificationUnread = (listNotiFromAPI) => {
        let count = 0;
        listNotiFromAPI.forEach((item) => {
            if (!item.isRead) {
                count += 1;
            }
        });

        dispatch(setNumberNotificationUnread(count));
    };

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

    const getListConversationFromSocket = () => {
        const { token } = currentUser;
        const data = {
            query: GraphQueryString.GET_LIST_CONVERSATION,
            variables: { pageIndex: 1, pageSize: 20 }
        };

        socketRequestUtil(
            'POST',
            data,
            token,
            (res) => {
                dispatch(setListConversation(res.data.data.getRecently));
                setListConversationGetAtHome(res.data.data.getRecently);
                countNumberOfUnreadConversation(res.data.data.getRecently);
            }
        );
    };

    const countNumberOfUnreadConversation = (listMessage) => {
        if (messageListened.from === chattingWith) {
            return;
        }

        let count = 0;
        listMessage.forEach((conversation) => {
            if (conversation.to === currentUser.id && !conversation.isRead) {
                count += 1;
            }
        });

        dispatch(setNumberMessageUnread(count));
    };

    // Render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    return (
        <TopTabBar
            routes={routes}
            renderScene={renderScene}
            tabActiveIndex={personTabActiveIndex}
            setTabActiveIndex={(index) => {
                dispatch(setPersonTabActiveIndex(index));
            }}
        />
    );
}
