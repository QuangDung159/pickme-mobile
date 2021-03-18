import { Block, Button, Text } from 'galio-framework';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { CenterLoader, IconCustom } from '../components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '../constants';
import { ToastHelpers } from '../helpers';
import { setCurrentUser } from '../redux/Actions';
import { rxUtil } from '../utils';

export default function Wallet(props) {
    const { navigation, route } = props;

    const [listCashIn, setListCashIn] = useState([]);
    const [listCashOut, setListCashOut] = useState([]);
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const token = useSelector((state) => state.userReducer.token);

    const dispatch = useDispatch();

    useEffect(
        () => {
            setIsShowSpinner(true);
            getListHistory();
            getCurrentUser();

            const eventTriggerGetListHistory = navigation.addListener('focus', () => {
                getListHistory();
                getCurrentUser();
            });

            // componentWillUnmount
            // cleanup
            return eventTriggerGetListHistory;
        }, []
    );

    const getListHistory = () => {
        getListCashIn();
    };

    const getCurrentUser = () => {
        rxUtil(
            Rx.USER.CURRENT_USER_INFO,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                dispatch(setCurrentUser(res.data.data));
            },
            () => {},
            () => {}
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        getListHistory();
    };

    const getListCashIn = () => {
        rxUtil(
            Rx.CASH_REQUEST.GET_LIST_CASH_IN,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setListCashIn(res.data.data);
                setIsShowSpinner(false);
                getListCashOut();
            },
            () => {
                setIsShowSpinner(false);
                setRefreshing(false);
            },
            () => {
                setIsShowSpinner(false);
                setRefreshing(false);
            }
        );
    };

    const getListCashOut = () => {
        rxUtil(
            Rx.CASH_REQUEST.GET_LIST_CASH_OUT,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setIsShowSpinner(false);
                setListCashOut(res.data.data);
                setRefreshing(false);
            },
            () => {
                setIsShowSpinner(false);
                setRefreshing(false);
            },
            () => {
                setIsShowSpinner(false);
                setRefreshing(false);
            }
        );
    };

    const listCashRequestMapper = (listCash, type) => {
        listCash.forEach((item) => {
            // eslint-disable-next-line no-param-reassign
            item.type = type;
        });
    };

    const combineListCashTraffic = () => {
        listCashRequestMapper(listCashIn, 1);
        listCashRequestMapper(listCashOut, 0);

        // merge 2 array and re-asign listCashIn
        const listHistory = listCashIn.concat(listCashOut);
        shortListHistoryByDate(listHistory);

        return listHistory;
    };

    const shortListHistoryByDate = (listHistory) => {
        listHistory.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    };

    const renderHistoryItem = (item) => {
        const { type } = item;
        const backgroundColor = type === 1
            ? NowTheme.COLORS.LIST_ITEM_BACKGROUND_1 : NowTheme.COLORS.LIST_ITEM_BACKGROUND_2;

        return (
        // 1: cash in
        // 0: cash out
            <Block
                style={{
                    backgroundColor
                }}
            >
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
                        {/* <IconCustom
                            name={type === 1 ? 'chevron-circle-right' : 'chevron-circle-left'}
                            size={30}
                            color={NowTheme.COLORS.DEFAULT}
                            family={IconFamily.FONT_AWESOME}
                        /> */}
                        <IconCustom
                            name="chevron-circle-right"
                            size={30}
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
            type, description, owner,
            createdDate,
            amount,
        } = historyItem;

        // let status = '';
        // if (type === 1) {
        //     status = historyItem.isComplete ? 'Hoàn thành' : 'Chưa hoàn thành';
        // }

        return (
            <Block
                flex
            >
                <Block
                    row
                    space="between"
                >
                    <Text
                        color={NowTheme.COLORS.DEFAULT}
                        size={16}
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                        }}
                    >
                        {moment(createdDate).format('DD/MM/YYYY HH:mm:ss')}
                    </Text>
                    <Block
                        row
                        space="between"
                    >
                        <Text
                            color={NowTheme.COLORS.ACTIVE}
                            size={16}
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
                            }}
                        >
                            {`${type === 1 ? '+' : '-'} ${amount}`}
                        </Text>
                        <IconCustom
                            name="diamond"
                            family={IconFamily.SIMPLE_LINE_ICONS}
                            size={16}
                            color={NowTheme.COLORS.ACTIVE}
                        />
                    </Block>
                </Block>
                <Text
                    color={NowTheme.COLORS.DEFAULT}
                    size={16}
                    fontFamily={NowTheme.FONT.MONTSERRAT_REGULAR}
                >
                    {type === 0 ? owner : description}
                </Text>
                {/* <Text
                    color={NowTheme.COLORS.DEFAULT}
                    size={16}
                    fontFamily={NowTheme.FONT.MONTSERRAT_REGULAR}
                >
                    {status}
                </Text> */}
            </Block>
        );
    };

    const renderWalletAmountPanel = () => {
        const walletAmountFormCashOut = route?.params?.walletAmountFromCashOut || currentUser.walletAmount;
        return (
            <Block>
                <Block
                    middle
                    style={{
                        height: NowTheme.SIZES.HEIGHT_BASE * 0.3,

                    }}
                >
                    <Text
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                        }}
                        size={14}
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
                            size={60}
                            color={NowTheme.COLORS.ACTIVE}
                        >
                            {walletAmountFormCashOut}
                        </Text>
                        <IconCustom
                            name="diamond"
                            family={IconFamily.SIMPLE_LINE_ICONS}
                            size={38}
                            color={NowTheme.COLORS.ACTIVE}
                        />
                    </Block>
                </Block>

                <Block
                    row
                    style={{
                        justifyContent: 'space-around',
                        paddingBottom: 20
                    }}
                >
                    <Block>
                        <Button
                            onPress={() => navigation.navigate(ScreenName.CASH_IN)}
                            style={{
                                width: NowTheme.SIZES.WIDTH_BASE * 0.4
                            }}
                        >
                            Nạp kim cương
                        </Button>
                    </Block>
                    <Block>
                        <Button
                            onPress={() => {
                                navigation.navigate(ScreenName.CASH_OUT);
                            }}
                            style={{
                                width: NowTheme.SIZES.WIDTH_BASE * 0.4
                            }}
                        >
                            Rút kim cương
                        </Button>
                    </Block>
                </Block>
            </Block>
        );
    };

    const renderHistory = () => {
        const listHistory = combineListCashTraffic();

        return (
            <FlatList
                data={listHistory}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => renderHistoryItem(item)}
                showsVerticalScrollIndicator={false}
                refreshControl={(
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                    />
                )}
            />
        );
    };

    try {
        return (
            <>

                <Block
                    shadow
                    style={{
                        backgroundColor: NowTheme.COLORS.BLOCK,
                    }}
                >
                    <Block
                        style={[{
                            height: NowTheme.SIZES.HEIGHT_BASE * 0.4,
                            backgroundColor: NowTheme.COLORS.BASE,
                            alignItems: 'center',
                        }, styles.shadow]}
                    >
                        {renderWalletAmountPanel()}
                    </Block>
                </Block>
                <>
                    {isShowSpinner ? (
                        <Block
                            style={{
                                marginTop: NowTheme.SIZES.HEIGHT_BASE * 0.2
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

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
});
