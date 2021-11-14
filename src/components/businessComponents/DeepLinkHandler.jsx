import * as Linking from 'expo-linking';
import React, { useEffect } from 'react';
import { Alert } from 'react-native';

export default function DeepLinkHandler() {
    // 1. If the app is not already open, it is opened and the url is passed in as the initialURL
    // You can handle these events with Linking.getInitialURL(url) -- it returns a Promise that
    // resolves to the url, if there is one.
    useEffect(() => {
        const getUrlAsync = async () => {
            // Get the deep link used to open the app
            const initialUrl = await Linking.getInitialURL();
            handleUrl(initialUrl);
        };

        getUrlAsync();
    }, []);

    // 2. If the app is already open, the app is foregrounded and a Linking event is fired
    // You can handle these events with Linking.addEventListener(url, callback)
    useEffect(() => {
        const onLinking = Linking.addEventListener('url', (url) => {
            handleUrl(url);
        });

        return onLinking;
    }, []);

    const handleUrl = (url) => {
        console.log('url :>> ', url);
        if (url) {
            const { path, queryParams } = Linking.parse(url);
            if (path) {
                Alert.alert(`Linked to app with path: ${path} and data: ${JSON.stringify(queryParams)}`);
            }
        }
    };

    return (
        <></>
    );
}
