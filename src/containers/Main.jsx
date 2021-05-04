/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
/* eslint-disable no-shadow */
import {
    ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { SOCKET_URL } from '@env';
import { NavigationContainer } from '@react-navigation/native';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import { Block, GalioProvider } from 'galio-framework';
import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Listener } from '../components/bussinessComponents';
import { NowTheme, Rx } from '../constants';
import Stacks from '../navigations/Stacks';
import {
    setDeviceTimezone, setIsSignInOtherDeviceStore, setListNotification, setMessageListened, setNumberNotificationUnread
} from '../redux/Actions';
import { rxUtil } from '../utils';

export default function Main() {
    const listNotification = useSelector((state) => state.notificationReducer.listNotification);

    const dispatch = useDispatch();
    const token = useSelector((state) => state.userReducer.token);

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
            }
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
        try {
            // get deviceId from local storage
            const deviceId = await SecureStore.getItemAsync('deviceId');
            if (deviceId === null) {
                // generate and save new device id to local storage
                const myuuid = `${Device.modelId}.${uuidv4()}`;
                console.log('new deviceId :>> ', myuuid);
                storeDeviceId(myuuid);
            } else {
                console.log('current deviceId :>> ', deviceId);
            }
        } catch (e) {
            console.log('error', e);
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

    useEffect(
        () => {
            dispatch(setDeviceTimezone());
            generateNewDeviceId();

            AppState.addEventListener('change', handleAppStateChange);

            return () => {
                AppState.removeEventListener('change', handleAppStateChange);
            };
        }, []
    );

    const handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            onLogin();
        }
    };

    const onLogin = async () => {
        const deviceId = await SecureStore.getItemAsync('deviceId');
        const phoneNumber = await SecureStore.getItemAsync('phoneNumber');
        const password = await SecureStore.getItemAsync('password');
        if (phoneNumber && password) {
            const data = {
                username: phoneNumber,
                password,
                deviceId
            };

            rxUtil(
                Rx.AUTHENTICATION.LOGIN,
                'POST',
                data,
                {},
                () => {
                    // const { status } = res;

                    // for testing
                    const status = 201;

                    if (status === 201) {
                        dispatch(setIsSignInOtherDeviceStore(true));
                    }
                }
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
                    <GalioProvider theme={NowTheme}>
                        <Block flex>
                            <Stacks />
                        </Block>
                    </GalioProvider>
                </NavigationContainer>
            </ApolloProvider>
        );
    } catch (error) {
        console.log('error', error);
    }
}
