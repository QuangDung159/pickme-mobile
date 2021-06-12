/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
/* eslint-disable no-shadow */
import {
    ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { SOCKET_URL } from '@env';
import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { GalioProvider } from 'galio-framework';
import React, { useEffect } from 'react';
import { AppState, View } from 'react-native';
import uuid from 'react-native-uuid';
import { useDispatch, useSelector } from 'react-redux';
import { Listener } from '../components/businessComponents';
import { Rx } from '../constants';
import { ToastHelpers } from '../helpers';
import Stacks from '../navigations/Stacks';
import {
    setDeviceIdStore,
    setDeviceTimezone, setIsSignInOtherDeviceStore, setListNotification, setMessageListened, setNumberNotificationUnread
} from '../redux/Actions';
import { rxUtil } from '../utils';

export default function Main() {
    const listNotification = useSelector((state) => state.notificationReducer.listNotification);

    const dispatch = useDispatch();
    const token = useSelector((state) => state.userReducer.token);
    const deviceIdStore = useSelector((state) => state.appConfigReducer.deviceIdStore);

    useEffect(
        () => {
            dispatch(setDeviceTimezone());

            AppState.addEventListener('change', handleAppStateChange);
            return () => {
                AppState.removeEventListener('change', handleAppStateChange);
            };
        }, []
    );

    useEffect(
        () => {
            generateNewDeviceId();
        }, [deviceIdStore]
    );

    const getListNotificationAPI = () => {
        rxUtil(
            Rx.NOTIFICATION.GET_MY_NOTIFICATION,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                // set store
                if (listNotification.length === 0) {
                    dispatch(setListNotification(res.data.data));
                    countNumberNotificationUnread(res.data.data);
                }
            },
            (res) => ToastHelpers.renderToast(res.data.message, 'error'),
            (res) => ToastHelpers.renderToast(res.data.message, 'error')
        );
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

    // apollo
    // Instantiate required constructor fields
    const cache = new InMemoryCache();

    const httpLink = new HttpLink({
        uri: `http:${SOCKET_URL}`,
        headers: {
            authorization: token,
        }
    });

    const wsLink = new WebSocketLink({
        uri: `ws:${SOCKET_URL}/subscriptions`,
        options: {
            reconnect: true,
            connectionParams: {
                authorization: token,
            },
        }
    });

    const splitLink = split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === 'OperationDefinition'
            && definition.operation === 'subscription'
            );
        },
        wsLink,
        httpLink,
    );

    const client = new ApolloClient({
        cache,
        link: splitLink,
    });

    const generateNewDeviceId = async () => {
        const deviceId = await SecureStore.getItemAsync('deviceId');

        if (!deviceId) {
            const myuuid = uuid.v4();

            // store deviceId to redux storage
            dispatch(setDeviceIdStore(myuuid));

            // store deviceId to device storage
            storeDeviceId(myuuid);
        } else {
            dispatch(setDeviceIdStore(deviceId));
        }
    };

    const storeDeviceId = async (deviceId) => {
        try {
            SecureStore.setItemAsync('deviceId', `${deviceId}`)
                .then(console.log('deviceId :>> ', deviceId));
        } catch (e) {
            console.log('error', e);
        }
    };

    const handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            onLogin();
        }
    };

    const onLogin = async () => {
        const phoneNumber = await SecureStore.getItemAsync('phoneNumber');
        const password = await SecureStore.getItemAsync('password');

        if (phoneNumber && password) {
            const data = {
                username: phoneNumber,
                password,
                deviceId: deviceIdStore
            };

            rxUtil(
                Rx.AUTHENTICATION.LOGIN,
                'POST',
                data,
                {},
                (res) => {
                    const { status } = res;
                    if (status === 201) {
                        dispatch(setIsSignInOtherDeviceStore(true));
                    }
                },
                (res) => ToastHelpers.renderToast(res.data.message, 'error'),
                (res) => ToastHelpers.renderToast(res.data.message, 'error')
            );
        }
    };

    useEffect(
        () => {
            if (token && token !== 'Bearer ') {
                getListNotificationAPI();
            }
        }, [token]
    );

    const handleNotification = () => {};

    const handleData = (data) => {
        const {
            type,
            payload
        } = data;

        if (type === 'message') {
            dispatch(setMessageListened(payload));
        } else {
            handleNotification(payload);
        }
    };

    try {
        return (
            <ApolloProvider client={client}>
                <NavigationContainer>
                    <Listener
                        onListenedData={(data) => { handleData(data.listen); }}
                    />
                    <GalioProvider>
                        <View
                            style={{
                                flex: 1
                            }}
                        >
                            <Stacks />
                        </View>
                    </GalioProvider>
                </NavigationContainer>
            </ApolloProvider>
        );
    } catch (error) {
        console.log('error', error);
    }
}
