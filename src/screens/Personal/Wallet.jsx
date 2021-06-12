import React, { useEffect, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { CenterLoader, CustomButton, IconCustom } from '../../components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '../../constants';
import { ToastHelpers } from '../../helpers';
import { setCurrentUser, setListCashHistoryStore } from '../../redux/Actions';
import { rxUtil } from '../../utils';

export default function Wallet({ navigation }) {
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
            <View
                style={{
                    height: NowTheme.SIZES.HEIGHT_BASE * 0.08,
                    width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                    alignSelf: 'center',
                    flexDirection: 'row'
                }}
            >
                <View
                    style={{
                        marginRight: 10,
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}
                >
                    <View
                        style={{
                            width: NowTheme.SIZES.WIDTH_BASE * 0.1
                        }}
                    >
                        <IconCustom
                            name={isIncrease ? 'chevron-circle-right' : 'chevron-circle-left'}
                            size={NowTheme.SIZES.FONT_H1}
                            color={NowTheme.COLORS.DEFAULT}
                            family={IconFamily.FONT_AWESOME}
                        />
                    </View>
                    {renderHistoryItemContent(item)}
                </View>
            </View>
        );
    };

    const renderHistoryItemContent = (historyItem) => {
        const {
            content, isIncrease,
            amountChanged,
        } = historyItem;

        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: NowTheme.SIZES.WIDTH_BASE * 0.8
                }}
            >
                <View
                    style={{
                        width: NowTheme.SIZES.WIDTH_BASE * 0.4
                    }}
                >
                    <Text
                        style={{
                            color: NowTheme.COLORS.DEFAULT,
                            fontSize: NowTheme.SIZES.FONT_H3,
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        }}
                    >
                        {content}
                    </Text>
                </View>
                <View
                    style={{
                        alignSelf: 'center'
                    }}
                >
                    <Text
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                            color: NowTheme.COLORS.ACTIVE,
                            fontSize: NowTheme.SIZES.FONT_H2,
                        }}
                    >
                        {isIncrease ? `+ ${amountChanged}k` : `- ${amountChanged}k`}
                    </Text>
                </View>
            </View>
        );
    };

    const renderWalletAmountPanel = () => (
        <View
            style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1
            }}
        >
            <View
                style={{
                    alignItems: 'center',
                    alignSelf: 'center'
                }}
            >
                <Text
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        fontSize: NowTheme.SIZES.FONT_H4
                    }}
                >
                    Số dư trong rương
                </Text>
                <View
                    style={{
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                            fontSize: NowTheme.SIZES.FONT_H1 + 10,
                            color: NowTheme.COLORS.ACTIVE,
                        }}
                    >
                        {`${currentUser.walletAmount}k`}
                    </Text>
                </View>
            </View>
            <CustomButton
                onPress={() => navigation.navigate(ScreenName.CASH_IN)}
                labelStyle={{
                    fontSize: NowTheme.SIZES.FONT_H3,
                    color: NowTheme.COLORS.ACTIVE
                }}
                buttonStyle={{
                    width: NowTheme.SIZES.WIDTH_BASE * 0.45,
                    borderColor: NowTheme.COLORS.ACTIVE
                }}
                label="Nạp tiền"
            />
        </View>
    );

    const fetchHistory = () => {
        rxUtil(
            Rx.CASH.GET_CASH_HISTORY,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                const history = res.data.data;
                if (history && history.length !== 0) {
                    dispatch(setListCashHistoryStore(history));
                    const latestUpdatedAmount = history[0].updatedWalletAmount;

                    dispatch(setCurrentUser({
                        ...currentUser,
                        walletAmount: latestUpdatedAmount
                    }));
                }
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
                <View
                    style={{
                        flex: 1
                    }}
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
                </View>
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
                <View
                    style={{
                        alignItems: 'center',
                        marginVertical: 15
                    }}
                >
                    <Text
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                            color: NowTheme.COLORS.DEFAULT,
                            fontSize: NowTheme.SIZES.FONT_H2
                        }}
                    >
                        Danh sách trống
                    </Text>
                </View>
            </ScrollView>
        );
    };

    try {
        return (
            <>
                <View
                    style={{
                        height: NowTheme.SIZES.HEIGHT_BASE * 0.15,
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                        alignSelf: 'center',
                        marginTop: 10
                    }}
                >
                    {renderWalletAmountPanel()}
                </View>
                <>
                    {isShowSpinner ? (
                        <View
                            style={{
                                marginTop: NowTheme.SIZES.HEIGHT_BASE * 0.1
                            }}
                        >
                            <CenterLoader />
                        </View>
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
