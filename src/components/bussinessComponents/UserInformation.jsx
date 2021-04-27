/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { NO_AVATAR_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import {
    Block, Button, Text
} from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { Image, RefreshControl, StyleSheet } from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import { useDispatch, useSelector } from 'react-redux';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '../../constants';
import { MediaHelpers, ToastHelpers } from '../../helpers';
import { resetStoreSignOut, setCurrentUser } from '../../redux/Actions';
import { rxUtil } from '../../utils';
import {
    CenterLoader, IconCustom, Line
} from '../uiComponents';
import SubInfoProfile from './SubInfoProfile';
import VerificationStatusPanel from './VerificationStatusPanel';

export default function UserInformation({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [visible, setVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [listImageReview, setListImageReview] = useState([]);
    const [image, setImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const token = useSelector((state) => state.userReducer.token);
    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    // Render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    useEffect(
        () => {
            // onSignOut(navigation);
            if (JSON.stringify(currentUser) === JSON.stringify({})) {
                setIsShowSpinner(true);
                fetchCurrentUserInfo();
            }

            const eventTriggerGetCurrentUserInfo = navigation.addListener('focus', () => {
                fetchCurrentUserInfo();
            });

            return eventTriggerGetCurrentUserInfo;
        }, []
    );

    const getListImagesByUser = () => {
        const headers = {
            Authorization: token
        };

        rxUtil(
            Rx.USER.GET_LIST_IMAGE_BY_USER,
            'GET',
            null,
            headers,
            (res) => {
                setListImageReview(res.data.data);
                setRefreshing(false);
            },
            () => {},
            () => {}
        );
    };

    const handleOnPickAvatar = (uri) => {
        setIsShowSpinner(true);

        MediaHelpers.uploadImage(
            uri,
            Rx.USER.UPDATE_AVATAR,
            token,
            (res) => {
                ToastHelpers.renderToast(
                    res?.data?.message || 'Tải ảnh lên thành công!', 'success'
                );
                setIsShowSpinner(false);
                setImage(uri);

                if (res?.data?.data) {
                    dispatch(
                        setCurrentUser({ ...currentUser, url: res?.data?.data || '' })
                    );
                }
            },
            (err) => {
                ToastHelpers.renderToast(
                    err?.data?.message || 'Tải ảnh lên thất bại! Vui lòng thử lại.', 'error'
                );
                setIsShowSpinner(false);
            },
            () => {
                ToastHelpers.renderToast('Tải ảnh lên thất bại! Vui lòng thử lại.', 'error');
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
        SecureStore.setItemAsync('api_token', '')
            .then(console.log('api_token was cleaned!'));
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
                getListImagesByUser();
            },
            () => {
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            }
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchCurrentUserInfo();
    };

    // Render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderImageView = () => {
        const listImageObj = [];

        listImageReview.forEach((item) => {
            listImageObj.push({
                uri: item.url
            });
        });

        if (visible) {
            return (
                <ImageView
                    images={listImageObj}
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
        <Block>
            <Block
                row
                center
                style={{
                    width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                    marginVertical: 10,
                }}
            >
                <Block
                    style={{
                        width: NowTheme.SIZES.WIDTH_BASE * 0.3
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            setVisible(true);
                            setImageIndex(0);
                            setListImageReview([{ url: currentUser.url }]);
                        }}
                    >
                        <CenterLoader size="small" />
                        <Block
                            style={{
                                zIndex: 99
                            }}
                        >
                            <Block
                                style={styles.updateAvatarButton}
                            >
                                <TouchableWithoutFeedback
                                    onPress={() => onClickUpdateAvatar()}
                                >
                                    <IconCustom
                                        name="photo-camera"
                                        family={IconFamily.MATERIAL_ICONS}
                                        color={NowTheme.COLORS.DEFAULT}
                                        size={15}
                                    />
                                </TouchableWithoutFeedback>
                            </Block>
                            {renderAvatar()}
                        </Block>
                    </TouchableWithoutFeedback>
                </Block>

                <Block
                    center
                    style={{
                        width: NowTheme.SIZES.WIDTH_BASE * 0.6,
                    }}
                >
                    <SubInfoProfile user={currentUser} />
                </Block>
            </Block>
            <Block>
                <Block
                    middle
                >
                    <Line
                        borderColor={NowTheme.COLORS.ACTIVE}
                        borderWidth={0.5}
                        width={NowTheme.SIZES.WIDTH_BASE * 0.9}
                    />
                </Block>
            </Block>
        </Block>
    );

    const renderInfoPanel = () => (
        <Block>
            <Block
                style={{
                    marginVertical: 20,
                }}
            >
                <Text
                    center
                    style={{
                        color: NowTheme.COLORS.ACTIVE,
                        fontSize: 25,
                        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
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
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                            }}
                            size={NowTheme.SIZES.FONT_H2}
                            color={NowTheme.COLORS.DEFAULT}
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
                            <Button
                                color={NowTheme.COLORS.BLOCK}
                                fontSize={NowTheme.SIZES.FONT_H3}
                                style={{
                                    width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                                    marginVertical: 10
                                }}
                                onPress={
                                    () => navigation.navigate(
                                        ScreenName.UPDATE_INFO_ACCOUNT,
                                    )
                                }
                                textStyle={{
                                    color: NowTheme.COLORS.ACTIVE
                                }}
                                shadowless
                            >
                                Chỉnh sửa trang cá nhân
                            </Button>
                        </Block>
                    </Block>
                </Block>
            </Block>

            <Block
                middle
            >
                <Line
                    borderColor={NowTheme.COLORS.ACTIVE}
                    borderWidth={0.5}
                    width={NowTheme.SIZES.WIDTH_BASE * 0.9}
                />
            </Block>
        </Block>
    );

    const renderButtonLogout = () => (
        <TouchableWithoutFeedback
            onPress={() => onSignOut(navigation)}
            containerStyle={{
                paddingVertical: 10,
                paddingBottom: 20,
                width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                alignSelf: 'center'
            }}
        >
            <Block
                row
                style={{
                    alignItems: 'center'
                }}
            >
                <IconCustom
                    name="sign-out"
                    size={NowTheme.SIZES.FONT_H3}
                    color={NowTheme.COLORS.SWITCH_OFF}
                    family={IconFamily.FONT_AWESOME}
                />
                <Text
                    color={NowTheme.COLORS.SWITCH_OFF}
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        marginLeft: 10
                    }}
                    size={NowTheme.SIZES.FONT_H3}
                >
                    Đăng xuất
                </Text>
            </Block>
        </TouchableWithoutFeedback>
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
                            marginTop: NowTheme.SIZES.HEIGHT_BASE * 0.3
                        }}
                    >
                        <CenterLoader />
                    </Block>
                ) : (
                    <>
                        {renderImageView()}

                        {renderAvatarPanel()}

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
        width: NowTheme.SIZES.WIDTH_BASE * 0.25,
        height: NowTheme.SIZES.WIDTH_BASE * 0.25,
    },
    updateAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: NowTheme.SIZES.WIDTH_BASE * 0.05,
        zIndex: 99,
    }
});
