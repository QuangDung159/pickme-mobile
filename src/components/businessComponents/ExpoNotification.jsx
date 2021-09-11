import {
    setCurrentBookingRedux,
    setCurrentUser, setListBookingStore,
    setListCashHistoryStore,
    setListNotification,
    setNotificationReceivedRedux,
    setNumberNotificationUnread
} from '@redux/Actions';
import BookingServices from '@services/BookingServices';
import CashServices from '@services/CashServices';
import NotificationServices from '@services/NotificationServices';
import UserServices from '@services/UserServices';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function ExpoNotification() {
    const notificationListener = useRef();
    const responseListener = useRef();

    const [bookingId, setBookingId] = useState();

    const currentBookingRedux = useSelector((state) => state.bookingReducer.currentBookingRedux);
    const messageListened = useSelector((state) => state.messageReducer.messageListened);
    const chattingWith = useSelector((state) => state.messageReducer.chattingWith);
    const listConversation = useSelector((state) => state.messageReducer.listConversation);

    const dispatch = useDispatch();

    useEffect(
        () => {
            if (!chattingWith && messageListened && JSON.stringify(messageListened) !== JSON.stringify({})) {
                schedulePushNotification(messageListened.from);
            }
        }, [messageListened]
    );

    useEffect(() => {
        // handle received
        notificationListener.current = Notifications.addNotificationReceivedListener((notificationReceived) => {
            fetchListNotification();
            handleNotiReceived(notificationReceived);
        });

        // handle click pop-up
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            const notificationBody = response.notification.request.content.data;
            dispatch(setNotificationReceivedRedux(notificationBody));

            handleNotiReceived(response.notification);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    useEffect(() => {
        if (bookingId && currentBookingRedux) {
            fetchBookingDetailInfo(currentBookingRedux.id);
        }
    }, [currentBookingRedux, bookingId]);

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });

    const schedulePushNotification = async (from) => {
        const conversation = listConversation.find((item) => item.fromUser.userId === from);
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Bạn có tin nhắn mới',
                body: `Từ ${conversation ? conversation.fromUser.fullName : 'người lạ'}`,
                data: {},
            },
            trigger: { seconds: 2 },
        });
    };

    const fetchCurrentUserInfo = async () => {
        const result = await UserServices.fetchCurrentUserInfoAsync();
        const { data } = result;

        if (data) {
            const currentUserInfo = await UserServices.mappingCurrentUserInfo(data.data);
            dispatch(setCurrentUser(currentUserInfo));
        }
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

    const handleNotiReceived = (notificationReceived) => {
        const notificationBody = notificationReceived.request.content.data;

        switch (notificationBody.Type) {
            case 2: {
                fetchListBooking();
                setBookingId(notificationBody.NavigationId);
                break;
            }
            case 3: {
                fetchListHistory();
                break;
            }
            case 4:
            {
                fetchListHistory();
                fetchCurrentUserInfo();
                break;
            }
            case 5: {
                fetchListBooking();
                setBookingId(notificationBody.NavigationId);
                break;
            }
            default: {
                break;
            }
        }
    };

    const fetchListBooking = async () => {
        const result = await BookingServices.fetchListBookingAsync();
        const { data } = result;

        if (data) {
            dispatch(setListBookingStore(data.data));
        }
    };

    const fetchListHistory = async () => {
        const result = await CashServices.fetchCashHistoryAsync();
        const { data } = result;

        if (data) {
            dispatch(setListCashHistoryStore(data.data));
        }
    };

    const fetchBookingDetailInfo = async (currentBookingId) => {
        if (currentBookingId === bookingId) {
            const result = await BookingServices.fetchBookingDetailAsync(bookingId);
            const { data } = result;

            if (data) {
                dispatch(setCurrentBookingRedux(data.data));
            }
        }
        setBookingId(null);
    };

    return (
        <></>
    );
}
