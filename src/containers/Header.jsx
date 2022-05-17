import { CustomInput, IconCustom } from '@components/uiComponents';
import {
    IconFamily, ScreenName, Theme
} from '@constants/index';
import { clearAllLocalStorage } from '@helpers/CommonHelpers';
import { resetStoreSignOut, setListNotification, setNumberNotificationUnread } from '@redux/Actions';
import { NotificationServices } from '@services/index';
import {
    NavBar
} from 'galio-framework';
import React from 'react';
import {
    Platform, StyleSheet, TouchableOpacity, View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const iPhoneX = Platform.OS === 'ios';
const {
    FONT: {
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

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

    const renderReadAllButton = () => (
        <View
            style={{
                position: 'absolute',
                bottom: 6,
                right: 10,
                zIndex: 99,
            }}
        >
            <TouchableOpacity
                onPress={() => triggerReadAllNotification()}
            >
                <IconCustom
                    name="notification-clear-all"
                    family={IconFamily.MATERIAL_COMMUNITY_ICONS}
                    size={30}
                    color={COLORS.DEFAULT}
                />
            </TouchableOpacity>
        </View>
    );

    const navbarStyles = [
        styles.navbar,
        {
            backgroundColor: COLORS.BASE
        },
        styles.navbarHeight
    ];

    const renderRight = () => {
        if (showRight) {
            return (
                <>
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
                width: SIZES.WIDTH_MAIN
            }}
            keyboardType="number-pad"
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_MAIN
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
        clearAllLocalStorage();
    };

    return (
        <View style={headerStyles}>
            <TouchableOpacity
                onLongPress={() => clearAllCache()}
                onPress={() => {
                    if (chattingWith) {
                        navigation.navigate(ScreenName.PROFILE, { userId: chattingWith });
                    }
                }}
            >
                <NavBar
                    back={false}
                    title={title}
                    style={navbarStyles}
                    transparent={transparent}
                    rightStyle={{ alignItems: 'center' }}
                    leftStyle={{
                        flex: 0.3,
                    }}
                    titleStyle={[
                        styles.title,
                        {
                            color: COLORS.DEFAULT
                        },
                        titleColor && { color: titleColor }
                    ]}
                    {...props}
                />
            </TouchableOpacity>
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
        fontSize: SIZES.FONT_H2,
        fontFamily: TEXT_BOLD,
        marginLeft: -70,
        color: COLORS.DEFAULT,
        marginTop: iPhoneX ? 5 : 26
    },
    navbar: {
        paddingTop: iPhoneX ? SIZES.HEIGHT_BASE * 0.05 : null,
        zIndex: 5
    },
    navbarHeight: {
        height: 70,
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
