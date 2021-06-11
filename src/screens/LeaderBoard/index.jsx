/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { NO_AVATAR_URL } from '@env';
import React, { useEffect, useState } from 'react';
import {
    Image, StyleSheet, Text, View
} from 'react-native';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { CenterLoader, IconCustom, TopTabBar } from '../../components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '../../constants';
import { ToastHelpers } from '../../helpers';

export default function LeaderBoard({ navigation }) {
    const [tabActiveIndex, setTabActiveIndex] = useState(0);
    const [listLeaderBoard, setListLeaderBoard] = useState([]);

    const pickMeInfoStore = useSelector((state) => state.appConfigReducer.pickMeInfoStore);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const tabs = [
        {
            tabLabel: 'Đơn hẹn',
            tabIcon: (
                <IconCustom
                    name="list-alt"
                    family={IconFamily.FONT_AWESOME}
                    size={24}
                    color={NowTheme.COLORS.ACTIVE}
                />
            ),
            endpoint: Rx.PARTNER.LEADER_BOARD_BOOKING
        },
        {
            tabLabel: 'Kim cương',
            tabIcon: (
                <IconCustom
                    name="diamond"
                    family={IconFamily.SIMPLE_LINE_ICONS}
                    size={24}
                    color={NowTheme.COLORS.ACTIVE}
                />
            ),
            endpoint: Rx.PARTNER.LEADER_BOARD_DIAMOND
        }
    ];

    useEffect(
        () => {
            if (pickMeInfoStore) {
                setListLeaderBoard(pickMeInfoStore.booking);
            }
        }, []
    );

    useEffect(
        () => {
            if (isSignInOtherDeviceStore) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: ScreenName.SIGN_IN_WITH_OTP }],
                });
            }
        }, [isSignInOtherDeviceStore]
    );

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderLeaderBoardItem = (leaderBoardItem, index) => {
        if (index !== 0) {
            return (
                <TouchableWithoutFeedback
                    onPress={() => navigation.navigate(ScreenName.PROFILE, { userId: leaderBoardItem.userId })}
                >
                    <View
                        style={[
                            styles.leaderBoardItemContainer,
                            {
                                backgroundColor: !(index % 2 === 0) || NowTheme.COLORS.LIST_ITEM_BACKGROUND_1,
                                flexDirection: 'row',
                                alignSelf: 'center',
                                width: NowTheme.SIZES.WIDTH_BASE
                            }
                        ]}
                    >
                        <View
                            style={{
                                alignSelf: 'center',
                                alignItems: 'center',
                                width: NowTheme.SIZES.WIDTH_BASE * 0.1
                            }}
                        >
                            <Text
                                color={
                                    index === 1 || index === 2
                                        ? NowTheme.COLORS.ACTIVE
                                        : NowTheme.COLORS.DEFAULT
                                }
                                style={{
                                    color: index === 1 || index === 2
                                        ? NowTheme.COLORS.ACTIVE
                                        : NowTheme.COLORS.DEFAULT,
                                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                    fontSize: NowTheme.SIZES.FONT_H2
                                }}
                            >
                                {index + 1}
                            </Text>
                        </View>
                        <View
                            style={{
                                marginRight: 10,
                                alignSelf: 'center',
                                alignItems: 'center',
                                width: NowTheme.SIZES.WIDTH_BASE * 0.15,
                                paddingVertical: 5
                            }}
                        >
                            <Image
                                source={{
                                    uri: leaderBoardItem.url || NO_AVATAR_URL
                                }}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                }}
                            />
                        </View>
                        <View
                            style={{
                                marginRight: 10,
                                alignSelf: 'center',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                            }}
                        >
                            <View
                                style={{
                                    width: NowTheme.SIZES.WIDTH_BASE * 0.5
                                }}
                            >
                                <Text
                                    style={{
                                        color: NowTheme.COLORS.ACTIVE,
                                        fontSize: NowTheme.SIZES.FONT_H2,
                                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                        paddingVertical: 10
                                    }}
                                >
                                    {leaderBoardItem.fullName}
                                </Text>
                            </View>
                            <View
                                style={{
                                    width: NowTheme.SIZES.WIDTH_BASE * 0.2,
                                }}
                            >
                                {renderAchieveValueTopPanel(leaderBoardItem.value)}
                            </View>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        } return null;
    };

    const renderAchieveValueTopPanel = (achieveValue) => (
        <View
            style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
            }}
        >
            <Text
                style={{
                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                    color: NowTheme.COLORS.ACTIVE,
                    fontSize: NowTheme.SIZES.FONT_H1,
                }}
            >
                {achieveValue}
                {' '}
                {tabs[tabActiveIndex].tabIcon}
            </Text>
        </View>
    );

    const renderTopPanel = () => {
        if (!pickMeInfoStore || (!listLeaderBoard || listLeaderBoard.length === 0)) return <></>;

        // get first partner in list by tabActiveIndex
        const topOnePartner = listLeaderBoard[0];
        const {
            url,
            value,
            fullName
        } = topOnePartner;

        return (
            <View
                style={{
                    alignSelf: 'center',
                    alignItems: 'center',
                    paddingTop: 20
                }}
            >
                <TouchableWithoutFeedback
                    onPress={() => navigation.navigate(ScreenName.PROFILE, { userId: topOnePartner.userId })}
                >
                    <View
                        style={{
                            padding: 10
                        }}
                    >
                        <CenterLoader />
                        <Image
                            source={{
                                uri: url || NO_AVATAR_URL
                            }}
                            style={{
                                width: NowTheme.SIZES.WIDTH_BASE * 0.25,
                                height: NowTheme.SIZES.WIDTH_BASE * 0.25,
                                borderRadius: 75,
                                zIndex: 99,
                            }}
                        />
                        <View
                            style={{
                                position: 'absolute',
                                zIndex: 10,
                                right: 0,
                                top: 0,
                                transform: [{ rotate: '45deg' }]
                            }}
                        >
                            <IconCustom
                                name="crown"
                                family={IconFamily.FONT_AWESOME_5}
                                size={24}
                                color={NowTheme.COLORS.ACTIVE}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>

                <View
                    style={{
                        width: NowTheme.SIZES.WIDTH_BASE,
                    }}
                >
                    <View
                        style={{
                            marginVertical: 10,
                            alignSelf: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                                fontSize: NowTheme.SIZES.FONT_H1,
                                color: NowTheme.COLORS.ACTIVE
                            }}

                        >
                            {fullName}
                        </Text>
                    </View>
                    <View
                        style={{
                            alignSelf: 'center'
                        }}
                    >
                        {renderAchieveValueTopPanel(value)}
                    </View>
                </View>
            </View>
        );
    };

    try {
        return (
            <>
                <View
                    style={[{
                        height: 320,
                        alignItems: 'center',
                    }, styles.shadow]}
                >
                    <TopTabBar
                        tabs={tabs}
                        tabActiveIndex={tabActiveIndex}
                        setTabActiveIndex={(index) => setTabActiveIndex(index)}
                    />

                    {renderTopPanel()}
                </View>
                {listLeaderBoard && listLeaderBoard.length !== 0 && (
                    <FlatList
                        data={listLeaderBoard}
                        keyExtractor={(item) => item.userId}
                        renderItem={({ item, index }) => renderLeaderBoardItem(item, index)}
                    />
                )}

            </>
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
    shadow: {
        backgroundColor: NowTheme.COLORS.BASE,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.2,
        elevation: 3
    },
});
