import { ScreenName } from '@constants/index';
import {
    setCurrentUser,
    setExpoToken,
    setListBookingStore,
    setListCashHistoryStore,
    setListNotification,
    setNumberNotificationUnread,
    setPersonTabActiveIndex
} from '@redux/Actions';
import { BookingServices, CashServices, NotificationServices } from '@services/index';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import {
    Alert,
    Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function ExpoNotification() {
    const notificationListener = useRef();
    const responseListener = useRef();

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const token = useSelector((state) => state.userReducer.token);
    const navigationObj = useSelector((state) => state.appConfigReducer.navigationObj);

    const dispatch = useDispatch();

    useEffect(() => {
        registerForPushNotificationsAsync().then(() => {});

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    useEffect(
        () => {
        // This listener is fired whenever a notification is received while the app is foregrounded
            notificationListener.current = Notifications.addNotificationReceivedListener((notificationReceived) => {
            // in app trigger
                if (token && token !== 'Bearer ' && token !== 'Bearer null') {
                    getListNotiFromAPI();

                    const notiType = notificationReceived.request?.content?.data?.Type;

                    switch (notiType) {
                        case 1: {
                            getListBooking();
                            break;
                        }
                        case 2: {
                            fetchHistory();
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                }
            });
        }, [token]
    );

    useEffect(
        () => {
        // This listener is fired
        // whenever a user taps on or interacts
        // with a notification (works when app is foregrounded, backgrounded, or killed)
            responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            // on click noti popup outside
                const navigationData = response.notification.request.content.data;
                onClickRead(navigationData.Id, navigationData.NavigationId, navigationData.Type);
            });
        }, [navigationObj]
    );

    const fetchHistory = async () => {
        const result = await CashServices.fetchCashHistoryAsync();
        const { data } = result;

        if (data) {
            const history = data.data;
            if (history && history.length !== 0) {
                dispatch(setListCashHistoryStore(history));
                const latestUpdatedAmount = history[0].updatedWalletAmount;

                dispatch(setCurrentUser({
                    ...currentUser,
                    walletAmount: latestUpdatedAmount
                }));
            }
        }
    };

    const onClickRead = async (notiId = null, navigationId, navigationType) => {
        const result = await NotificationServices.triggerReadNotificationAsync(notiId);
        const { data } = result;

        if (data) {
            handleNavigation(navigationId, navigationType);
            getListNotiFromAPI();
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

    const getListNotiFromAPI = async () => {
        const result = await NotificationServices.fetchListNotificationAsync();
        const { data } = result;

        if (data) {
            dispatch(setListNotification(data.data));
            countNumberNotificationUnread(data.data);
        }
    };

    const getListBooking = async () => {
        const result = await BookingServices.fetchListBookingAsync();
        const { data } = result;

        if (data) {
            dispatch(setListBookingStore(data.data));
        }
    };

    const handleNavigation = (navigationId, navigationType) => {
        if (navigationObj) {
            switch (navigationType) {
                case 1: {
                    navigationObj.navigate(ScreenName.BOOKING_DETAIL, { bookingId: navigationId });
                    break;
                }
                case 3: {
                    navigationObj.navigate(ScreenName.PERSONAL);
                    dispatch(setPersonTabActiveIndex(1));
                    break;
                }
                default: {
                    break;
                }
            }
        }
    };

    async function registerForPushNotificationsAsync() {
        let expoToken;
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                Alert('Failed to get push token for push notification!');
                return;
            }
            expoToken = (await Notifications.getExpoPushTokenAsync()).data;
            dispatch(setExpoToken(expoToken));
        } else {
            Alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    }

    return (
        null
    );
}
