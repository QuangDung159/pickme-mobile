/* eslint-disable import/no-unresolved */
import {
    CustomText, IconCustom, Line
} from '@components/uiComponents';
import App from '@constants/App';
import IconFamily from '@constants/IconFamily';
import ScreenName from '@constants/ScreenName';
import ScreenTitle from '@constants/ScreenTitle';
import Theme from '@constants/Theme';
import { ENV } from '@constants/Config';
import ToastHelpers from '@helpers/ToastHelpers';
import { resetStoreSignOut } from '@redux/Actions';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import {
    FlatList, Platform, TouchableOpacity, View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Linking from 'expo-linking';
import OutsideApp from '@constants/OutsideApp';

const {
    SIZES, FONT: {
        TEXT_BOLD
    },
    COLORS
} = Theme;

export default function Menu({ navigation }) {
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const listMenu = [
        // {
        //     title: 'Đơn hẹn',
        //     icon: {
        //         name: 'list-alt',
        //         family: IconFamily.FONT_AWESOME,
        //         size: 26,
        //     },
        //     onPress: () => {
        //         navigation.navigate(ScreenName.LEADER_BOARD);
        //     },
        // },
        {
            title: ScreenTitle.POLICY,
            icon: {
                name: 'legal',
                family: IconFamily.FONT_AWESOME,
                size: 20,
            },
            onPress: () => {
                navigation.navigate(ScreenName.POLICY);
            },
        },
        {
            title: ScreenTitle.GUIDE,
            icon: {
                name: 'book',
                family: IconFamily.FONT_AWESOME,
                size: 22,
            },
            onPress: () => {
                navigation.navigate(ScreenName.GUIDE);
            },
        },
        // {
        //     title: ScreenTitle.LEADER_BOARD,
        //     icon: {
        //         name: 'award',
        //         family: IconFamily.FONT_AWESOME_5,
        //         size: 22,
        //     },
        //     onPress: () => {
        //         navigation.navigate(ScreenName.LEADER_BOARD);
        //     },
        // },
        {
            title: currentUser.isPartnerVerified ? 'Thông tin Host' : 'Đăng kí Host',
            icon: {
                name: 'star',
                family: IconFamily.FONT_AWESOME,
                size: 24,
            },
            onPress: () => {
                if (currentUser.isPartnerVerified) {
                    navigation.navigate(ScreenName.PARTNER_DATA);
                } else {
                    navigation.navigate(ScreenName.VERIFICATION, {
                        navigateFrom: ScreenName.MENU
                    });
                }
            },
        },
        {
            title: ScreenTitle.CHANGE_PASSWORD,
            icon: {
                name: 'user-lock',
                family: IconFamily.FONT_AWESOME_5,
                size: 18,
            },
            onPress: () => {
                navigation.navigate(ScreenName.CHANGE_PASSWORD);
            },
        },
        {
            title: ScreenTitle.SUPPORT,
            icon: {
                family: IconFamily.MATERIAL_ICONS,
                size: 26,
                name: 'contact-support',
            },
            onPress: () => {
                navigation.navigate(ScreenName.SUPPORT);
            },
        },
        // {
        //     title: ScreenTitle.SETTINGS,
        //     icon: {
        //         name: 'gear',
        //         family: IconFamily.FONT_AWESOME,
        //         size: 26,
        //     },
        //     onPress: () => {
        //         navigation.navigate(ScreenName.SETTINGS);
        //     },
        // },
        {
            title: 'Fanpage',
            icon: {
                name: 'facebook-square',
                family: IconFamily.FONT_AWESOME,
                size: 24,
            },
            onPress: () => {
                Linking.openURL(`${OutsideApp.FACEBOOK.deepLink}`);
            },
        },
        {
            title: 'Đánh giá ứng dụng',
            // icon: {
            //     name: 'facebook-square',
            //     family: IconFamily.FONT_AWESOME,
            //     size: 24,
            // },
            icon: Platform.OS === 'ios' ? {
                name: 'logo-apple-appstore',
                family: IconFamily.IONICONS,
                size: 24,
            } : {
                name: 'google-play',
                family: IconFamily.ENTYPO,
                size: 24,
            },
            onPress: () => {
                if (Platform.OS === 'ios') {
                    //
                } else {
                    Linking.openURL(OutsideApp.GOOGLE_PLAY_STORE.deepLink);
                }
            },
        },
        {
            title: 'Đăng xuất',
            onPress: () => onSignOut(),
            icon: {
                name: 'logout',
                size: 20,
                family: IconFamily.SIMPLE_LINE_ICONS
            },
        },
    ];

    const onSignOut = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: ScreenName.ONBOARDING }],
        });
        dispatch(resetStoreSignOut());
        SecureStore.deleteItemAsync('api_token')
            .then(console.log('api_token was cleaned!'));
    };

    const renderMenuItem = (menuItem) => {
        const { icon } = menuItem;
        return (
            (
                <View style={{
                    alignSelf: 'center',
                }}
                >
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: SIZES.WIDTH_BASE * 0.9,
                            alignSelf: 'center',
                            height: 30,
                        }}
                        onPress={() => menuItem.onPress()}
                    >
                        <View
                            style={{
                                flex: 1
                            }}
                        >
                            <IconCustom
                                name={icon.name}
                                family={icon.family}
                                size={icon.size}
                                color={COLORS.ACTIVE}
                            />
                        </View>
                        <View
                            style={{
                                flex: 9,
                            }}
                        >
                            <CustomText
                                text={menuItem.title}
                                style={{
                                    fontSize: SIZES.FONT_H3,
                                    fontFamily: TEXT_BOLD
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                    <Line />
                </View>
            )
        );
    };

    try {
        return (
            <>
                <FlatList
                    data={listMenu}
                    renderItem={({ item, index }) => renderMenuItem(item, index)}
                    keyExtractor={(item) => item.title}
                    style={{
                        paddingTop: 10
                    }}
                />
                {/* <TouchableText
                    onPress={() => {
                        console.log('object');
                        Clipboard.setString(currentUser.expoNotificationToken);
                        ToastHelpers.renderToast('Đã lưu vào khay nhớ tạm.', 'success');
                    }}
                    style={{
                        fontSize: SIZES.FONT_H5,
                        textAlign: 'center',
                        marginBottom: 10
                    }}
                    text={currentUser.expoNotificationToken}
                /> */}
                <CustomText
                    style={{
                        fontSize: SIZES.FONT_H5,
                        textAlign: 'center',
                        marginBottom: 10
                    }}
                    text={`${Constants.manifest.version} - ${ENV} (${App.APP_VERSION_OTA})`}
                />
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
