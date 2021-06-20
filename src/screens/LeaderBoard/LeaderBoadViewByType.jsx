/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { IconCustom } from '@components/uiComponents';
import { IconFamily, NowTheme, ScreenName } from '@constants';
import { NO_AVATAR_URL } from '@env';
import React from 'react';
import {
    Image, StyleSheet, Text, View
} from 'react-native';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

const {
    FONT: {
        MONTSERRAT_BOLD,
        MONTSERRAT_REGULAR
    },
    SIZES,
    COLORS
} = NowTheme;

export default function LeaderBoadViewByType({
    navigation, tabs, tabActiveIndex, listLeaderBoard
}) {
    const pickMeInfoStore = useSelector((state) => state.appConfigReducer.pickMeInfoStore);

    const renderAchieveValueTopPanel = (achieveValue) => (
        <View
            style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
            }}
        >
            <Text
                style={{
                    fontFamily: MONTSERRAT_REGULAR,
                    color: COLORS.ACTIVE,
                    fontSize: SIZES.FONT_H1,
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

        const {
            url,
            value,
            fullName
        } = listLeaderBoard[tabActiveIndex];

        return (
            <View
                style={{
                    alignSelf: 'center',
                    alignItems: 'center',
                    height: 230,
                }}
            >
                <TouchableWithoutFeedback
                    onPress={
                        () => navigation.navigate(
                            ScreenName.PROFILE,
                            {
                                userId: listLeaderBoard[tabActiveIndex].userId
                            }
                        )
                    }

                >
                    <View
                        style={{
                            padding: 10,
                            paddingTop: 20
                        }}
                    >
                        <Image
                            source={{
                                uri: url || NO_AVATAR_URL
                            }}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                zIndex: 99,
                            }}
                        />
                        <View
                            style={{
                                position: 'absolute',
                                zIndex: 10,
                                right: 0,
                                top: 10,
                                transform: [{ rotate: '45deg' }]
                            }}
                        >
                            <IconCustom
                                name="crown"
                                family={IconFamily.FONT_AWESOME_5}
                                size={24}
                                color={COLORS.ACTIVE}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>

                <View
                    style={{
                        width: SIZES.WIDTH_BASE,
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
                                fontFamily: MONTSERRAT_BOLD,
                                fontSize: SIZES.FONT_H1 - 5,
                                color: COLORS.ACTIVE
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

    const renderListItem = () => (
        <View
            style={{
                flex: 1
            }}
        >
            {listLeaderBoard && listLeaderBoard.length !== 0 && (
                <FlatList
                    data={listLeaderBoard}
                    keyExtractor={(item) => item.userId}
                    renderItem={({ item, index }) => renderLeaderBoardItem(item, index)}
                />
            )}
        </View>
    );

    const renderLeaderBoardItem = (leaderBoardItem, index) => {
        if (index !== 0) {
            return (
                <TouchableWithoutFeedback
                    onPress={() => navigation.navigate(ScreenName.PROFILE, { userId: leaderBoardItem.userId })}
                >
                    <View
                        style={[
                            {
                                backgroundColor: !(index % 2 === 0) || COLORS.LIST_ITEM_BACKGROUND_1,
                                flexDirection: 'row',
                                alignSelf: 'center',
                                width: SIZES.WIDTH_BASE,
                                height: 70
                            }
                        ]}
                    >
                        <View
                            style={{
                                alignSelf: 'center',
                                alignItems: 'center',
                                width: SIZES.WIDTH_BASE * 0.1
                            }}
                        >
                            <Text
                                color={
                                    index === 1 || index === 2
                                        ? COLORS.ACTIVE
                                        : COLORS.DEFAULT
                                }
                                style={{
                                    color: index === 1 || index === 2
                                        ? COLORS.ACTIVE
                                        : COLORS.DEFAULT,
                                    fontFamily: MONTSERRAT_REGULAR,
                                    fontSize: SIZES.FONT_H2
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
                                width: SIZES.WIDTH_BASE * 0.15,
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
                                    width: SIZES.WIDTH_BASE * 0.5
                                }}
                            >
                                <Text
                                    style={{
                                        color: COLORS.ACTIVE,
                                        fontSize: SIZES.FONT_H2,
                                        fontFamily: MONTSERRAT_REGULAR,
                                        paddingVertical: 10
                                    }}
                                >
                                    {leaderBoardItem.fullName}
                                </Text>
                            </View>
                            <View
                                style={{
                                    width: SIZES.WIDTH_BASE * 0.2,
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

    return (
        <View
            style={{
                flex: 1
            }}
        >
            <View
                style={styles.shadow}
            >
                {renderTopPanel()}
            </View>
            {renderListItem()}
        </View>
    );
}

const styles = StyleSheet.create({
    shadow: {
        backgroundColor: COLORS.BASE,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.2,
        elevation: 3
    },
});
