import {
    Block, Icon, Text, theme
} from 'galio-framework';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    ScrollView, StyleSheet,
    TouchableOpacity
} from 'react-native';
import { Switch } from '../components/uiComponents';
import { NowTheme } from '../constants';
import { ToastHelpers } from '../helpers';

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
                    <Block row middle space="between" style={styles.rows}>
                        <Text
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                            }}
                            size={NowTheme.SIZES.FONT_H4}
                            color="#525F7F"
                        >
                            {item.title}
                        </Text>
                        <Switch
                            onValueChange={() => toggleSwitch(item.id)}
                            value={item.status}
                        />
                    </Block>
                );
            case 'button':
                return (
                    <Block style={styles.rows}>
                        <TouchableOpacity onPress={() => navigation.navigate(item.id)}>
                            <Block row middle space="between" style={{ paddingTop: 7 }}>
                                <Text
                                    style={{ fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR }}
                                    size={NowTheme.SIZES.FONT_H4}
                                    color="#525F7F"
                                >
                                    {item.title}
                                </Text>
                                <Icon
                                    name="angle-right"
                                    family="font-awesome"
                                    style={{ paddingRight: 5 }}
                                />
                            </Block>
                        </TouchableOpacity>
                    </Block>
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
                        <Block center style={styles.title}>
                            <Text
                                style={{ fontFamily: NowTheme.FONT.MONTSERRAT_BOLD, paddingBottom: 5 }}
                                size={theme.SIZES.BASE}
                                color={NowTheme.COLORS.TEXT}
                            >
                                Recommended Settings
                            </Text>
                            <Text
                                style={{ fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR }}
                                size={12}
                                color={NowTheme.COLORS.CAPTION}
                            >
                                These are the most important settings
                            </Text>
                        </Block>
                    )}
                />
                <Block center style={styles.title}>
                    <Text
                        style={{ fontFamily: NowTheme.FONT.MONTSERRAT_BOLD, paddingBottom: 5 }}
                        size={theme.SIZES.BASE}
                        color={NowTheme.COLORS.TEXT}
                    >
                        Payment Settings
                    </Text>
                    <Text
                        style={{ fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR }}
                        size={12}
                        color={NowTheme.COLORS.CAPTION}
                    >
                        These are also important settings
                    </Text>
                </Block>

                <FlatList
                    data={payment}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />

                <Block center style={styles.title}>
                    <Text
                        style={{ fontFamily: NowTheme.FONT.MONTSERRAT_BOLD, paddingBottom: 5 }}
                        size={theme.SIZES.BASE}
                        color={NowTheme.COLORS.TEXT}
                    >
                        Privacy Settings
                    </Text>
                    <Text
                        style={{ fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR }}
                        size={12}
                        color={NowTheme.COLORS.CAPTION}
                    >
                        Third most important settings
                    </Text>
                </Block>
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
