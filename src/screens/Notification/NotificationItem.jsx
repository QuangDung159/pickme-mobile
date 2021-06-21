/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { NowTheme, ScreenName } from '@constants/index';
import { NO_AVATAR_URL } from '@env';
import { setPersonTabActiveIndex } from '@redux/Actions';
import { NotificationServices } from '@services/index';
import PropTypes from 'prop-types';
import React from 'react';
import {
    Image, StyleSheet, Text, TouchableWithoutFeedback, View
} from 'react-native';
import { useDispatch } from 'react-redux';

const {
    FONT: {
        MONTSERRAT_REGULAR,
    },
    SIZES,
    COLORS
} = NowTheme;

export default function NotificationItem({
    onTriggerRead,
    notiItem,
    navigation,
}) {
    const dispatch = useDispatch();

    const onClickRead = async (isReadAll, notiId = null) => {
        let result;
        if (isReadAll) {
            result = await NotificationServices.triggerReadAllNotificationAsync();
        } else {
            result = await NotificationServices.triggerReadNotificationAsync(notiId);
        }
        const { data } = result;

        if (data) {
            onTriggerRead();
        }
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
                                    fontFamily: MONTSERRAT_REGULAR,
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
