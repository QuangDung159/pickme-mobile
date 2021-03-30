/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
import { Block, Text } from 'galio-framework';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { CenterLoader, IconCustom, Input } from '../components/uiComponents';
import { GraphQueryString, IconFamily, NowTheme } from '../constants';
import { ToastHelpers } from '../helpers';
import { setChattingWith, setNumberMessageUnread } from '../redux/Actions';
import { socketRequestUtil } from '../utils';

export default function Message({ navigation, route }) {
    const [listMessageFromAPI, setListMessageFromAPI] = useState([]);
    const [messageFromInput, setMessageFromInput] = useState('');
    const [nextPageIndex, setNextPageIndex] = useState(2);
    const [isShowLoader, setIsShowLoader] = useState(false);

    const token = useSelector((state) => state.userReducer.token);
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const messageListened = useSelector((state) => state.messageReducer.messageListened);
    const chattingWith = useSelector((state) => state.messageReducer.chattingWith);
    const numberMessageUnread = useSelector((state) => state.messageReducer.numberMessageUnread);

    const dispatch = useDispatch();

    useEffect(
        () => {
            const {
                params: {
                    toUserId
                }
            } = route;

            setIsShowLoader(true);

            fetchListMessage(toUserId, 1, 12,
                (data) => {
                    dispatch(setChattingWith(toUserId));

                    setListMessageFromAPI(data.data.data.messages);
                    setIsShowLoader(false);
                });

            const onBlurScreen = navigation.addListener('blur', () => {
                dispatch(setChattingWith(''));
            });

            // fetch data when go back
            const onFocusScreen = navigation.addListener('focus', () => {
                fetchListMessage(
                    toUserId,
                    1,
                    12,
                    (data) => {
                        setChattingWith(toUserId);
                        setListMessageFromAPI(data.data.data.messages);
                        calculateNumberOfNumberMessageUnread(data.data.data.messages);
                    }
                );

                // check lastest message from another and unread by current user

                return () => {
                    onBlurScreen;
                    onFocusScreen;
                };
            });
        }, []
    );

    useEffect(
        () => {
            if (chattingWith === messageListened.from) {
                this.fetchListMessage(
                    toUserId,
                    1,
                    12,
                    (data) => {
                        setChattingWith(toUserId);
                        this.setState({
                            listMessageFromAPI: data.data.data.messages
                        });
                    }
                );
            }
        }, [messageListened._id]
    );

    const calculateNumberOfNumberMessageUnread = (listMessage) => {
        const {
            params: {
                toUserId
            }
        } = route;
        const lastestMessage = listMessage[0];

        if (lastestMessage.from !== currentUser.id && !lastestMessage.isRead) {
            if (numberMessageUnread > 0) {
                dispatch(setNumberMessageUnread(numberMessageUnread - 1));
            }
        }

        setTimeout(
            () => triggerReadAllMessage(toUserId),
            500
        );
    };

    // trigger read all message in backend
    const triggerReadAllMessage = (chattingWithUserId) => {
        const data = {
            query: GraphQueryString.READ_ALL_MESSAGE,
            variables: { from: chattingWithUserId }
        };

        socketRequestUtil(
            'POST',
            data,
            token,
            () => {},
            () => {},
            () => {}
        );
    };

    const fetchListMessage = (to, pageIndex, pageSize, onSuccess) => {
        const data = {
            query: GraphQueryString.GET_LIST_MESSAGE,
            variables: {
                to,
                pageIndex,
                pageSize
            }
        };

        socketRequestUtil(
            'POST',
            data,
            token,
            (res) => {
                onSuccess(res);
            },
            () => {},
            () => {}
        );
    };

    const renderMessageItem = (message) => {
        const { id } = currentUser;

        const messageStyle = id !== message.from ? styles.messageRight : styles.messageLeft;
        const flexDirection = id !== message.from ? 'row' : 'row-reverse';
        return (
            <Block
                style={{
                    marginBottom: 10,
                    flexDirection
                }}
            >
                <Block
                    style={{
                        marginHorizontal: 5
                    }}
                />
                <Block
                    style={[{
                        borderRadius: 10,
                        maxWidth: NowTheme.SIZES.WIDTH_BASE * 0.8
                    }, messageStyle]}
                >
                    <Block>
                        <Text
                            color={NowTheme.COLORS.DEFAULT}
                            size={16}
                            style={{
                                margin: 10,
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                            }}
                        >
                            {message.content}
                        </Text>
                        <Text
                            color={NowTheme.COLORS.DEFAULT}
                            size={10}
                            style={{
                                marginHorizontal: 10,
                                marginBottom: 10,
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                            }}
                        >
                            {moment.unix(message.createdAt / 1000).format('DD-MM HH:mm')}
                        </Text>
                    </Block>
                </Block>
            </Block>
        );
    };

    const renderListMessage = () => (
        <FlatList
            inverted
            onEndReached={() => addListMessagePaging()}
            showsVerticalScrollIndicator={false}
            data={listMessageFromAPI}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderMessageItem(item)}
        />
    );

    const addListMessagePaging = () => {
        const {
            params: {
                toUserId
            }
        } = route;

        setTimeout(() => {
            fetchListMessage(
                toUserId,
                nextPageIndex, 12,
                (data) => {
                    const newListMessage = listMessageFromAPI.concat(
                        data.data.data.messages
                    );

                    setListMessageFromAPI(newListMessage);
                    setNextPageIndex(nextPageIndex + 1);
                }
            );
        }, 2000);
    };

    const addLastestMessage = (messagePayload) => {
        const { id } = currentUser;

        // eslint-disable-next-line no-param-reassign
        messagePayload.from = id;
        const newArray = [...listMessageFromAPI];
        newArray.unshift(messagePayload);
        setListMessageFromAPI(newArray);
    };

    const onChangeMessageInput = (messageInput) => {
        setMessageFromInput(messageInput);
    };

    const triggerSendMessage = () => {
        const data = {
            query: GraphQueryString.SEND_MESSAGE,
            variables: {
                data: {
                    to: toUserId,
                    content: messageFromInput
                }
            }
        };

        socketRequestUtil(
            'POST',
            data,
            token,
            () => {},
            () => {},
            () => {}
        );

        const messagePayoad = {
            from: '',
            content: messageFromInput,
            createdAt: moment().unix() * 1000
        };

        addLastestMessage(messagePayoad);
        setMessageFromInput('');
    };

    const {
        params: {
            toUserId
        }
    } = route;

    try {
        return (
            <>
                {isShowLoader ? (
                    <CenterLoader />
                ) : (
                    <KeyboardAwareScrollView
                        contentContainerStyle={{
                            flex: 1
                        }}
                    >
                        {renderListMessage()}

                        <Block
                            row
                            space="between"
                            center
                            style={{
                                width: NowTheme.SIZES.WIDTH_BASE
                            }}
                        >
                            <Input
                                style={{
                                    borderWidth: 0,
                                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                    width: NowTheme.SIZES.WIDTH_BASE * 0.85
                                }}
                                placeholder="Nhập tin nhắn..."
                                value={messageFromInput}
                                onChangeText={(input) => onChangeMessageInput(input)}
                                textInputStyle={{
                                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                    fontSize: 16
                                }}
                            />

                            <TouchableWithoutFeedback
                                onPress={() => {
                                    if (messageFromInput !== '') {
                                        triggerSendMessage();
                                    }
                                }}
                                style={{
                                    marginRight: 10
                                }}
                            >
                                <IconCustom
                                    name="send"
                                    family={IconFamily.FEATHER}
                                    size={30}
                                    color={NowTheme.COLORS.ACTIVE}
                                />
                            </TouchableWithoutFeedback>
                        </Block>
                    </KeyboardAwareScrollView>
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
    messageRight: {
        alignItems: 'flex-start',
        backgroundColor: NowTheme.COLORS.MESSAGE_BACKGROUND_CURRENT
    },
    messageLeft: {
        alignItems: 'flex-end',
        backgroundColor: NowTheme.COLORS.MESSAGE_BACKGROUND_INCOMING
    }
});
