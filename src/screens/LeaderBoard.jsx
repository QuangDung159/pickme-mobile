/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { NO_AVATAR_URL } from '@env';
import { Block, Text } from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { CenterLoader, IconCustom } from '../components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '../constants';
import { ToastHelpers } from '../helpers';
import { rxUtil } from '../utils';

export default function LeaderBoard(props) {
    const { navigation } = props;

    const [tabActiveIndex, setTabActiveIndex] = useState(0);
    const [isShowSpinner, setIsShowSpinner] = useState(true);
    const [listGeneral, setlistGeneral] = useState({});

    const token = useSelector((state) => state.userReducer.token);

    const tabs = [
        {
            tabLabel: 'Kim cương',
            tabIcon: (
                <IconCustom
                    name="diamond"
                    family={IconFamily.SIMPLE_LINE_ICONS}
                    size={12}
                    color={NowTheme.COLORS.ACTIVE}
                />
            ),
            endpoint: Rx.PARTNER.LEADER_BOARD_DIAMOND
        },
        {
            tabLabel: 'Đơn hẹn',
            tabIcon: (
                <IconCustom
                    name="clipboard-list"
                    family={IconFamily.FONT_AWESOME_5}
                    size={NowTheme.SIZES.FONT_SUB_TITLE}
                    color={NowTheme.COLORS.ACTIVE}
                />
            ),
            endpoint: Rx.PARTNER.LEADER_BOARD_BOOKING
        },
        {
            tabLabel: 'Lượt thích',
            tabIcon: (
                <IconCustom
                    name="heart"
                    family={IconFamily.FONT_AWESOME}
                    size={NowTheme.SIZES.FONT_SUB_TITLE}
                    color={NowTheme.COLORS.ACTIVE}
                />
            ),
            endpoint: Rx.PARTNER.LEADER_BOARD_LIKE
        }
    ];

    useEffect(
        () => {
            tabs.forEach((tab, index) => {
                getListLeaderBoard(tab.endpoint, index);
            });
        }, []
    );

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const getListLeaderBoard = (endpoint, index) => {
        setIsShowSpinner(true);

        rxUtil(
            `${endpoint}`,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setIsShowSpinner(false);
                setlistGeneral((prevState) => ({ ...prevState, [index]: res.data.data }));
            },
            () => {
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            }
        );
    };

    const changeTabIndexActive = (tabIndex) => {
        setTabActiveIndex(tabIndex);
    };

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderLeaderBoardItem = (leaderBoardItem, index) => {
        if (index !== 0) {
            return (
                <TouchableWithoutFeedback
                    onPress={() => navigation.navigate(ScreenName.PROFILE, { userId: leaderBoardItem.userId })}
                >
                    <Block
                        row
                        flex
                        center
                        style={[
                            styles.leaderBoardItemContainer,
                            {
                                backgroundColor: !(index % 2 === 0) || NowTheme.COLORS.LIST_ITEM_BACKGROUND_1
                            }
                        ]}
                    >
                        <Block
                            middle
                            flex={1}
                        >
                            <Text
                                color={
                                    index === 1 || index === 2
                                        ? NowTheme.COLORS.ACTIVE
                                        : NowTheme.COLORS.DEFAULT
                                }
                                style={styles.titleBold}
                                size={20}
                            >
                                {index + 1}
                            </Text>
                        </Block>
                        <Block
                            middle
                            flex={2}
                            style={{
                                marginRight: 10,
                            }}
                        >
                            <Image
                                source={{
                                    uri: leaderBoardItem.url || NO_AVATAR_URL
                                }}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25
                                }}
                            />
                        </Block>
                        <Block
                            row
                            flex={7}
                            space="between"
                            style={{
                                marginRight: 10
                            }}
                        >
                            <Block
                                flex={7}
                            >
                                <Text
                                    color={NowTheme.COLORS.ACTIVE}
                                    size={16}
                                    fontFamily={NowTheme.FONT.MONTSERRAT_REGULAR}
                                >
                                    {leaderBoardItem.fullName}
                                </Text>
                            </Block>
                            <Block
                                flex={3}
                                middle
                                style={{
                                    alignItems: 'flex-end'
                                }}
                            >
                                <Text
                                    color={NowTheme.COLORS.ACTIVE}
                                    size={16}
                                    fontFamily={NowTheme.FONT.MONTSERRAT_REGULAR}
                                >
                                    {leaderBoardItem.achieveValue}
                                    {' '}
                                    {tabs[tabActiveIndex].tabIcon}
                                </Text>
                            </Block>
                        </Block>
                    </Block>
                </TouchableWithoutFeedback>
            );
        } return null;
    };

    const renderTopButton = (tab, index) => {
        const { tabLabel } = tab;
        return (
            <>
                <Block
                    key={index}
                    flex={3}
                    middle
                    style={[{
                        backgroundColor: !(index === tabActiveIndex)
                            ? NowTheme.COLORS.LIST_ITEM_BACKGROUND_1
                            : NowTheme.COLORS.BASE
                    }]}
                >
                    <TouchableWithoutFeedback
                        onPress={() => changeTabIndexActive(index)}
                    >
                        <Text
                            size={12}
                            color={(index === tabActiveIndex) ? NowTheme.COLORS.ACTIVE : NowTheme.COLORS.DEFAULT}
                            style={styles.titleBold}
                        >
                            {tabLabel}
                        </Text>
                    </TouchableWithoutFeedback>
                </Block>
            </>
        );
    };

    const renderAchieveValueTopPannel = (achieveValue) => (
        <Block middle row>
            <Text
                color={NowTheme.COLORS.ACTIVE}
                size={NowTheme.SIZES.FONT_INFO}
                style={[
                    styles.titleBold,
                    { marginRight: 5 }
                ]}
            >
                {achieveValue}
            </Text>
            <Text
                style={{ fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR }}
                size={NowTheme.SIZES.FONT_INFO}
                color={NowTheme.COLORS.DEFAULT}
            >
                {tabs[tabActiveIndex].tabLabel}
            </Text>
        </Block>
    );

    const renderTopPanel = () => {
        if (!listGeneral
            || !listGeneral[tabActiveIndex]
            || listGeneral[tabActiveIndex].length === 0) { return <></>; }

        // get first partner in list by tabActiveIndex
        const topOnePartner = listGeneral[tabActiveIndex][0];
        const {
            url,
            achieveValue,
            fullName
        } = topOnePartner;

        return (
            <Block
                flex
                middle
                style={{
                    paddingBottom: 15
                }}
            >
                <TouchableWithoutFeedback
                    onPress={() => navigation.navigate(ScreenName.PROFILE, { userId: topOnePartner.id })}
                >
                    <Block
                        style={{
                            padding: 10
                        }}
                    >
                        <CenterLoader />
                        <Image
                            source={url}
                            style={{
                                width: NowTheme.SIZES.WIDTH_BASE * 0.25,
                                height: NowTheme.SIZES.WIDTH_BASE * 0.25,
                                borderRadius: 75,
                            }}
                        />
                        <Block
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
                        </Block>
                    </Block>
                </TouchableWithoutFeedback>

                <Block
                    style={{
                        width: NowTheme.SIZES.WIDTH_BASE,
                    }}
                >
                    <Block
                        middle
                        style={{
                            marginVertical: 10
                        }}
                    >
                        <Text
                            style={styles.titleBold}
                            size={20}
                            color={NowTheme.COLORS.ACTIVE}
                        >
                            {fullName}
                        </Text>
                    </Block>
                    <Block>
                        {renderAchieveValueTopPannel(achieveValue)}
                    </Block>
                </Block>
            </Block>
        );
    };

    try {
        return (
            <>
                <Block
                    style={[{
                        height: NowTheme.SIZES.HEIGHT_BASE * 0.4,
                        alignItems: 'center',
                    }, styles.shadow]}
                >
                    <Block
                        row
                        style={[{
                            marginBottom: 20,
                            height: NowTheme.SIZES.HEIGHT_BASE * 0.06
                        }]}
                    >
                        {tabs.map((tab, index) => renderTopButton(tab, index))}
                    </Block>

                    {renderTopPanel()}
                </Block>
                {isShowSpinner ? (
                    <Block
                        style={styles.centerLoaderContainer}
                    >
                        <CenterLoader />
                    </Block>
                ) : (
                    <FlatList
                        data={listGeneral[tabActiveIndex]}
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
    leaderBoardItemContainer: {
        height: NowTheme.SIZES.HEIGHT_BASE * 0.1,
    },
    titleBold: {
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
    },
    centerLoaderContainer: {
        marginTop: NowTheme.SIZES.HEIGHT_BASE * 0.2
    }
});
