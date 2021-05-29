/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
import { Block, Text } from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { Image, RefreshControl } from 'react-native';
import { FlatList, ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { Line } from '../components/uiComponents';
import { GraphQueryString, NowTheme, ScreenName } from '../constants';
import { ToastHelpers } from '../helpers';
import { setListConversation, setNumberMessageUnread } from '../redux/Actions';
import { socketRequestUtil } from '../utils';

export default function ConversationList({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);

    const messageListened = useSelector((state) => state.messageReducer.messageListened);
    const token = useSelector((state) => state.userReducer.token);
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const listConversation = useSelector((state) => state.messageReducer.listConversation);
    const numberMessageUnread = useSelector((state) => state.messageReducer.numberMessageUnread);
    const chattingWith = useSelector((state) => state.messageReducer.chattingWith);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

    useEffect(
        () => {
            const onFocusScreen = navigation.addListener(
                'focus',
                () => {
                    getListConversationFromSocket(
                        1, 20,
                        (data) => {
                            dispatch(setListConversation(data.data.data.getRecently));
                        }
                    );
                }
            );
            return onFocusScreen;
        }, []
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

    useEffect(
        () => {
            getListConversationFromSocket(
                1, 20,
                (data) => {
                    dispatch(setListConversation(data.data.data.getRecently));
                    countNumberOfUnreadConversation(data.data.data.getRecently);
                }
            );
        }, [messageListened]
    );

    const countNumberOfUnreadConversation = (listMessage) => {
        if (messageListened.from === chattingWith) {
            return;
        }

        let count = 0;
        listMessage.forEach((conversation) => {
            if (conversation.to === currentUser.id && !conversation.isRead) {
                count += 1;
            }
        });

        dispatch(setNumberMessageUnread(count));
    };

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const onClickConversationItem = (conversationParams) => {
        if (!conversationParams.isRead) {
            dispatch(setNumberMessageUnread(numberMessageUnread - 1));
        }

        navigation.navigate(ScreenName.MESSAGE, conversationParams);
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
                setRefreshing(false);
            },
            () => setRefreshing(false),
            () => setRefreshing(false)
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        getListConversationFromSocket(
            1, 20,
            (data) => {
                dispatch(setListConversation(data.data.data.getRecently));
                countNumberOfUnreadConversation(data.data.data.getRecently);
            }
        );
    };

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderConversationItem = (conversation) => {
        let params = {
            userStatus: 'Vừa mới truy cập',
            conversationId: conversation.id
        };

        // detect this recently message from current user or another
        if (conversation.to === currentUser.id) {
            // this recently message from another
            params = {
                ...params,
                toUserId: conversation.from,
                userInfo: conversation.fromUser,
                name: conversation.fromUser.fullName || 'N/A',
                imageUrl: conversation.fromUser.url,
                isRead: conversation.isRead
            };
        } else {
            // this recently message from current user

            // eslint-disable-next-line no-param-reassign
            conversation.isRead = true;
            params = {
                ...params,
                toUserId: conversation.to,
                userInfo: conversation.toUser,
                name: conversation.toUser.fullName || 'N/A',
                imageUrl: conversation.toUser.url,
                isRead: conversation.isRead
            };
        }

        return (
            <TouchableWithoutFeedback
                onPress={
                    () => onClickConversationItem(params)
                }
            >
                <Block
                    row
                    style={{
                        alignItems: 'center',
                    }}
                >
                    <Block
                        style={{
                            marginHorizontal: 10,
                            paddingVertical: 10
                        }}
                    >
                        <Image
                            source={{
                                uri: params.imageUrl
                            }}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25
                            }}
                        />
                    </Block>
                    <Block>
                        <Text
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
                            }}
                            size={16}
                            color={NowTheme.COLORS.DEFAULT}
                        >
                            {params.name}
                        </Text>
                        <Block
                            style={{
                                width: NowTheme.SIZES.WIDTH_BASE * 0.77
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: conversation.isRead
                                        ? NowTheme.FONT.MONTSERRAT_REGULAR
                                        : NowTheme.FONT.MONTSERRAT_BOLD

                                }}
                                size={16}
                                color={NowTheme.COLORS.DEFAULT}
                                numberOfLines={2}
                            >
                                {conversation.content}
                            </Text>
                        </Block>
                    </Block>
                </Block>
                <Block
                    alignItems="flex-end"
                >
                    <Line
                        borderColor={NowTheme.COLORS.ACTIVE}
                        borderWidth={0.5}
                        width={NowTheme.SIZES.WIDTH_BASE * 0.85}
                    />
                </Block>
            </TouchableWithoutFeedback>
        );
    };

    try {
        return (
            <>
                {listConversation && listConversation.length !== 0 ? (
                    <FlatList
                        data={listConversation}
                        renderItem={({ item, index }) => renderConversationItem(item, index)}
                        keyExtractor={(item) => item.id}
                        refreshControl={(
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => onRefresh()}
                            />
                        )}
                    />
                ) : (
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
