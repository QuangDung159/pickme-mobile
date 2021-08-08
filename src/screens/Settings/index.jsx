import { Switch } from '@components/uiComponents';
import { Theme } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    ScrollView, StyleSheet,
    Text, View
} from 'react-native';

const {
    FONT: {
        TEXT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;

const recommended = [
    {
        title: 'Use FaceID to sign in', id: 'face', type: 'switch', status: true
    },
    {
        title: 'Auto-Lock security', id: 'autolock', type: 'switch', status: false
    },
    {
        title: 'Notifications', id: 'NotificationsSettings', type: 'switch', status: false
    }
];

export default function Settings() {
    const [switchArray, setSwitchArray] = useState([]);

    useEffect(
        () => {
            setSwitchArray(recommended);
        }, []
    );

    const toggleSwitch = (switchId) => {
        const index = switchArray.findIndex((switchItem) => switchItem.id === switchId);
        if (index !== -1) {
            const switchArrayTemp = [...switchArray];
            switchArrayTemp[index].status = !switchArrayTemp[index].status;
            setSwitchArray(switchArrayTemp);
        }
    };

    const renderItem = ({ item }) => {
        switch (item.type) {
            case 'switch':
                return (
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 10
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: TEXT_REGULAR,
                                fontSize: SIZES.FONT_H3,
                                color: COLORS.DEFAULT
                            }}
                        >
                            {item.title}
                        </Text>
                        <Switch
                            onValueChange={() => toggleSwitch(item.id)}
                            value={item.status}
                        />
                    </View>
                );
            default:
                return null;
        }
    };

    try {
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.settings}
            >
                <FlatList
                    data={recommended}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
                <Text
                    style={{
                        fontFamily: TEXT_REGULAR,
                        fontSize: SIZES.FONT_H5,
                        color: COLORS.DEFAULT,
                        textAlign: 'center',
                        marginTop: 10
                    }}
                >
                    {`Version ${Constants.manifest.version} (2108082)`}
                </Text>
            </ScrollView>
        );
    } catch (exception) {
        console.log('exception :>> ', exception);
        return (
            <>
                {ToastHelpers.renderToast()}
            </>
        );
    }
}

const styles = StyleSheet.create({
    settings: {
        width: SIZES.WIDTH_BASE * 0.9,
        marginTop: 10,
        alignSelf: 'center'
    },
});
