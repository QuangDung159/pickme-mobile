/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { NO_AVATAR_URL } from '@env';
import { Block, Text } from 'galio-framework';
import PropTypes from 'prop-types';
import React from 'react';
import { Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NowTheme, Rx, ScreenName } from '../../constants';
import { setPersonTabActiveIndex } from '../../redux/Actions';
import { rxUtil } from '../../utils';

export default function NotificationItem({
    onTriggerRead,
    notiItem,
    navigation,
}) {
    const token = useSelector((state) => state.userReducer.token);

    const dispatch = useDispatch();

    const onClickRead = (isReadAll, notiId = null) => {
        const endpoint = isReadAll
            ? Rx.NOTIFICATION.TRIGGER_READ_ALL
            : `${Rx.NOTIFICATION.TRIGGER_READ}/${notiId}`;

        rxUtil(
            endpoint,
            'POST',
            null,
            {
                Authorization: token
            },
            () => {
                onTriggerRead();
            },
            () => {},
            () => {}
        );
    };

    const handleNavigation = (navigationId, navigationType) => {
        switch (navigationType) {
            case 1: {
                navigation.navigate(ScreenName.BOOKING_DETAIL, { bookingId: navigationId });
                break;
            }
            case 3: {
                navigation.navigate(ScreenName.PERSONAL);
                dispatch(setPersonTabActiveIndex(1));
                break;
            }
            default: {
                break;
            }
        }
    };

    const renderAvatar = () => (
        <Block>
            <Image
                style={styles.avatar}
                source={{ uri: notiItem.url || NO_AVATAR_URL }}
            />
        </Block>
    );

    const renderNotiContent = () => {
        const {
            content,
            id,
            navigationId, type
        } = notiItem;

        return (
            <>
                <Block
                    flex={1}
                    middle
                    style={{
                        marginRight: 15,
                    }}
                >
                    {renderAvatar()}
                </Block>
                <Block
                    flex={8}
                    style={{
                        justifyContent: 'center',
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            handleNavigation(navigationId, type);
                            onClickRead(false, id);
                        }}
                    >
                        <Block style={{
                            paddingVertical: 5,
                        }}
                        >
                            <Text
                                color={NowTheme.COLORS.DEFAULT}
                                size={NowTheme.SIZES.FONT_H4}
                                fontFamily={NowTheme.FONT.MONTSERRAT_REGULAR}
                                numberOfLines={2}
                            >
                                {content}
                            </Text>
                        </Block>
                    </TouchableWithoutFeedback>
                </Block>
            </>
        );
    };

    const {
        isRead,
    } = notiItem;

    return (
        <Block style={[
            !isRead
                ? { backgroundColor: NowTheme.COLORS.NOTIFICATION_BACKGROUND }
                : { }, {
                height: NowTheme.SIZES.HEIGHT_BASE * 0.1
            }]}
        >
            <Block
                row
                flex
                style={{
                    height: NowTheme.SIZES.HEIGHT_BASE * 0.1,
                    marginHorizontal: 10,
                }}
            >
                {renderNotiContent()}
            </Block>
        </Block>
    );
}

NotificationItem.propTypes = {
    onTriggerRead: PropTypes.func.isRequired,
    notiItem: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    avatar: {
        borderRadius: 100,
        width: NowTheme.SIZES.WIDTH_BASE * 0.1,
        height: NowTheme.SIZES.WIDTH_BASE * 0.1,
    }
});
