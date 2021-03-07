import { withNavigation } from '@react-navigation/compat';
import { Block, Text } from 'galio-framework';
import React, { PureComponent } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import {
    Menu,
    MenuOption, MenuOptions,
    MenuTrigger
} from 'react-native-popup-menu';
import { connect } from 'react-redux';
import { IconFamily, NowTheme, Rx } from '../../constants';
import { rxUtil } from '../../utils';
import { IconCustom } from '../uiComponents';

const mapStateToProps = (state) => {
    const {
        userReducer: {
            token
        },
    } = state;

    return ({
        token
    });
};

class NotificationItem extends PureComponent {
    onClickRead = (isReadAll, notiId = null) => {
        const {
            token,
            onTriggerRead
        } = this.props;

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
    }

    renderMenuIcon = () => {
        const {
            notiItem: {
                id,
                isRead
            }
        } = this.props;
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
                            <MenuOption onSelect={() => this.onClickRead(false, id)} text="Đánh dấu là đã đọc" />
                            <MenuOption onSelect={() => this.onClickRead(true)} text="Đánh dấu tất cả là đã đọc" />
                        </MenuOptions>
                    </Menu>
                )}
            </>
        );
    }

    renderNotiContent = () => {
        const {
            iconName,
            iconFamily,
            screen,
            navigation,
            notiItem: {
                content,
            },
        } = this.props;

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
                            navigation.navigate(screen);
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
    }

    render() {
        const {
            notiItem: {
                isRead,
            },
        } = this.props;

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
                    {this.renderNotiContent()}

                    <Block
                        flex={1}
                        style={{
                            justifyContent: 'center',
                            alignContent: 'flex-end'
                        }}
                    >
                        {this.renderMenuIcon()}
                    </Block>
                </Block>
            </Block>
        );
    }
}

export default connect(mapStateToProps, {})(withNavigation(NotificationItem));
