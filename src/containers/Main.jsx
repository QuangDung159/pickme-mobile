/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
/* eslint-disable no-shadow */
import {
    ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { ExpoNotification, Listener } from '@components/businessComponents';
import { SOCKET_URL } from '@env';
import Stacks from '@navigations/Stacks';
import { NavigationContainer } from '@react-navigation/native';
import {
    setDeviceTimezone, setMessageListened
} from '@redux/Actions';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import uuid from 'react-native-uuid';
import { useDispatch } from 'react-redux';

let token = null;
const getTokenFromLocal = async () => {
    token = await SecureStore.getItemAsync('api_token');
};

export default function Main() {
    const dispatch = useDispatch();

    useEffect(
        () => {
            getTokenFromLocal();
            dispatch(setDeviceTimezone());
        }, []
    );

    useEffect(
        () => {
            generateNewDeviceId();
        }, []
    );

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
                        <ExpoNotification />
                        <Stacks />
                    </View>
                </NavigationContainer>
            </ApolloProvider>
        );
    } catch (error) {
        console.log('error', error);
    }
}
