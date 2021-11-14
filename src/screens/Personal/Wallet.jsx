import { CenterLoader, CustomButton, IconCustom } from '@components/uiComponents';
import {
    IconFamily, ScreenName, Theme
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
        TEXT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;

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
                    flexDirection: 'row',
                    height: 55,
                    width: SIZES.WIDTH_BASE * 0.9,
                    alignSelf: 'center',
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.05,
                    }}
                >
                    <IconCustom
                        name={isIncrease ? 'chevron-circle-right' : 'chevron-circle-left'}
                        size={SIZES.FONT_H1 - 6}
                        color={isIncrease ? COLORS.ACTIVE : COLORS.DEFAULT}
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
                    width: SIZES.WIDTH_BASE * 0.85,
                }}
            >
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.6,
                    }}
                >
                    <Text
                        style={{
                            color: isIncrease ? COLORS.ACTIVE : COLORS.DEFAULT,
                            fontSize: SIZES.FONT_H3,
                            fontFamily: TEXT_REGULAR,
                            marginLeft: 5
                        }}
                    >
                        {content}
                    </Text>
                </View>
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.2,
                        alignItems: 'flex-end'
                    }}
                >
                    <Text
                        style={{
                            fontFamily: TEXT_REGULAR,
                            color: isIncrease ? COLORS.ACTIVE : COLORS.DEFAULT,
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
                        fontFamily: TEXT_REGULAR,
                        fontSize: SIZES.FONT_H4,
                        color: COLORS.DEFAULT
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
                            fontFamily: TEXT_REGULAR,
                            fontSize: SIZES.FONT_H1 + 5,
                            color: COLORS.ACTIVE,
                        }}
                    >
                        {`${currentUser.walletAmount}`}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    flexDirection: 'column'
                }}
            >
                <CustomButton
                    onPress={() => navigation.navigate(ScreenName.CASH_OUT)}
                    labelStyle={{
                        fontSize: SIZES.FONT_H3,
                        color: COLORS.DEFAULT
                    }}
                    buttonStyle={{
                        width: SIZES.WIDTH_BASE * 0.35,
                        borderColor: COLORS.DEFAULT,
                        marginBottom: 5
                    }}
                    label="Rút tiền"
                />
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
        }
        setIsShowSpinner(false);
        setRefreshing(false);
    };

    const renderHistory = () => {
        if (listCashHistoryStore && listCashHistoryStore.length !== 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        backgroundColor: COLORS.BASE,
                        marginTop: 5
                    }}
                >
                    <FlatList
                        data={listCashHistoryStore}
                        keyExtractor={(item) => item.traceId}
                        renderItem={({ item }) => renderHistoryItem(item)}
                        showsVerticalScrollIndicator={false}
                        refreshControl={(
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => onRefresh()}
                                tintColor={COLORS.ACTIVE}
                            />
                        )}
                        contentContainerStyle={{
                            marginTop: 10
                        }}
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
                        tintColor={COLORS.ACTIVE}
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
                            fontFamily: TEXT_REGULAR,
                            color: COLORS.DEFAULT,
                            fontSize: SIZES.FONT_H3
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
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <>
                        <View
                            style={{
                                backgroundColor: COLORS.BASE,
                                marginTop: 5
                            }}
                        >
                            <View
                                style={{
                                    height: 120,
                                    width: SIZES.WIDTH_BASE * 0.9,
                                    alignSelf: 'center',
                                    borderBottomWidth: 0.5,
                                    borderBottomColor: COLORS.ACTIVE
                                }}
                            >
                                {renderWalletAmountPanel()}
                            </View>
                        </View>

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
