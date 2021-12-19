/* eslint-disable no-shadow */
import {
    ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Listener } from '@components/businessComponents';
import ScreenName from '@constants/ScreenName';
import { getConfigByEnv } from '@helpers/CommonHelpers';
import Stacks from '@navigations/Stacks';
import { NavigationContainer } from '@react-navigation/native';
import {
    setDeviceTimezone, setMessageListened, setNotificationReceivedRedux, setPersonTabActiveIndex
} from '@redux/Actions';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import uuid from 'react-native-uuid';
import { useDispatch, useSelector } from 'react-redux';

const { SOCKET_URL } = getConfigByEnv();

export default function Main() {
    const notificationReceivedRedux = useSelector((state) => state.notificationReducer.notificationReceivedRedux);
    const navigationObj = useSelector((state) => state.appConfigReducer.navigationObj);
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const dispatch = useDispatch();

    useEffect(
        () => {
            dispatch(setDeviceTimezone());
            generateNewDeviceId();
        }, []
    );

    useEffect(
        () => {
            if (notificationReceivedRedux) {
                handleNotificationByType(notificationReceivedRedux.Type);
            }
        }, [notificationReceivedRedux]
    );

    // apollo
    // Instantiate required constructor fields
    const cache = new InMemoryCache();

    const httpLink = new HttpLink({
        uri: `http:${SOCKET_URL}`,
        headers: {
            authorization: `Bearer ${currentUser.token}`,
        }
    });

    const wsLink = new WebSocketLink({
        uri: `ws:${SOCKET_URL}/subscriptions`,
        options: {
            reconnect: true,
            connectionParams: {
                authorization: `Bearer ${currentUser.token}`,
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

    const handleNotificationByType = (notificationType) => {
        switch (notificationType) {
            case 2: {
                dispatch(setPersonTabActiveIndex(2));
                break;
            }
            case 3: {
                dispatch(setPersonTabActiveIndex(1));
                break;
            }
            case 4: {
                dispatch(setPersonTabActiveIndex(1));
                break;
            }
            case 5: {
                dispatch(setPersonTabActiveIndex(2));
                break;
            }
            default: {
                break;
            }
        }
        navigationObj.navigate(ScreenName.PERSONAL);
        dispatch(setNotificationReceivedRedux(null));
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
