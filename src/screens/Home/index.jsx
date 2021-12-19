/* eslint no-underscore-dangle: ["error", { "allow": ["_isMounted", "_id"] }] */
import { CenterLoader } from '@components/uiComponents';
import {
    GraphQueryString, Images, ScreenName, Theme
} from '@constants/index';
import { ToastHelpers } from '@helpers/index';
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
import React, { useEffect, useState } from 'react';
import {
    FlatList, Image, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableNativeFeedback, View
} from 'react-native';
import ImageScalable from 'react-native-scalable-image';
import { useDispatch, useSelector } from 'react-redux';

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
                    {renderImage(item)}
                </>
            )}
            onEndReached={() => {
                const newPageIndex = pageIndex + 1;
                getListPartner(newPageIndex);
            }}
        />
    );

    const renderImage = (item) => (
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
                        alignItems: 'center',
                        marginHorizontal: 10,
                        flexDirection: 'row',
                        paddingVertical: 5
                    }}
                >
                    <View
                        style={{
                            marginRight: 10
                        }}
                    >
                        <Image
                            source={item.url ? { uri: item.url } : Images.defaultImage}
                            style={{
                                width: 45,
                                height: 45,
                                borderRadius: 25
                            }}
                        />
                    </View>
                    <View
                        style={{
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: SIZES.WIDTH_BASE * 0.8,
                                flexDirection: 'row'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: SIZES.FONT_H2,
                                    color: COLORS.ACTIVE,
                                    fontFamily: TEXT_BOLD
                                }}
                            >
                                {item.fullName}
                            </Text>
                        </View>
                        {/* <View>
                            <Text
                                style={
                                    [
                                        styles.subInfoCard,
                                        {
                                            fontSize: SIZES.FONT_H4,
                                            color: COLORS.DEFAULT,
                                        }
                                    ]
                                }
                            >
                                {item.homeTown}
                            </Text>
                        </View> */}
                    </View>
                </View>

                <View style={styles.imageContainer}>
                    <ImageScalable
                        style={{
                            zIndex: 99
                        }}
                        width={SIZES.WIDTH_BASE}
                        source={item.imageUrl ? { uri: item.imageUrl } : Images.defaultImage}
                    />
                </View>
            </View>
        </TouchableNativeFeedback>
    );

    try {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                }}
            >
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <View
                        style={{
                            backgroundColor: COLORS.BASE,
                            alignSelf: 'center'
                        }}
                    >
                        {renderArticles()}
                    </View>
                )}
            </SafeAreaView>

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
