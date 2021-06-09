import { Block, Button, Text } from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { CenterLoader, IconCustom } from '../../components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '../../constants';
import { ToastHelpers } from '../../helpers';
import { setListCashHistoryStore } from '../../redux/Actions';
import { rxUtil } from '../../utils';

export default function Wallet({ navigation, route }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const listCashHistoryStore = useSelector((state) => state.userReducer.listCashHistoryStore);
    const token = useSelector((state) => state.userReducer.token);

    const dispatch = useDispatch();

    useEffect(
        () => {
            if (!listCashHistoryStore || listCashHistoryStore.length === 0) {
                setIsShowSpinner(true);
                fetchHistory();
            }

            const eventTriggerGetListHistory = navigation.addListener('focus', () => {
                fetchHistory();
            });

            return eventTriggerGetListHistory;
        }, []
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    const renderHistoryItem = (item) => {
        const { isIncrease } = item;

        return (
            <Block>
                <Block
                    row
                    center
                    style={{
                        height: NowTheme.SIZES.HEIGHT_BASE * 0.1,
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                        alignSelf: 'center'
                    }}
                >
                    <Block style={{
                        marginRight: 10
                    }}
                    >
                        <IconCustom
                            name={isIncrease ? 'chevron-circle-right' : 'chevron-circle-left'}
                            size={NowTheme.SIZES.FONT_H1}
                            color={NowTheme.COLORS.DEFAULT}
                            family={IconFamily.FONT_AWESOME}
                        />
                    </Block>
                    {renderHistoryItemContent(item)}
                </Block>
            </Block>
        );
    };

    const renderHistoryItemContent = (historyItem) => {
        const {
            content, isIncrease,
            amountChanged,
        } = historyItem;

        return (
            <Block
                flex
            >
                <Block
                    row
                    space="between"
                >
                    <Block
                        style={{
                            width: NowTheme.SIZES.WIDTH_BASE * 0.6
                        }}
                    >
                        <Text
                            color={NowTheme.COLORS.DEFAULT}
                            size={NowTheme.SIZES.FONT_H3}
                            fontFamily={NowTheme.FONT.MONTSERRAT_REGULAR}
                        >
                            {content}
                        </Text>
                    </Block>
                    <Block
                        row
                        space="between"
                        center
                    >
                        <Text
                            color={NowTheme.COLORS.ACTIVE}
                            size={16}
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                                marginRight: 5
                            }}
                        >
                            {isIncrease ? `+ ${amountChanged}` : `- ${amountChanged}`}
                        </Text>
                        <IconCustom
                            name="diamond"
                            family={IconFamily.SIMPLE_LINE_ICONS}
                            size={16}
                            color={NowTheme.COLORS.ACTIVE}
                        />
                    </Block>
                </Block>
            </Block>
        );
    };

    const renderWalletAmountPanel = () => {
        const walletAmountFormCashOut = route?.params?.walletAmountFromCashOut || currentUser.walletAmount;
        return (
            <Block
                flex
                style={{
                    alignItems: 'center'
                }}
                row
                space="between"
            >
                <Block>
                    <Text
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                        }}
                        size={NowTheme.SIZES.FONT_H4}
                    >
                        Số dư trong rương
                    </Text>
                    <Block
                        row
                        style={{
                            alignItems: 'center'
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                            }}
                            size={NowTheme.SIZES.FONT_H1 + 10}
                            color={NowTheme.COLORS.ACTIVE}
                        >
                            {walletAmountFormCashOut}
                        </Text>
                        <IconCustom
                            name="diamond"
                            family={IconFamily.SIMPLE_LINE_ICONS}
                            size={NowTheme.SIZES.FONT_H1}
                            color={NowTheme.COLORS.ACTIVE}
                        />
                    </Block>
                </Block>
                <Block>
                    <Button
                        onPress={() => navigation.navigate(ScreenName.CASH_IN)}
                        style={{
                            width: NowTheme.SIZES.WIDTH_BASE * 0.4,
                            margin: 0
                        }}
                        shadowless
                    >
                        Nạp kim cương
                    </Button>
                </Block>
            </Block>
        );
    };

    const fetchHistory = () => {
        rxUtil(
            Rx.CASH.GET_CASH_HISTORY,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                dispatch(setListCashHistoryStore(res.data.data));
                setIsShowSpinner(false);
                setRefreshing(false);
            },
            (res) => {
                setIsShowSpinner(false);
                setRefreshing(false);
                ToastHelpers.renderToast(res.data.message, 'error');
            },
            (res) => {
                setIsShowSpinner(false);
                setRefreshing(false);
                ToastHelpers.renderToast(res.data.message, 'error');
            }
        );
    };

    const renderHistory = () => {
        if (listCashHistoryStore && listCashHistoryStore.length !== 0) {
            return (
                <Block
                    flex
                >
                    <FlatList
                        data={listCashHistoryStore}
                        keyExtractor={(item) => item.navigationId}
                        renderItem={({ item }) => renderHistoryItem(item)}
                        showsVerticalScrollIndicator={false}
                        refreshControl={(
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => onRefresh()}
                            />
                        )}
                    />
                </Block>
            );
        }

        return (
            <ScrollView
                refreshControl={(
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                    />
                )}
            >
                <Block
                    style={{
                        alignItems: 'center',
                        marginVertical: 15
                    }}
                >
                    <Text
                        color={NowTheme.COLORS.SWITCH_OFF}
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        }}
                        size={NowTheme.SIZES.FONT_H2}
                    >
                        Danh sách trống
                    </Text>
                </Block>
            </ScrollView>
        );
    };

    try {
        return (
            <>
                <Block
                    style={{
                        height: NowTheme.SIZES.HEIGHT_BASE * 0.15,
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                        alignSelf: 'center',
                        marginTop: 10
                    }}
                >
                    {renderWalletAmountPanel()}
                </Block>
                <>
                    {isShowSpinner ? (
                        <Block
                            style={{
                                marginTop: NowTheme.SIZES.HEIGHT_BASE * 0.1
                            }}
                        >
                            <CenterLoader />
                        </Block>
                    ) : (
                        <>
                            {renderHistory()}
                        </>
                    )}
                </>
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
