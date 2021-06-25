/* eslint no-underscore-dangle: ["error", { "allow": ["_isMounted", "_id"] }] */
/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { CenterLoader } from '@components/uiComponents';
import {
    GraphQueryString, NowTheme, ScreenName
} from '@constants/index';
import { NO_AVATAR_URL } from '@env';
import { ToastHelpers } from '@helpers/index';
import {
    setCurrentUser,
    setListBookingStore,
    setListConversation, setListNotification, setNumberMessageUnread, setNumberNotificationUnread, setPickMeInfoStore
} from '@redux/Actions';
import { BookingServices, NotificationServices, UserServices } from '@services/index';
import { socketRequestUtil } from '@utils/index';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
    FlatList, Image, RefreshControl, SafeAreaView, StyleSheet, Text, View
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageScalable from 'react-native-scalable-image';
import { useDispatch, useSelector } from 'react-redux';

const {
    FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = NowTheme;

let token = null;
const getTokenFromLocal = async () => {
    token = await SecureStore.getItemAsync('api_token');
};

export default function Home({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [isShowSpinner, setIsShowSpinner] = useState(true);
    const [listPartnerHome, setListPartnerHome] = useState([]);
    const [listConversationGetAtHome, setListConversationGetAtHome] = useState([]);

    const pickMeInfoStore = useSelector((state) => state.appConfigReducer.pickMeInfoStore);
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const messageListened = useSelector((state) => state.messageReducer.messageListened);
    const numberMessageUnread = useSelector((state) => state.messageReducer.numberMessageUnread);
    const chattingWith = useSelector((state) => state.messageReducer.chattingWith);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

    useEffect(
        () => {
            if (token) getTokenFromLocal();

            fetchCurrentUserInfo();
            fetchListNotification();
            fetchListBooking();

            if (!pickMeInfoStore) fetchPickMeInfo();

            getListPartner();
            const intervalUpdateLatest = setIntervalToUpdateLastActiveOfUserStatus();

            getListConversationFromSocket(
                1, 20,
                (data) => {
                    dispatch(setListConversation(data.data.data.getRecently));
                    setListConversationGetAtHome(data.data.data.getRecently);
                    countNumberOfUnreadConversation(data.data.data.getRecently);
                }
            );

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
        const result = await BookingServices.fetchListBookingAsync();
        const { data } = result;
        if (data) {
            dispatch(setListBookingStore(data.data));
        }
    };

    const fetchPickMeInfo = async () => {
        const result = await UserServices.fetchLeaderBoardAsync();
        const { data } = result;

        if (data) {
            dispatch(setPickMeInfoStore(data));
        }
    };

    const fetchCurrentUserInfo = async () => {
        const result = await UserServices.fetchCurrentUserInfoAsync();
        const { data } = result;

        if (data) {
            dispatch(setCurrentUser(data.data));
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

    const getListConversationFromSocket = (pageIndex, pageSize, onFetchData) => {
        if (token) {
            const data = {
                query: GraphQueryString.GET_LIST_CONVERSATION,
                variables: { pageIndex, pageSize }
            };

            socketRequestUtil(
                'POST',
                data,
                token,
                (res) => {
                    onFetchData(res);
                }
            );
        }
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

    const getListPartner = async () => {
        const result = await BookingServices.fetchListPartnerAsync();
        const { data } = result;

        if (data) {
            setListPartnerHome(data.data);
        }
        setRefreshing(false);
        setIsShowSpinner(false);
    };

    const setIntervalToUpdateLastActiveOfUserStatus = () => {
        const intervalUpdateLastActive = setInterval(() => {
            if (token === 'Bearer ') {
                clearInterval(intervalUpdateLastActive);
            }

            const data = {
                query: GraphQueryString.UPDATE_LAST_ACTIVE,
                variables: { url: currentUser.url }
            };

            socketRequestUtil(
                'POST',
                data,
                token
            );
        }, 300000);
        return intervalUpdateLastActive;
    };

    const onRefresh = () => {
        setRefreshing(true);
        getListPartner();
    };

    const renderArticles = () => (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={listPartnerHome}
            refreshControl={(
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => onRefresh()}
                />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
                marginVertical: 10,
                paddingBottom: 10
            }}
            renderItem={({ item }) => (
                <View
                    style={{
                        marginBottom: 10
                    }}
                >
                    {renderImage(item)}
                </View>
            )}
        />
    );

    const renderImage = (item) => (
        <TouchableWithoutFeedback
            onPress={() => navigation.navigate(ScreenName.PROFILE, { userId: item.id })}
        >
            <View
                style={{
                    backgroundColor: COLORS.BASE,
                    borderWidth: 0,
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
                            source={{ uri: item.url || NO_AVATAR_URL }}
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
                                    fontFamily: MONTSERRAT_BOLD
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
                        source={{ uri: item.imageUrl || NO_AVATAR_URL }}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );

    try {
        return (
            <SafeAreaView
                style={{
                    flex: 1
                }}
            >

                <CenterLoader isShow={isShowSpinner} />
                <View
                    style={{
                        backgroundColor: COLORS.INPUT,
                        alignSelf: 'center'
                    }}
                >
                    {renderArticles()}
                </View>
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
        fontFamily: MONTSERRAT_REGULAR,
    },
});
