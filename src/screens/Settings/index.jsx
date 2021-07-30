import { IconCustom, Switch } from '@components/uiComponents';
import { Theme } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    ScrollView, StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
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

const payment = [
    { title: 'Manage Payment Options', id: 'Payment', type: 'button' },
    { title: 'Manage Gift Cards', id: 'gift', type: 'button' }
];

const privacy = [
    { title: 'User Agreement', id: 'Agreement', type: 'button' },
    { title: 'Privacy', id: 'Privacy', type: 'button' },
    { title: 'About', id: 'About', type: 'button' }
];

export default function Settings({ navigation }) {
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
                        style={
                            [
                                styles.rows,
                                {
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }
                            ]
                        }
                    >
                        <Text
                            style={{
                                fontFamily: TEXT_REGULAR,
                                fontSize: SIZES.FONT_H4,
                                color: '#525F7F'
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
            case 'button':
                return (
                    <View style={styles.rows}>
                        <TouchableOpacity onPress={() => navigation.navigate(item.id)}>
                            <View
                                style={{
                                    paddingTop: 7,
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: TEXT_REGULAR,
                                        fontSize: SIZES.FONT_H4,
                                        color: '#525F7F'
                                    }}
                                >
                                    {item.title}
                                </Text>
                                <IconCustom
                                    name="angle-right"
                                    family="font-awesome"
                                    style={{ paddingRight: 5 }}
                                />
                            </View>
                        </TouchableOpacity>
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
                    ListHeaderComponent={(
                        <View
                            style={
                                [
                                    styles.title,
                                    {
                                        alignSelf: 'center'
                                    }
                                ]
                            }
                        >
                            <Text
                                style={{
                                    fontFamily: TEXT_BOLD,
                                    paddingBottom: 5,
                                    fontSize: SIZES.FONT_H2,
                                    color: COLORS.TEXT,
                                }}
                            >
                                Recommended Settings
                            </Text>
                            <Text
                                style={{
                                    fontFamily: TEXT_REGULAR,
                                    fontSize: 12,
                                    color: COLORS.ACTIVE,
                                }}
                            >
                                These are the most important settings
                            </Text>
                        </View>
                    )}
                />
                <View
                    style={
                        [
                            styles.title,
                            {
                                alignSelf: 'center'
                            }
                        ]
                    }
                >
                    <Text
                        style={{
                            fontFamily: TEXT_BOLD,
                            paddingBottom: 5,
                            fontSize: SIZES.FONT_H2,
                            color: COLORS.TEXT,
                        }}
                    >
                        Payment Settings
                    </Text>
                    <Text
                        style={{
                            fontFamily: TEXT_REGULAR,
                            fontSize: 12,
                            color: COLORS.ACTIVE,
                        }}
                    >
                        These are also important settings
                    </Text>
                </View>

                <FlatList
                    data={payment}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />

                <View
                    style={
                        [
                            styles.title,
                            {
                                alignSelf: 'center'
                            }
                        ]
                    }
                >
                    <Text
                        style={{
                            fontFamily: TEXT_BOLD,
                            paddingBottom: 5,
                            fontSize: SIZES.BASE,
                            color: COLORS.TEXT,
                        }}
                    >
                        Privacy Settings
                    </Text>
                    <Text
                        style={{
                            fontFamily: TEXT_REGULAR,
                            fontSize: 12,
                            color: COLORS.ACTIVE,
                        }}
                    >
                        Third most important settings
                    </Text>
                </View>
                <FlatList
                    data={privacy}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
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
        paddingHorizontal: 10
    },
    title: {
        paddingVertical: 10
    },
    rows: {
        height: 30,
        paddingHorizontal: 10,
        marginBottom: 10
    }
});
