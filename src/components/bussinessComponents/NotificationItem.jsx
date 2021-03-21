/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { NO_AVATAR_URL } from '@env';
import { Block, Text } from 'galio-framework';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import {
    Menu,
    MenuOption, MenuOptions,
    MenuTrigger
} from 'react-native-popup-menu';
import { useSelector } from 'react-redux';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '../../constants';
import { rxUtil } from '../../utils';
import { IconCustom } from '../uiComponents';

export default function NotificationItem({
    onTriggerRead,
    notiItem,
    navigation,
}) {
    const token = useSelector((state) => state.userReducer.token);
    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const [image, setImage] = useState(currentUser.url);
    const [booking, setBooking] = useState();

    useEffect(
        () => {
            if (notiItem.type === 1) {
                fetchBookingDetailInfo();
            }
        }, []
    );

    useEffect(
        () => {
            getImageUrlByNotificationType();
        }, [booking]
    );

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

    const getImageUrlByNotificationType = () => {
        if (booking) {
            if (notiItem.type === 1) {
            // set url by partner's url
                getPartnerInfo(booking.partner.id);
            }
        }
    };

    const getPartnerInfo = (partnerId) => {
        rxUtil(
            `${Rx.PARTNER.PARTNER_DETAIL}/${partnerId}`,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setImage(res.data.data.url);
            },
            () => {},
            () => {}
        );
    };

    const fetchBookingDetailInfo = () => {
        rxUtil(
            `${Rx.BOOKING.DETAIL_BOOKING}/${notiItem.navigationId}`,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setBooking(res.data.data);
            }
        );
    };

    const renderMenuIcon = () => {
        const {
            id,
            isRead
        } = notiItem;

        return (
            <>
                {!isRead && (
                    <Menu>
                        <MenuTrigger>
                            <IconCustom
                                name="dots-three-horizontal"
                                color={NowTheme.COLORS.DEFAULT}
                                size={24}
                                family={IconFamily.ENTYPO}
                            />
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={() => onClickRead(false, id)} text="Đánh dấu là đã đọc" />
                            <MenuOption onSelect={() => onClickRead(true)} text="Đánh dấu tất cả là đã đọc" />
                        </MenuOptions>
                    </Menu>
                )}
            </>
        );
    };

    const handleNavigation = (navigationId, navigationType) => {
        switch (navigationType) {
            case 1: {
                navigation.navigate(ScreenName.BOOKING_DETAIL, { bookingId: navigationId });
                break;
            }
            case 3: {
                navigation.navigate(ScreenName.WALLET);
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
                source={{ uri: image || NO_AVATAR_URL }}
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
                                size={16}
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
                height: NowTheme.SIZES.HEIGHT_BASE * 0.08
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

                {/* <Block
                    flex={1}
                    style={{
                        justifyContent: 'center',
                        alignContent: 'flex-end'
                    }}
                >
                    {renderMenuIcon()}
                </Block> */}
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
