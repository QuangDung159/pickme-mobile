/* eslint no-underscore-dangle: ["error", { "allow": ["_isMounted", "_id"] }] */
import { Block } from 'galio-framework';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList, RefreshControl
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CardImage } from '../components/bussinessComponents';
import {
    GraphQueryString, NowTheme, Rx
} from '../constants';
import { ToastHelpers } from '../helpers';
import { setListConversation, setListNotification, setNumberMessageUnread } from '../redux/Actions';
import { rxUtil, socketRequestUtil } from '../utils';

export default function Home({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [isShowSpinner, setIsShowSpinner] = useState(true);
    const [listPartnerHome, setListPartnerHome] = useState([]);
    const [listConversationGetAtHome, setListConversationGetAtHome] = useState([]);

    const token = useSelector((state) => state.userReducer.token);
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const listNotification = useSelector((state) => state.notificationReducer.listNotification);
    const messageListened = useSelector((state) => state.messageReducer.messageListened);
    const numberMessageUnread = useSelector((state) => state.messageReducer.numberMessageUnread);
    const chattingWith = useSelector((state) => state.messageReducer.chattingWith);

    const dispatch = useDispatch();

    useEffect(
        () => {
            getListPartner();
            getListNotificationAPI();
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
            if (token !== 'Bearer ') {
                ToastHelpers.renderToast('Bạn có tin nhắn mới.', 'success');
            }

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
            },
            () => {},
            () => {}
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

    const getListNotificationAPI = () => {
        rxUtil(
            Rx.NOTIFICATION.GET_MY_NOTIFICATION,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                // set store
                if (listNotification.length === 0) {
                    dispatch(setListNotification(res.data.data));
                }
            },
            () => {},
            () => {}
        );
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
            () => {
                setRefreshing(false);
                setIsShowSpinner(false);
            },
            () => {
                setRefreshing(false);
                setIsShowSpinner(false);
            }
        );
    };

    const setIntervalToUpdateLastActiveOfUserStatus = () => {
        const { url } = currentUser;

        const intervalUpdateLastActive = setInterval(() => {
            if (token === 'Bearer ') {
                clearInterval(intervalUpdateLastActive);
            }

            const data = {
                query: GraphQueryString.UPDATE_LAST_ACTIVE,
                variables: { url }
            };

            socketRequestUtil(
                'POST',
                data,
                token,
                () => {},
                () => {},
                () => {}
            );
        }, 300000);
        return intervalUpdateLastActive;
    };

    const onRefresh = () => {
        setRefreshing(true);
        getListPartner();
    };

    const renderArticles = () => (
        <Block
            flex
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
                    marginVertical: 10
                }}
                renderItem={({ item }) => (
                    <>
                        <Block
                            style={{
                                marginBottom: 10
                            }}
                        >
                            <CardImage
                                user={item}
                                imageUrl={item.imageUrl}
                                isShowTitle
                                isShowAvatar
                                navigation={navigation}
                            />
                        </Block>
                    </>
                )}
            />
        </Block>
    );

    try {
        return (
            <>
                {isShowSpinner ? (
                    <Block
                        middle
                        style={{
                            height: NowTheme.SIZES.HEIGHT_BASE * 0.8
                        }}
                    >
                        <ActivityIndicator
                            size="large"
                            color={NowTheme.COLORS.ACTIVE}
                        />
                    </Block>
                ) : (
                    <Block
                        center
                        style={{
                            backgroundColor: NowTheme.COLORS.BLOCK,
                            paddingBottom: 10
                        }}
                    >
                        {renderArticles()}
                    </Block>
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
