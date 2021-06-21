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
    setDeviceTimezone, setListNotification, setMessageListened, setNumberNotificationUnread
} from '@redux/Actions';
import { NotificationServices } from '@services/index';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import uuid from 'react-native-uuid';
import { useDispatch, useSelector } from 'react-redux';

export default function Main() {
    const listNotification = useSelector((state) => state.notificationReducer.listNotification);

    const dispatch = useDispatch();
    const token = useSelector((state) => state.userReducer.token);

    useEffect(
        () => {
            dispatch(setDeviceTimezone());
        }, []
    );

    useEffect(
        () => {
            generateNewDeviceId();
        }, []
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

            // store deviceId to device storage
            await SecureStore.setItemAsync('deviceId', myuuid);
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
