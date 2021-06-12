/* eslint no-underscore-dangle: ["error", { "allow": ["_isMounted", "_id"] }] */
/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { NO_AVATAR_URL, PICKME_INFO_URL } from '@env';
import React, { useEffect, useState } from 'react';
import {
    FlatList, Image, RefreshControl, StyleSheet, Text, View
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageScalable from 'react-native-scalable-image';
import { useDispatch, useSelector } from 'react-redux';
import { CenterLoader } from '../../components/uiComponents';
import {
    GraphQueryString, NowTheme, Rx, ScreenName
} from '../../constants';
import { ToastHelpers } from '../../helpers';
import {
    setCurrentUser,
    setListConversation, setNumberMessageUnread, setPickMeInfoStore
} from '../../redux/Actions';
import { rxUtil, socketRequestUtil } from '../../utils';

const {
    FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = NowTheme;

export default function Home({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [isShowSpinner, setIsShowSpinner] = useState(true);
    const [listPartnerHome, setListPartnerHome] = useState([]);
    const [listConversationGetAtHome, setListConversationGetAtHome] = useState([]);

    const token = useSelector((state) => state.userReducer.token);
    const pickMeInfoStore = useSelector((state) => state.appConfigReducer.pickMeInfoStore);
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const messageListened = useSelector((state) => state.messageReducer.messageListened);
    const numberMessageUnread = useSelector((state) => state.messageReducer.numberMessageUnread);
    const chattingWith = useSelector((state) => state.messageReducer.chattingWith);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

    useEffect(
        () => {
            fetchCurrentUserInfo();

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

    const fetchPickMeInfo = () => {
        rxUtil(
            Rx.SYSTEM.PICK_ME_INFO,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                dispatch(setPickMeInfoStore(res.data));
                setIsShowSpinner(false);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
            },
            PICKME_INFO_URL
        );
    };

    const fetchCurrentUserInfo = () => {
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
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
            }
        );
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

    const getListPartner = () => {
        rxUtil(
            Rx.PARTNER.GET_LIST_PARTNER,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setRefreshing(false);
                setIsShowSpinner(false);
                setListPartnerHome(res.data.data);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setRefreshing(false);
                setIsShowSpinner(false);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setRefreshing(false);
                setIsShowSpinner(false);
            }
        );
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
        <View
            style={{
                flex: 1
            }}
        >
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
        </View>
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
                        flexDirection: 'row'
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
                            paddingVertical: 10
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
                        <View>
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
                        </View>
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
            <>
                {isShowSpinner ? (
                    <View
                        middle
                        style={{
                            height: SIZES.HEIGHT_BASE * 0.8
                        }}
                    >
                        <CenterLoader />
                    </View>
                ) : (
                    <View
                        style={{
                            backgroundColor: COLORS.INPUT,
                            alignSelf: 'center'
                        }}
                    >
                        {renderArticles()}
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
        fontFamily: MONTSERRAT_REGULAR,
    },
});
