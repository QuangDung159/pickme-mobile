/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { NO_AVATAR_URL } from '@env';
import PropTypes from 'prop-types';
import React from 'react';
import {
    Image, StyleSheet, Text, TouchableWithoutFeedback, View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NowTheme, Rx, ScreenName } from '../../constants';
import { ToastHelpers } from '../../helpers';
import { setPersonTabActiveIndex } from '../../redux/Actions';
import { rxUtil } from '../../utils';

const { FONT, SIZES, COLORS } = NowTheme;

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
            (res) => ToastHelpers.renderToast(res.data.message, 'error'),
            (res) => ToastHelpers.renderToast(res.data.message, 'error')
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
        <Image
            style={styles.avatar}
            source={{ uri: notiItem.url || NO_AVATAR_URL }}
        />
    );

    const renderNotiContent = () => {
        const {
            content,
            id,
            navigationId, type
        } = notiItem;

        return (
            <>
                <View
                    style={{
                        marginRight: 15,
                        alignSelf: 'center',
                        alignItems: 'center',
                        flex: 1
                    }}
                >
                    {renderAvatar()}
                </View>
                <View
                    style={{
                        justifyContent: 'center',
                        flex: 8
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            handleNavigation(navigationId, type);
                            onClickRead(false, id);
                        }}
                    >
                        <View style={{
                            paddingVertical: 5,
                        }}
                        >
                            <Text
                                numberOfLines={2}
                                style={{
                                    color: COLORS.DEFAULT,
                                    fontSize: 16,
                                    fontFamily: FONT.MONTSERRAT_REGULAR,
                                }}
                            >
                                {content}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </>
        );
    };

    const {
        isRead,
    } = notiItem;

    return (
        <View style={[
            !isRead
                ? { backgroundColor: COLORS.NOTIFICATION_BACKGROUND }
                : { }, {
                height: SIZES.HEIGHT_BASE * 0.08
            }]}
        >
            <View
                style={{
                    height: SIZES.HEIGHT_BASE * 0.1,
                    marginHorizontal: 10,
                    flexDirection: 'row',
                    flex: 1
                }}
            >
                {renderNotiContent()}
            </View>
        </View>
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
        width: SIZES.WIDTH_BASE * 0.1,
        height: SIZES.WIDTH_BASE * 0.1,
    }
});
