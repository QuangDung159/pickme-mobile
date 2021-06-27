import { CustomInput, IconCustom } from '@components/uiComponents';
import {
    IconFamily, NowTheme, ScreenName
} from '@constants/index';
import { resetStoreSignOut, setListNotification, setNumberNotificationUnread } from '@redux/Actions';
import { NotificationServices } from '@services/index';
import * as SecureStore from 'expo-secure-store';
import {
    NavBar
} from 'galio-framework';
import React from 'react';
import {
    Platform, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

const iPhoneX = Platform.OS === 'ios';
const {
    FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = NowTheme;

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

    const getListNotiFromAPI = async () => {
        const result = await NotificationServices.fetchListNotificationAsync();
        const { data } = result;

        if (data) {
            // set store
            dispatch(setListNotification(data.data));
            countNumberNotificationUnread(data.data);
        }
    };

    const triggerReadAllNotification = async () => {
        const result = await NotificationServices.triggerReadAllNotificationAsync();
        const { data } = result;

        if (data) {
            getListNotiFromAPI();
        }
    };

    const renderQnAButton = () => (
        <View
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
                    color={COLORS.ACTIVE}
                />
            </TouchableOpacity>
        </View>
    );

    const renderSettingButton = () => (
        <View
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
                    color={COLORS.ACTIVE}
                />
            </TouchableOpacity>
        </View>
    );

    const renderReadAllButton = () => (
        <View
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
                    color={COLORS.ACTIVE}
                />
            </TouchableOpacity>
        </View>
    );

    const navbarStyles = [
        styles.navbar,
        { backgroundColor: COLORS.BLOCK },
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
                width: SIZES.WIDTH_BASE * 0.9
            }}
            keyboardType="number-pad"
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            placeholder="Bạn muốn tìm gì?"
            rightIcon={{
                name: 'eye',
                family: IconFamily.ENTYPO,
                size: 20,
                color: COLORS.DEFAULT
            }}
            onPressRightIcon={() => console.log('search')}
        />
    );

    const renderHeader = () => {
        if (search || tabs || options) {
            return (
                <View
                    style={{
                        alignSelf: 'center'
                    }}
                >
                    {search ? renderSearch() : null}
                </View>
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
        <View style={headerStyles}>
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
                        { color: COLORS.DEFAULT },
                        titleColor && { color: titleColor }
                    ]}
                    {...props}
                />
            </TouchableWithoutFeedback>
            {screenNameProp && screenNameProp === ScreenName.MESSAGE && (
                <View
                    style={{
                        marginLeft: 7,
                        marginTop: 0,
                        zIndex: 99
                    }}
                >
                    <Text
                        style={{
                            fontFamily: MONTSERRAT_REGULAR,
                            marginTop: iPhoneX ? -16 : -20,
                            fontSize: SIZES.FONT_H5,
                            color: COLORS.ACTIVE
                        }}

                    >
                        Vừa mới truy cập
                    </Text>
                </View>
            )}

            {renderHeader()}
            {renderRight()}
        </View>
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
        fontFamily: MONTSERRAT_BOLD,
        marginLeft: -70
    },
    navbar: {
        paddingTop: iPhoneX ? SIZES.HEIGHT_BASE * 0.05 : null,
        zIndex: 5
    },
    navbarHeight: {
        height: SIZES.HEIGHT_BASE * 0.1,
    },
    shadow: {
        backgroundColor: COLORS.BASE,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.2,
        elevation: 3
    },
    options: {
        marginBottom: 24,
        marginTop: 10,
        elevation: 4
    },
});
