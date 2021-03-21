/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { NO_AVATAR_URL } from '@env';
import {
    Block, Button, Text
} from 'galio-framework';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import { useDispatch, useSelector } from 'react-redux';
import { SubInfoProfile } from '../components/bussinessComponents';
import { CenterLoader, IconCustom, Line } from '../components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '../constants';
import { MediaHelpers, ToastHelpers } from '../helpers';
import { setCurrentUser } from '../redux/Actions';
import { rxUtil } from '../utils';

const thumbMeasure = (NowTheme.SIZES.WIDTH_BASE * 0.85) / 3;

export default function Personal(props) {
    const { navigation } = props;

    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [visible, setVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [listImageReview, setListImageReview] = useState([]);
    const [image, setImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const token = useSelector((state) => state.userReducer.token);
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const loginInfo = useSelector((state) => state.userReducer.loginInfo);
    const {
        password,
        username
    } = loginInfo;

    const dispatch = useDispatch();

    useEffect(
        () => {
            getListImagesByUser();
        }, []
    );

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
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

    const fetchCurrentUserInfo = () => {
        rxUtil(
            Rx.USER.CURRENT_USER_INFO,
            'GET',
            null,
            {
                Authorization: token
            },
            () => {
                getListImagesByUser();
            }
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchCurrentUserInfo();
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

    const refreshExpoTokenAPI = () => {
        rxUtil(
            Rx.AUTHENTICATION.LOGIN,
            'POST',
            {
                username,
                password,
                expoNotificationToken: 'invalid'
            },
            {},
            (res) => {
                console.log('res :>> ', res);
            }
        );
    };

    const onSignOut = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: ScreenName.ONBOARDING }],
        });
        refreshExpoTokenAPI();
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
                source={{ uri: currentUser.url || NO_AVATAR_URL }}
            />
        );
    };

    const renderAvatarPanel = () => {
        try {
            return (
                <Block>
                    <Block
                        row
                        center
                        style={{
                            width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                            marginTop: 10
                        }}
                    >
                        <Block
                            flex={3}
                            middle
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
                                        zIndex: 99,
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
                    </Block>
                    <Block>
                        {renderButtonPanel()}
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
        } catch (exception) {
            console.log('exception :>> ', exception);
            return (
                <>
                    {ToastHelpers.renderToast()}
                </>
            );
        }
    };

    const renderButtonPanel = () => (
        <Block
            row
            space="around"
            style={{
                marginTop: 20,
                paddingBottom: 10
            }}
        >
            <TouchableWithoutFeedback
                onPress={() => navigation.navigate(ScreenName.WALLET)}
            >
                <IconCustom
                    name="treasure-chest"
                    family={IconFamily.MATERIAL_COMMUNITY_ICONS}
                    size={23}
                    color={NowTheme.COLORS.ACTIVE}
                />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
                onPress={() => navigation.navigate(ScreenName.BOOKING_LIST)}
            >
                <IconCustom
                    name="clipboard-list"
                    family={IconFamily.FONT_AWESOME_5}
                    size={20}
                    color={NowTheme.COLORS.ACTIVE}
                />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
                onPress={() => navigation.navigate(ScreenName.SETTINGS)}
            >
                <Block>
                    <IconCustom
                        name="gear"
                        family={IconFamily.FONT_AWESOME}
                        size={20}
                        color={NowTheme.COLORS.ACTIVE}
                    />
                </Block>
            </TouchableWithoutFeedback>
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
                    <Block style={{
                        marginBottom: 10,
                        alignItems: 'center'
                    }}
                    >
                        <Block
                            style={{
                                width: NowTheme.SIZES.WIDTH_BASE * 0.9
                            }}
                        >
                            <SubInfoProfile user={currentUser} />
                        </Block>
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
        <Block
            style={{
                paddingTop: 20,
                width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                alignSelf: 'center'
            }}
        >
            <TouchableWithoutFeedback
                onPress={() => onSignOut(navigation)}
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
        </Block>
    );

    return (
        <>
            {isShowSpinner ? (
                <Block
                    middle
                    style={{
                        height: NowTheme.SIZES.HEIGHT_BASE * 0.8
                    }}
                >
                    <ActivityIndicator
                        size="large"
                        color={NowTheme.COLORS.ACTIVE}
                    />
                </Block>
            ) : (
                <Block flex>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={(
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => onRefresh()}
                            />
                        )}
                    >
                        {renderImageView()}

                        {renderAvatarPanel()}

                        {renderInfoPanel(currentUser, navigation)}

                        <Block>
                            {renderButtonLogout(navigation)}
                        </Block>
                    </ScrollView>
                </Block>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.4,
        elevation: 2
    },
    albumThumb: {
        borderRadius: 4,
        alignSelf: 'center',
        width: thumbMeasure,
        height: thumbMeasure
    },
    avatar: {
        borderRadius: 100,
        width: NowTheme.SIZES.WIDTH_BASE * 0.25,
        height: NowTheme.SIZES.WIDTH_BASE * 0.25,
    },
    updateAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 99,
    }
});
