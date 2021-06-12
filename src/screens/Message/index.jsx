/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
import { Block, Text } from 'galio-framework';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { CenterLoader, CustomInput, IconCustom } from '../../components/uiComponents';
import {
    GraphQueryString, IconFamily, NowTheme, ScreenName
} from '../../constants';
import { ToastHelpers } from '../../helpers';
import { setChattingWith, setNumberMessageUnread } from '../../redux/Actions';
import { socketRequestUtil } from '../../utils';

const {
    FONT: {
        MONTSERRAT_REGULAR,
    },
    SIZES,
    COLORS
} = NowTheme;

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
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

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

                // check latest message from another and unread by current user

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
                fetchListMessage(
                    toUserId,
                    1,
                    12,
                    (data) => {
                        setChattingWith(toUserId);
                        setListMessageFromAPI(data.data.data.messages);
                    }
                );
            }

            triggerReadAllMessage(toUserId);
        }, [messageListened._id]
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

    const calculateNumberOfNumberMessageUnread = (listMessage) => {
        const {
            params: {
                toUserId
            }
        } = route;
        const latestMessage = listMessage[0];

        if (latestMessage.from !== currentUser.id && !latestMessage.isRead) {
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
            token
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
            }
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
                        maxWidth: SIZES.WIDTH_BASE * 0.8
                    }, messageStyle]}
                >
                    <Block>
                        <Text
                            color={COLORS.DEFAULT}
                            size={16}
                            style={{
                                margin: 10,
                                fontFamily: MONTSERRAT_REGULAR
                            }}
                        >
                            {message.content}
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
                nextPageIndex, 15,
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

    const addLatestMessage = (messagePayload) => {
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
            token
        );

        const messagePayload = {
            from: '',
            content: messageFromInput,
            createdAt: moment().unix() * 1000
        };

        addLatestMessage(messagePayload);
        setMessageFromInput('');
    };

    const {
        params: {
            toUserId
        }
    } = route;

    const renderInputMessage = () => (
        <Block
            row
            space="between"
            center
            style={{
                width: SIZES.WIDTH_BASE
            }}
        >
            <CustomInput
                placeholder="Nhập tin nhắn..."
                value={messageFromInput}
                onChangeText={(input) => onChangeMessageInput(input)}
                containerStyle={{
                    marginVertical: 10,
                    width: SIZES.WIDTH_BASE * 0.9
                }}
                inputStyle={{
                    borderWidth: 0
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
                    color={COLORS.ACTIVE}
                />
            </TouchableWithoutFeedback>
        </Block>
    );

    try {
        return (
            <>
                {isShowLoader ? (
                    <CenterLoader />
                ) : (
                    <>
                        {renderListMessage()}
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            keyboardVerticalOffset={SIZES.HEIGHT_BASE * 0.11}
                        >
                            {renderInputMessage()}
                        </KeyboardAvoidingView>
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

const styles = StyleSheet.create({
    messageRight: {
        alignItems: 'flex-start',
        backgroundColor: COLORS.MESSAGE_BACKGROUND_CURRENT
    },
    messageLeft: {
        alignItems: 'flex-end',
        backgroundColor: COLORS.MESSAGE_BACKGROUND_INCOMING
    }
});
