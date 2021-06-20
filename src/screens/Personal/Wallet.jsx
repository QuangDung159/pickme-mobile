import { CenterLoader, CustomButton, IconCustom } from '@components/uiComponents';
import {
    IconFamily, NowTheme, ScreenName
} from '@constants/index';
import { CommonHelpers, ToastHelpers } from '@helpers/index';
import { setCurrentUser, setListCashHistoryStore } from '@redux/Actions';
import { CashServices } from '@services/index';
import React, { useEffect, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

const {
    FONT: {
        MONTSERRAT_REGULAR,
    },
    SIZES,
    COLORS
} = NowTheme;

export default function Wallet({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const listCashHistoryStore = useSelector((state) => state.userReducer.listCashHistoryStore);
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
                    marginRight: 10,
                    alignItems: 'center',
                    flexDirection: 'row',
                    height: 55,
                    width: SIZES.WIDTH_BASE * 0.9,
                    alignSelf: 'center',
                }}
            >
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.1
                    }}
                >
                    <IconCustom
                        name={isIncrease ? 'chevron-circle-right' : 'chevron-circle-left'}
                        size={SIZES.FONT_H1 - 5}
                        color={COLORS.DEFAULT}
                        family={IconFamily.FONT_AWESOME}
                    />
                </View>
                {renderHistoryItemContent(item)}
            </View>
        );
    };

    const renderHistoryItemContent = (historyItem) => {
        const {
            content, isIncrease,
            amountChanged,
        } = historyItem;

        const amountChangedDisplay = CommonHelpers.generateMoneyStr(amountChanged);

        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: SIZES.WIDTH_BASE * 0.8,
                }}
            >
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.4
                    }}
                >
                    <Text
                        style={{
                            color: COLORS.DEFAULT,
                            fontSize: SIZES.FONT_H3,
                            fontFamily: MONTSERRAT_REGULAR,
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
                            fontFamily: MONTSERRAT_REGULAR,
                            color: COLORS.ACTIVE,
                            fontSize: SIZES.FONT_H3,
                        }}
                    >
                        {isIncrease ? `+ ${amountChangedDisplay}` : `- ${amountChangedDisplay}`}
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
                        fontFamily: MONTSERRAT_REGULAR,
                        fontSize: SIZES.FONT_H4
                    }}
                >
                    Số dư trong ví
                </Text>
                <View
                    style={{
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontFamily: MONTSERRAT_REGULAR,
                            fontSize: SIZES.FONT_H1,
                            color: COLORS.ACTIVE,
                        }}
                    >
                        {`${currentUser.walletAmountDisplay}k VND`}
                    </Text>
                </View>
            </View>
            <CustomButton
                onPress={() => navigation.navigate(ScreenName.CASH_IN)}
                labelStyle={{
                    fontSize: SIZES.FONT_H3,
                    color: COLORS.ACTIVE
                }}
                buttonStyle={{
                    width: SIZES.WIDTH_BASE * 0.35,
                    borderColor: COLORS.ACTIVE
                }}
                label="Nạp tiền"
            />
        </View>
    );

    const fetchHistory = async () => {
        const result = await CashServices.fetchCashHistoryAsync();
        const { data } = result;

        if (data) {
            const history = data.data;
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
        } else {
            setIsShowSpinner(false);
            setRefreshing(false);
        }
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
                        keyExtractor={(item) => `${item.navigationId}-${item.isIncrease}`}
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
                            fontFamily: MONTSERRAT_REGULAR,
                            color: COLORS.DEFAULT,
                            fontSize: SIZES.FONT_H2
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
                        height: 120,
                        width: SIZES.WIDTH_BASE * 0.9,
                        alignSelf: 'center',
                    }}
                >
                    {renderWalletAmountPanel()}
                </View>

                {isShowSpinner ? (
                    <View
                        style={{
                            marginTop: SIZES.HEIGHT_BASE * 0.1
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
