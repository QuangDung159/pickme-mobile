import * as SecureStore from 'expo-secure-store';
import {
    Block, NavBar, Text
} from 'galio-framework';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { CustomInput, IconCustom, Tabs } from '../components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '../constants';
import { ToastHelpers } from '../helpers';
import { resetStoreSignOut, setListNotification, setNumberNotificationUnread } from '../redux/Actions';
import { rxUtil } from '../utils';

const iPhoneX = Platform.OS === 'ios';

export default function Header({
    back,
    title,
    white,
    transparent,
    bgColor,
    iconColor,
    titleColor,
    navigation,
    screenNameProp,
    optionLeft, optionRight,
    tabs, tabIndex,
    search, options,
    showRight,
    ...props
}) {
    const noShadow = ['Search', 'Categories', 'Deals', 'Pro', 'Profile'].includes(title);
    const headerStyles = [
        !noShadow ? styles.shadow : null,
        transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null
    ];

    const token = useSelector((state) => state.userReducer.token);
    const chattingWith = useSelector((state) => state.messageReducer.chattingWith);

    const dispatch = useDispatch();

    const countNumberNotificationUnread = (listNotiFromAPI) => {
        let count = 0;
        listNotiFromAPI.forEach((item) => {
            if (!item.isRead) {
                count += 1;
            }
        });

        dispatch(setNumberNotificationUnread(count));
    };

    const getListNotiFromAPI = () => {
        rxUtil(
            Rx.NOTIFICATION.GET_MY_NOTIFICATION,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                // set store
                dispatch(setListNotification(res.data.data));
                countNumberNotificationUnread(res.data.data);
            },
            (res) => ToastHelpers.renderToast(res.data.message, 'error'),
            (res) => ToastHelpers.renderToast(res.data.message, 'error')
        );
    };

    const triggerReadAllNotification = () => {
        rxUtil(
            Rx.NOTIFICATION.TRIGGER_READ_ALL,
            'POST',
            null,
            {
                Authorization: token
            },
            () => {
                getListNotiFromAPI();
            },
            (res) => ToastHelpers.renderToast(res.data.message, 'error'),
            (res) => ToastHelpers.renderToast(res.data.message, 'error')
        );
    };

    const renderQnAButton = () => (
        <Block
            style={{
                position: 'absolute',
                bottom: 14,
                right: 5,
                zIndex: 99,
            }}
        >
            <TouchableOpacity
                onPress={() => navigation.navigate(ScreenName.SUPPORT)}
            >
                <IconCustom
                    family={IconFamily.MATERIAL_ICONS}
                    size={26}
                    name="contact-support"
                    color={NowTheme.COLORS.ACTIVE}
                />
            </TouchableOpacity>
        </Block>
    );

    const renderSettingButton = () => (
        <Block
            style={{
                position: 'absolute',
                bottom: 14,
                right: 35,
                zIndex: 99,
            }}
        >
            <TouchableOpacity
                onPress={() => navigation.navigate(ScreenName.SETTINGS)}
            >
                <IconCustom
                    name="gear"
                    family={IconFamily.FONT_AWESOME}
                    size={26}
                    color={NowTheme.COLORS.ACTIVE}
                />
            </TouchableOpacity>
        </Block>
    );

    const renderReadAllButton = () => (
        <Block
            style={{
                position: 'absolute',
                bottom: 14,
                right: 65,
                zIndex: 99,
            }}
        >
            <TouchableOpacity
                onPress={() => triggerReadAllNotification()}
            >
                <IconCustom
                    name="mark-email-read"
                    family={IconFamily.MATERIAL_ICONS}
                    size={26}
                    color={NowTheme.COLORS.ACTIVE}
                />
            </TouchableOpacity>
        </Block>
    );

    const navbarStyles = [
        styles.navbar, bgColor && {
            backgroundColor: bgColor, zIndex: 1
        },
        iPhoneX ? styles.navbarHeight : {}];

    const renderRight = () => {
        if (showRight) {
            return (
                <>
                    {renderQnAButton()}
                    {renderSettingButton()}
                    {screenNameProp === ScreenName.NOTIFICATION && (
                        <>
                            {renderReadAllButton()}
                        </>
                    )}
                </>
            );
        }
        return null;
    };

    const renderSearch = () => (
        <CustomInput
            value=""
            inputStyle={{
                width: NowTheme.SIZES.WIDTH_BASE * 0.9
            }}
            keyboardType="number-pad"
            containerStyle={{
                marginVertical: 10,
                width: NowTheme.SIZES.WIDTH_BASE * 0.9
            }}
            placeholder="Bạn muốn tìm gì?"
            rightIcon={{
                name: 'eye',
                family: IconFamily.ENTYPO,
                size: 20,
                color: NowTheme.COLORS.DEFAULT
            }}
            onPressRightIcon={() => console.log('search')}
        />
    );

    const renderTabs = () => {
        const defaultTab = tabs && tabs[0] && tabs[0].id;

        if (!tabs) return null;

        return (
            <Tabs
                data={tabs || []}
                initialIndex={tabIndex || defaultTab}
                onChange={(id) => navigation.setParams({ tabId: id })}
            />
        );
    };

    const renderHeader = () => {
        if (search || tabs || options) {
            return (
                <Block center>
                    {search ? renderSearch() : null}
                    {tabs ? renderTabs() : null}
                </Block>
            );
        }

        return null;
    };

    const clearAllCache = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: ScreenName.ONBOARDING }],
        });
        dispatch(resetStoreSignOut());
        SecureStore.deleteItemAsync('api_token')
            .then(console.log('api_token was cleaned!'));

        SecureStore.deleteItemAsync('phoneNumber')
            .then(console.log('phoneNumber was cleaned!'));

        SecureStore.deleteItemAsync('password')
            .then(console.log('password was cleaned!'));

        SecureStore.deleteItemAsync('deviceId')
            .then(console.log('deviceId was cleaned!'));
    };

    const handleOnPressNavBar = () => {
        if (screenNameProp && screenNameProp === ScreenName.MESSAGE) {
            navigation.navigate(ScreenName.PROFILE, {
                userId: chattingWith
            });
        }
    };

    return (
        <Block style={headerStyles}>
            <TouchableWithoutFeedback
                onPress={() => handleOnPressNavBar()}
                onLongPress={() => clearAllCache()}
            >
                <NavBar
                    back={false}
                    title={title}
                    style={navbarStyles}
                    transparent={transparent}
                    rightStyle={{ alignItems: 'center' }}
                    leftStyle={{ paddingVertical: 12, flex: 0.2 }}
                    titleStyle={[
                        styles.title,
                        { color: NowTheme.COLORS[white ? 'WHITE' : 'HEADER'] },
                        titleColor && { color: titleColor }
                    ]}
                    {...props}
                />
            </TouchableWithoutFeedback>
            {screenNameProp && screenNameProp === ScreenName.MESSAGE && (
                <Block
                    style={{
                        marginLeft: 7,
                        marginTop: 0,
                        zIndex: 99
                    }}
                >
                    <Text
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                            marginTop: iPhoneX ? -16 : -20,
                        }}
                        size={10}
                        color={NowTheme.COLORS.ACTIVE}
                    >
                        Vừa mới truy cập
                    </Text>
                </Block>
            )}

            {renderHeader()}
            {renderRight()}
        </Block>
    );
}

Header.defaultProps = {
    showRight: true
};

const styles = StyleSheet.create({
    button: {
        padding: 12,
        position: 'relative'
    },
    title: {
        width: '100%',
        fontSize: 16,
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
        marginLeft: -70
    },
    navbar: {
        paddingTop: iPhoneX ? NowTheme.SIZES.HEIGHT_BASE * 0.05 : null,
        zIndex: 5
    },
    navbarHeight: {
        height: NowTheme.SIZES.HEIGHT_BASE * 0.1,
    },
    shadow: {
        backgroundColor: NowTheme.COLORS.BASE,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.2,
        elevation: 3
    },
    notify: {
        backgroundColor: NowTheme.COLORS.SUCCESS,
        borderRadius: 4,
        height: NowTheme.SIZES.HEIGHT_BASE / 2,
        width: NowTheme.SIZES.WIDTH_BASE / 2,
        position: 'absolute',
        top: 9,
        right: 12
    },
    header: {
        backgroundColor: NowTheme.COLORS.BASE
    },
    divider: {
        borderRightWidth: 0.3,
        borderRightColor: NowTheme.COLORS.BLOCK
    },
    search: {
        height: 48,
        width: NowTheme.SIZES.WIDTH_BASE - 32,
        marginHorizontal: 16,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: NowTheme.COLORS.BORDER
    },
    options: {
        marginBottom: 24,
        marginTop: 10,
        elevation: 4
    },
    tab: {
        backgroundColor: NowTheme.COLORS.TRANSPARENT,
        width: NowTheme.SIZES.WIDTH_BASE * 0.35,
        borderRadius: 0,
        borderWidth: 0,
        height: 24,
        elevation: 0
    },
    tabTitle: {
        lineHeight: 19,
        fontWeight: '400',
        color: NowTheme.COLORS.HEADER,
        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
    },
});
