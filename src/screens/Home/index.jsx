/* eslint no-underscore-dangle: ["error", { "allow": ["_isMounted", "_id"] }] */
import ProfileInfoItem from '@components/businessComponents/ProfileInfoItem';
import { CenterLoader, IconCustom } from '@components/uiComponents';
import {
    GraphQueryString, IconFamily, Images, ScreenName, Theme
} from '@constants/index';
import { CommonHelpers, ToastHelpers } from '@helpers/index';
import {
    setListBookingStore,
    setListConversation,
    setListNotification,
    setListPartnerHomeRedux,
    setNumberMessageUnread,
    setNumberNotificationUnread,
    setVerificationStore
} from '@redux/Actions';
import { BookingServices, NotificationServices, UserServices } from '@services/index';
import { socketRequestUtil } from '@utils/index';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    FlatList, RefreshControl, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View
} from 'react-native';
import ImageScalable from 'react-native-scalable-image';
import { useDispatch, useSelector } from 'react-redux';
import FilterModal from './FilterModal';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function Home({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [listConversationGetAtHome, setListConversationGetAtHome] = useState([]);

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const messageListened = useSelector((state) => state.messageReducer.messageListened);
    const numberMessageUnread = useSelector((state) => state.messageReducer.numberMessageUnread);
    const chattingWith = useSelector((state) => state.messageReducer.chattingWith);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);
    const listPartnerHomeRedux = useSelector((state) => state.bookingReducer.listPartnerHomeRedux);
    const [pageIndex, setPageIndex] = useState(1);
    const [modalFilterVisible, setModalFilterVisible] = useState(false);

    const dispatch = useDispatch();

    useEffect(
        () => {
            fetchListNotification();
            fetchListBooking();
            getListConversationFromSocket();
            fetchVerification();
            if (!listPartnerHomeRedux || listPartnerHomeRedux.length === 0) {
                setIsShowSpinner(true);
                getListPartner(pageIndex);
            }
        }, []
    );

    useEffect(
        () => {
            const intervalUpdateLatest = setIntervalToUpdateLastActiveOfUserStatus();
            return () => {
                clearInterval(intervalUpdateLatest);
            };
        }, []
    );

    useEffect(
        () => {
            const conversationPayLoad = getConversationByMessage(
                messageListened,
                listConversationGetAtHome
            );

            if (!conversationPayLoad) {
                return;
            }

            // in case user on chatting screen
            if (messageListened.from === chattingWith) {
                return;
            }

            const { conversation, indexInSource } = conversationPayLoad;

            if (conversation.isRead === true) {
                dispatch(setNumberMessageUnread(numberMessageUnread + 1));

                // re-assign recentlyMessage.isRead = false
                // to ignore increase numberOfUnreadMessage
                // in case next incoming message is belong to this conversation
                // because we don't refetch listRecentlyMessage from API
                const listConversationTemp = [...listConversationGetAtHome];
                listConversationTemp[indexInSource].isRead = false;
                setListConversationGetAtHome(listConversationTemp);
            }
        }, [messageListened]
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

    const fetchListBooking = async () => {
        const res = await BookingServices.fetchListBookingAsync();
        if (res.data) {
            dispatch(setListBookingStore(res.data.data));
        }
    };

    const fetchVerification = async () => {
        const result = await UserServices.fetchVerificationAsync();
        const { data } = result;

        if (data) {
            dispatch(setVerificationStore(data.data));
        }
    };

    const fetchListNotification = async () => {
        const result = await NotificationServices.fetchListNotificationAsync();
        const { data } = result;

        if (data) {
            dispatch(setListNotification(data.data));
            countNumberNotificationUnread(data.data);
        }
    };

    const countNumberNotificationUnread = (listNotiFromAPI) => {
        let count = 0;
        listNotiFromAPI.forEach((item) => {
            if (!item.isRead) {
                count += 1;
            }
        });

        dispatch(setNumberNotificationUnread(count));
    };

    const getConversationByMessage = (message, listConversationSource) => {
        const index = listConversationSource.findIndex(
            (conversation) => conversation.from === message.from || conversation.from === message.to
        );

        if (index === -1) {
            return null;
        }

        return {
            conversation: listConversationSource[index],
            indexInSource: index
        };
    };

    const getListConversationFromSocket = () => {
        const { token } = currentUser;
        const data = {
            query: GraphQueryString.GET_LIST_CONVERSATION,
            variables: { pageIndex: 1, pageSize: 20 }
        };

        socketRequestUtil(
            'POST',
            data,
            token,
            (res) => {
                dispatch(setListConversation(res.data.data.getRecently));
                setListConversationGetAtHome(res.data.data.getRecently);
                countNumberOfUnreadConversation(res.data.data.getRecently);
            }
        );
    };

    const countNumberOfUnreadConversation = (listConversation) => {
        let count = 0;
        listConversation.forEach((conversation) => {
            if (conversation.to === currentUser.id && !conversation.isRead) {
                count += 1;
            }
        });

        dispatch(setNumberMessageUnread(count));
    };

    const getListPartner = async (newPageIndex) => {
        const result = await BookingServices.fetchListPartnerAsync({ pageIndex: newPageIndex });
        const { data } = result;

        if (data) {
            dispatch(setListPartnerHomeRedux(data.data));
            setPageIndex(newPageIndex);
        }
        setRefreshing(false);
        setIsShowSpinner(false);
    };

    const setIntervalToUpdateLastActiveOfUserStatus = () => {
        const intervalUpdateLastActive = setInterval(() => {
            const data = {
                query: GraphQueryString.UPDATE_LAST_ACTIVE,
                variables: { url: currentUser.url }
            };

            socketRequestUtil(
                'POST',
                data,
                currentUser.token
            );
        }, 300000);
        return intervalUpdateLastActive;
    };

    const onRefresh = () => {
        setRefreshing(true);
        getListPartner(pageIndex);
    };

    const handleDisplayName = (name) => {
        if (name.length > 21) {
            let nameArr = name.split(' ');
            nameArr = nameArr.slice(nameArr.length - 2, nameArr.length);
            return nameArr.join(' ');
        }
        return name;
    };

    const renderArticles = () => (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={listPartnerHomeRedux}
            refreshControl={(
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => onRefresh()}
                    tintColor={COLORS.ACTIVE}
                />
            )}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <>
                    {renderUserCard(item)}
                </>
            )}
            onEndReached={() => {
                const newPageIndex = pageIndex + 1;
                getListPartner(newPageIndex);
            }}
            contentContainerStyle={{
                paddingTop: 10,
            }}
        />
    );

    const renderUserCard = (item) => {
        let amountDisplay = item.id === currentUser.id ? item.earningExpected : item.estimatePricing;
        amountDisplay = CommonHelpers.formatCurrency(amountDisplay);

        return (
            <TouchableNativeFeedback
                onPress={() => navigation.navigate(ScreenName.PROFILE, { userId: item.id })}
            >
                <View
                    style={{
                        backgroundColor: COLORS.BASE,
                        marginBottom: 10
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            width: SIZES.WIDTH_MAIN,
                        }}
                    >
                        <View style={styles.imageContainer}>
                            <ImageScalable
                                style={{
                                    zIndex: 99,
                                    borderRadius: 10
                                }}
                                width={SIZES.WIDTH_BASE * 0.4 - 5}
                                source={item.url ? { uri: item.url } : Images.defaultImage}
                            />
                        </View>
                        <View
                            style={{
                                width: SIZES.WIDTH_BASE * 0.55,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: SIZES.FONT_H2,
                                    color: COLORS.ACTIVE,
                                    fontFamily: TEXT_BOLD,
                                    marginBottom: 5
                                }}
                            >
                                {handleDisplayName(item.fullName)}
                            </Text>
                            <ProfileInfoItem
                                fontSize={SIZES.FONT_H3}
                                iconName="home"
                                iconFamily={IconFamily.FONT_AWESOME_5}
                                content={`${item.homeTown || 'N/a'}`}
                                iconSize={16}
                            />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        width: '50%'
                                    }}
                                >
                                    <ProfileInfoItem
                                        fontSize={SIZES.FONT_H3}
                                        iconName="birthday-cake"
                                        iconFamily={IconFamily.FONT_AWESOME}
                                        content={
                                            moment(item.dob).format('YYYY').toString().toLowerCase() !== 'invalid date'
                                                ? moment(item.dob).format('YYYY').toString()
                                                : '1990'
                                        }
                                        iconSize={16}
                                    />
                                </View>

                                <ProfileInfoItem
                                    fontSize={SIZES.FONT_H3}
                                    iconName={item.isMale ? 'male' : 'female'}
                                    iconFamily={IconFamily.FONTISTO}
                                    content={`${item.isMale ? 'Nam' : 'Nữ'}`}
                                    iconSize={16}
                                />
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 5
                                }}
                            >
                                <View
                                    style={{
                                        width: '100%'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: SIZES.FONT_H3,
                                            color: COLORS.ACTIVE,
                                            fontFamily: TEXT_BOLD,
                                        }}
                                    >
                                        {`Đánh giá: ${item.ratingAvg}/5 sao`}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                <View
                                    style={{
                                        width: '100%'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: SIZES.FONT_H3,
                                            color: COLORS.ACTIVE,
                                            fontFamily: TEXT_BOLD,
                                        }}
                                    >
                                        {`Phí mời: ${amountDisplay} Xu/phút`}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    };

    const renderFilterButton = () => (
        <TouchableOpacity
            style={{
                position: 'absolute',
                bottom: 10,
                right: 0,
                width: 45,
                height: 45,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.ACTIVE
            }}
            onPress={() => {
                setModalFilterVisible(true);
            }}
        >
            <IconCustom
                name="filter"
                family={IconFamily.FEATHER}
                size={22}
                color={COLORS.BASE}
            />
        </TouchableOpacity>
    );

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <View
                        style={{
                            backgroundColor: COLORS.BASE,
                            alignSelf: 'center',
                        }}
                    >
                        {renderArticles()}
                        {renderFilterButton()}
                        <FilterModal
                            setModalFilterVisible={setModalFilterVisible}
                            modalFilterVisible={modalFilterVisible}
                        />
                    </View>
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
    imageContainer: {
        elevation: 1,
        overflow: 'hidden',
        flex: 1
    },
    subInfoCard: {
        fontFamily: TEXT_REGULAR,
    },
});
