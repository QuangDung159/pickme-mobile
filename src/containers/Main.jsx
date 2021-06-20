/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
/* eslint-disable no-shadow */
import {
    ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Listener } from '@components/businessComponents';
import { SOCKET_URL } from '@env';
import Stacks from '@navigations/Stacks';
import { NavigationContainer } from '@react-navigation/native';
import {
    setDeviceIdStore,
    setDeviceTimezone, setIsSignInOtherDeviceStore, setListNotification, setMessageListened, setNumberNotificationUnread
} from '@redux/Actions';
import { NotificationServices, UserServices } from '@services/index';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from 'react';
import { AppState, View } from 'react-native';
import uuid from 'react-native-uuid';
import { useDispatch, useSelector } from 'react-redux';

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

    const getListNotificationAPI = async () => {
        const result = await NotificationServices.fetchListNotificationAsync();
        const { data } = result;

        if (data) {
            if (listNotification.length === 0) {
                dispatch(setListNotification(data.data));
                countNumberNotificationUnread(data.data);
            }
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
            const body = {
                username: phoneNumber,
                password,
                deviceId: deviceIdStore
            };

            const result = await UserServices.loginAsync(body);
            const {
                isSuccess, status
            } = result;

            if (isSuccess) {
                if (status === 201) {
                    dispatch(setIsSignInOtherDeviceStore(true));
                }
            }
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
                    <View
                        style={{
                            flex: 1
                        }}
                    >
                        <Stacks />
                    </View>
                </NavigationContainer>
            </ApolloProvider>
        );
    } catch (error) {
        console.log('error', error);
    }
}
