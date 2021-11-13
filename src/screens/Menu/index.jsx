import { CustomText, IconCustom, Line } from '@components/uiComponents';
import IconFamily from '@constants/IconFamily';
import ScreenName from '@constants/ScreenName';
import ScreenTitle from '@constants/ScreenTitle';
import Theme from '@constants/Theme';
import ToastHelpers from '@helpers/ToastHelpers';
import { resetStoreSignOut } from '@redux/Actions';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

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
            title: ScreenTitle.LEADER_BOARD,
            icon: {
                name: 'award',
                family: IconFamily.FONT_AWESOME_5,
                size: 26,
            },
            onPress: () => {
                navigation.navigate(ScreenName.LEADER_BOARD);
            },
        },
        {
            title: ScreenTitle.SUPPORT,
            icon: {
                family: IconFamily.MATERIAL_ICONS,
                size: 30,
                name: 'contact-support',
            },
            onPress: () => {
                navigation.navigate(ScreenName.SUPPORT);
            },
        },
        {
            title: ScreenTitle.SETTINGS,
            icon: {
                name: 'gear',
                family: IconFamily.FONT_AWESOME,
                size: 30,
            },
            onPress: () => {
                navigation.navigate(ScreenName.SETTINGS);
            },
        },
        {
            title: ScreenTitle.CHANGE_PASSWORD,
            icon: {
                name: 'user-lock',
                family: IconFamily.FONT_AWESOME_5,
                size: 22,
            },
            onPress: () => {
                navigation.navigate(ScreenName.CHANGE_PASSWORD);
            },
        },
        {
            title: currentUser.isPartnerVerified ? 'Thông tin Host' : 'Đăng kí Host',
            icon: {
                name: 'star',
                family: IconFamily.FONT_AWESOME,
                size: 28,
            },
            onPress: () => {
                if (!currentUser.isPartnerVerified) {
                    navigation.navigate(ScreenName.PARTNER_DATA);
                } else {
                    navigation.navigate(ScreenName.VERIFICATION, {
                        navigateFrom: ScreenName.MENU
                    });
                }
            },
        },
        {
            title: 'Đăng xuất',
            onPress: () => onSignOut(),
            icon: {
                name: 'logout',
                size: SIZES.FONT_H1,
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
                            height: 45
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
                                flex: 8
                            }}
                        >
                            <CustomText
                                text={menuItem.title}
                                style={{
                                    fontSize: SIZES.FONT_H2,
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
