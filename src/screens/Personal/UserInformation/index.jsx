/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import {
    CenterLoader, CustomButton, Line
} from '@components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '@constants/index';
import { NO_AVATAR_URL } from '@env';
import { MediaHelpers, ToastHelpers } from '@helpers/index';
import { resetStoreSignOut, setCurrentUser } from '@redux/Actions';
import { UserServices } from '@services/index';
import * as SecureStore from 'expo-secure-store';
import moment from 'moment';
import React, { useState } from 'react';
import {
    Image, RefreshControl, StyleSheet, Text, View
} from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import UserInfoSection from './UserInfoSection';
import VerificationStatusPanel from './VerificationStatusPanel';

const {
    FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = NowTheme;

export default function UserInformation({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [image, setImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    // Render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const handleOnPickAvatar = (uri) => {
        setIsShowSpinner(true);

        MediaHelpers.uploadImage(
            uri,
            Rx.USER.UPDATE_AVATAR,
            (res) => {
                ToastHelpers.renderToast(
                    res.data.message || 'Tải ảnh lên thành công!', 'success'
                );
                setIsShowSpinner(false);
                setImage(uri);

                dispatch(
                    setCurrentUser({ ...currentUser, url: res.data.data.url || NO_AVATAR_URL })
                );
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
            }
        );
    };

    const onClickUpdateAvatar = () => {
        MediaHelpers.pickImage(true, [1, 1], (result) => handleOnPickAvatar(result.uri));
    };

    const onSignOut = () => {
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
    };

    const fetchCurrentUserInfo = async () => {
        const result = await UserServices.fetchCurrentUserInfoAsync();
        const { data } = result;

        const currentUserInfo = await UserServices.mappingCurrentUserInfo(data.data);
        if (data) {
            dispatch(setCurrentUser(currentUserInfo));
        }

        setIsShowSpinner(false);
        setRefreshing(false);
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchCurrentUserInfo();
    };

    // Render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderAvatar = () => {
        if (image) {
            return (
                <Image
                    style={styles.avatar}
                    source={{ uri: image }}
                />
            );
        }
        return (
            <Image
                style={styles.avatar}
                source={{ uri: currentUser?.url || NO_AVATAR_URL }}
            />
        );
    };

    const renderAvatarPanel = () => (
        <View
            style={{
                width: SIZES.WIDTH_BASE * 0.3,
                marginTop: 5,
            }}
        >
            <View
                style={{
                    marginTop: 10
                }}
            >
                <CenterLoader />
                <View
                    style={{
                        zIndex: 99
                    }}
                >
                    {renderAvatar()}
                </View>
            </View>
            <CustomButton
                onPress={() => onClickUpdateAvatar()}
                labelStyle={{
                    fontSize: SIZES.FONT_H3,
                }}
                buttonStyle={{
                    width: SIZES.WIDTH_BASE * 0.25,
                    borderWidth: 0,
                    alignSelf: 'flex-start'
                }}
                label="Đổi avatar"
            />
        </View>
    );

    const renderSubInfoPanel = () => {
        const {
            walletAmountDisplay,
            dob,
            homeTown,
            interests
        } = currentUser;
        return (
            <View
                style={{
                    width: SIZES.WIDTH_BASE * 0.6,
                    marginVertical: 15,
                }}
            >
                <UserInfoSection
                    listUserInfo={
                        [
                            {
                                value: walletAmountDisplay && `${walletAmountDisplay.toString()}k VND`,
                                icon: {
                                    name: 'money',
                                    family: IconFamily.FONT_AWESOME,
                                    color: COLORS.ACTIVE,
                                    size: 24
                                }
                            },
                            {
                                value: moment(dob).format('YYYY').toString(),
                                icon: {
                                    name: 'birthday-cake',
                                    family: IconFamily.FONT_AWESOME,
                                    color: COLORS.ACTIVE,
                                    size: 22
                                }
                            },
                            {
                                value: homeTown,
                                icon: {
                                    name: 'home',
                                    family: IconFamily.FONT_AWESOME,
                                    color: COLORS.ACTIVE,
                                    size: 24
                                }
                            },
                            {
                                value: interests,
                                icon: {
                                    name: 'badminton',
                                    family: IconFamily.MATERIAL_COMMUNITY_ICONS,
                                    color: COLORS.ACTIVE,
                                    size: 22
                                }
                            },
                        ]
                    }
                />
            </View>
        );
    };

    const renderInfoPanel = () => (
        <>
            <View
                style={{
                    backgroundColor: COLORS.BLOCK,
                    marginTop: 5
                }}
            >
                <View
                    style={{
                        marginTop: 10,
                    }}
                >
                    <Text
                        style={{
                            color: COLORS.ACTIVE,
                            fontSize: SIZES.FONT_H1,
                            fontFamily: MONTSERRAT_BOLD,
                            textAlign: 'center'
                        }}
                    >
                        {currentUser.fullName}
                    </Text>
                </View>

                <View
                    style={{
                        marginBottom: 20,
                        marginTop: 10
                    }}
                >
                    <Text
                        style={{
                            fontFamily: MONTSERRAT_REGULAR,
                            fontSize: SIZES.FONT_H2,
                            color: COLORS.DEFAULT,
                            textAlign: 'center'
                        }}
                    >
                        {'"'}
                        {currentUser.description}
                        {'"'}
                    </Text>
                </View>
            </View>
        </>
    );

    const renderButtonLogout = () => (
        <CustomButton
            onPress={() => onSignOut(navigation)}
            labelStyle={{
                fontSize: SIZES.FONT_H3,
            }}
            label="Đăng xuất"
            leftIcon={{
                name: 'logout',
                size: SIZES.FONT_H3,
                color: COLORS.SWITCH_OFF,
                family: IconFamily.SIMPLE_LINE_ICONS
            }}
            buttonStyle={{
                marginVertical: 10
            }}
        />
    );

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={(
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => onRefresh()}
                                tintColor={COLORS.ACTIVE}
                            />
                        )}
                    >
                        <View
                            style={{
                                backgroundColor: COLORS.BLOCK,
                                marginTop: 5
                            }}
                        >
                            <View
                                style={{
                                    width: SIZES.WIDTH_BASE * 0.9,
                                    alignSelf: 'center',
                                    flexDirection: 'row',
                                }}
                            >
                                {renderAvatarPanel()}
                                {renderSubInfoPanel()}
                            </View>
                            <View
                                style={{
                                    alignSelf: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Line
                                    borderColor={COLORS.ACTIVE}
                                    borderWidth={0.5}
                                    width={SIZES.WIDTH_BASE * 0.9}
                                />
                            </View>
                            {renderInfoPanel(currentUser, navigation)}
                        </View>

                        <TouchableWithoutFeedback
                            onPress={() => {
                                navigation.navigate(ScreenName.VERIFICATION);
                            }}
                        >

                            <View
                                style={{
                                    backgroundColor: COLORS.BLOCK,
                                    marginTop: 5
                                }}
                            >
                                <VerificationStatusPanel />
                            </View>
                        </TouchableWithoutFeedback>

                        <View
                            style={{
                                backgroundColor: COLORS.BLOCK,
                                marginTop: 5
                            }}
                        >
                            <View style={{
                                marginVertical: 20,
                                alignItems: 'center'
                            }}
                            >
                                <CustomButton
                                    onPress={
                                        () => navigation.navigate(
                                            ScreenName.UPDATE_INFO_ACCOUNT,
                                        )
                                    }
                                    labelStyle={{
                                        fontSize: SIZES.FONT_H3
                                    }}
                                    label="Chỉnh sửa thông tin cá nhân"
                                />
                            </View>

                            <View
                                style={{
                                    alignSelf: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Line
                                    borderColor={COLORS.ACTIVE}
                                    borderWidth={0.5}
                                    width={SIZES.WIDTH_BASE * 0.9}
                                />
                            </View>

                            {renderButtonLogout(navigation)}
                        </View>
                    </ScrollView>
                )}
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

const styles = StyleSheet.create({
    shadow: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.4,
        elevation: 2
    },
    avatar: {
        borderRadius: 100,
        width: SIZES.WIDTH_BASE * 0.25,
        height: SIZES.WIDTH_BASE * 0.25,
    },
});
