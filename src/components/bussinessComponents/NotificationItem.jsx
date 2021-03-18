import { Block, Text } from 'galio-framework';
import PropTypes from 'prop-types';
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
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
    iconName,
    iconFamily,
    navigation,
}) {
    const token = useSelector((state) => state.userReducer.token);

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
            default: {
                break;
            }
        }
    };

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
                    style={{
                        marginRight: 15,
                        justifyContent: 'center',
                    }}
                >
                    <IconCustom
                        name={iconName}
                        size={30}
                        color={NowTheme.COLORS.DEFAULT}
                        family={iconFamily}
                    />
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
                            width: NowTheme.SIZES.WIDTH_BASE * 0.7
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

                <Block
                    flex={1}
                    style={{
                        justifyContent: 'center',
                        alignContent: 'flex-end'
                    }}
                >
                    {renderMenuIcon()}
                </Block>
            </Block>
        </Block>
    );
}

NotificationItem.propTypes = {
    onTriggerRead: PropTypes.func.isRequired,
    notiItem: PropTypes.object.isRequired,
    iconName: PropTypes.string,
    iconFamily: PropTypes.string,
    navigation: PropTypes.object.isRequired
};

NotificationItem.defaultProps = {
    iconName: 'home',
    iconFamily: IconFamily.FONT_AWESOME
};
