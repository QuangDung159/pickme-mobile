/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { NO_AVATAR_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import {
    Block, Text
} from 'galio-framework';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Image, RefreshControl, StyleSheet } from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import { useDispatch, useSelector } from 'react-redux';
import {
    CenterLoader, CustomButton, Line
} from '../../../components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '../../../constants';
import { MediaHelpers, ToastHelpers } from '../../../helpers';
import { resetStoreSignOut, setCurrentUser } from '../../../redux/Actions';
import { rxUtil } from '../../../utils';
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
    const [visible, setVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [image, setImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const token = useSelector((state) => state.userReducer.token);
    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    // Render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    useEffect(
        () => {
            if (JSON.stringify(currentUser) === JSON.stringify({})) {
                setIsShowSpinner(true);
                fetchCurrentUserInfo();
            }
        }, []
    );

    const handleOnPickAvatar = (uri) => {
        setIsShowSpinner(true);

        MediaHelpers.uploadImage(
            uri,
            Rx.USER.UPDATE_AVATAR,
            token,
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
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
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

    const fetchCurrentUserInfo = () => {
        rxUtil(
            Rx.USER.CURRENT_USER_INFO,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                dispatch(setCurrentUser(res.data.data));
                setIsShowSpinner(false);
                setRefreshing(false);
            },
            (res) => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast(res.data.message, 'error');
                setRefreshing(false);
            },
            (res) => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast(res.data.message, 'error');
                setRefreshing(false);
            }
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchCurrentUserInfo();
    };

    // Render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderImageView = () => {
        if (visible) {
            return (
                <ImageView
                    images={[{ uri: currentUser.url }]}
                    imageIndex={imageIndex}
                    visible={visible}
                    onRequestClose={() => setVisible(false)}
                />
            );
        }
        return <></>;
    };

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
        <Block
            style={{
                width: SIZES.WIDTH_BASE * 0.3,
                marginTop: 5
            }}
        >
            <Block>
                <CenterLoader />
                <Block
                    style={{
                        zIndex: 99,
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            setVisible(true);
                            setImageIndex(0);
                        }}
                    >
                        <Block style={{
                            marginTop: 10
                        }}
                        >
                            {renderAvatar()}
                        </Block>
                    </TouchableWithoutFeedback>
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
                </Block>
            </Block>
        </Block>
    );

    const renderSubInfoPanel = () => {
        const {
            walletAmount,
            dob,
            homeTown,
            interests
        } = currentUser;
        return (
            <Block
                style={{
                    width: SIZES.WIDTH_BASE * 0.6,
                    marginVertical: 15,
                }}
            >
                <UserInfoSection
                    listUserInfo={
                        [
                            {
                                value: walletAmount && walletAmount.toString(),
                                icon: {
                                    name: 'diamond',
                                    family: IconFamily.SIMPLE_LINE_ICONS,
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
                                    size: 23
                                }
                            },
                            {
                                value: homeTown,
                                icon: {
                                    name: 'home',
                                    family: IconFamily.FONT_AWESOME,
                                    color: COLORS.ACTIVE,
                                    size: 28
                                }
                            },
                            {
                                value: interests,
                                icon: {
                                    name: 'badminton',
                                    family: IconFamily.MATERIAL_COMMUNITY_ICONS,
                                    color: COLORS.ACTIVE,
                                    size: 24
                                }
                            },
                        ]
                    }
                />
            </Block>
        );
    };

    const renderInfoPanel = () => (
        <Block>
            <Block
                style={{
                    marginTop: 20,
                }}
            >
                <Text
                    center
                    style={{
                        color: COLORS.ACTIVE,
                        fontSize: SIZES.FONT_H1,
                        fontFamily: MONTSERRAT_BOLD,
                    }}
                >
                    {currentUser.fullName}
                </Text>
            </Block>

            <Block>
                <Block>
                    <Block
                        style={{
                            marginBottom: 20
                        }}
                    >
                        <Text
                            center
                            style={{
                                fontFamily: MONTSERRAT_REGULAR,
                            }}
                            size={SIZES.FONT_H2}
                            color={COLORS.DEFAULT}
                        >
                            {'"'}
                            {currentUser.description}
                            {'"'}
                        </Text>
                    </Block>

                    <TouchableWithoutFeedback
                        onPress={() => {
                            navigation.navigate(ScreenName.VERIFICATION);
                        }}
                    >

                        <Block
                            style={{
                                marginVertical: 10
                            }}
                        >
                            <VerificationStatusPanel />
                        </Block>
                    </TouchableWithoutFeedback>

                    <Block style={{
                        marginBottom: 10,
                        alignItems: 'center'
                    }}
                    >
                        <Block
                            style={{
                                marginTop: 10
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
                        </Block>
                    </Block>
                </Block>
            </Block>

            <Block
                middle
            >
                <Line
                    borderColor={COLORS.ACTIVE}
                    borderWidth={0.5}
                    width={SIZES.WIDTH_BASE * 0.9}
                />
            </Block>
        </Block>
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
        />
    );

    try {
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={(
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                    />
                )}
            >
                {isShowSpinner ? (
                    <Block
                        style={{
                            marginTop: SIZES.HEIGHT_BASE * 0.3
                        }}
                    >
                        <CenterLoader />
                    </Block>
                ) : (
                    <>
                        {renderImageView()}

                        <Block
                            row
                            style={{
                                width: SIZES.WIDTH_BASE * 0.9,
                                alignSelf: 'center'
                            }}
                        >
                            {renderAvatarPanel()}
                            {renderSubInfoPanel()}
                        </Block>

                        <Block>
                            <Block
                                middle
                            >
                                <Line
                                    borderColor={COLORS.ACTIVE}
                                    borderWidth={0.5}
                                    width={SIZES.WIDTH_BASE * 0.9}
                                />
                            </Block>
                        </Block>

                        {renderInfoPanel(currentUser, navigation)}

                        <Block>
                            {renderButtonLogout(navigation)}
                        </Block>
                    </>
                )}
            </ScrollView>
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
