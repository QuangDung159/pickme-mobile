import {
    Block, Button, Text
} from 'galio-framework';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert,
    Image,
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
import { resetStoreSignOut, setCurrentUser } from '../redux/Actions';
import { rxUtil } from '../utils';

const thumbMeasure = (NowTheme.SIZES.WIDTH_BASE * 0.85) / 3;
const marginValue = ((NowTheme.SIZES.WIDTH_BASE * 0.9) - thumbMeasure * 3) / 2;

export default function Personal(props) {
    const { navigation } = props;

    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [visible, setVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [listImageReview, setListImageReview] = useState([]);
    const [listImageDisplay, setListImageDisplay] = useState([]);

    const token = useSelector((state) => state.userReducer.token);
    const currentUser = useSelector((state) => state.userReducer.currentUser);

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
                setListImageDisplay(res.data.data);
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

    const onClickUploadProfileImage = () => {
        MediaHelpers.pickImage(false, [], (result) => handleUploadImageProfile(result.uri));
    };

    const onSignOut = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: ScreenName.ONBOARDING }],
        });
        dispatch(resetStoreSignOut());
    };

    const onLongPressImage = (imageId) => {
        Alert.alert(
            'Xác nhận',
            'Bạn muốn xoá tấm ảnh này?',
            [
                {
                    text: 'Huỷ',
                    style: 'cancel'
                },
                { text: 'Xoá', onPress: () => removeImage(imageId) }
            ],
            { cancelable: false }
        );
    };

    const removeImage = (imageId) => {
        const headers = {
            Authorization: token
        };

        setIsShowSpinner(true);

        MediaHelpers.removeImage(
            `${Rx.USER.REMOVE_PROFILE_IMAGE}/${imageId}`,
            headers,
            (res) => {
                ToastHelpers.renderToast(
                    res?.data?.message || 'Xoá ảnh thành công!', 'success'
                );

                getListImagesByUser();
                setIsShowSpinner(false);
            },
            (err) => {
                ToastHelpers.renderToast(
                    err?.data?.message || 'Xoá ảnh thất bại! Vui lòng thử lại.', 'error'
                );
                setIsShowSpinner(false);
            },
            () => {
                ToastHelpers.renderToast('Xoá ảnh thất bại! Vui lòng thử lại.', 'error');
                setIsShowSpinner(false);
            }
        );
    };

    const handleUploadImageProfile = (uri) => {
        setIsShowSpinner(true);

        MediaHelpers.uploadImage(
            uri,
            Rx.USER.UPLOAD_PROFILE_IMAGE,
            token,
            (res) => {
                ToastHelpers.renderToast(
                    res?.data?.message || 'Tải ảnh lên thành công!', 'success'
                );
                setIsShowSpinner(false);
                getListImagesByUser();
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
        if (currentUser.url) {
            return (
                <Image
                    style={styles.avatar}
                    source={{ uri: currentUser.url }}
                />
            );
        }
        return <></>;
    };

    const renderAvatarPanel = () => {
        try {
            return (
                <Block>
                    <Block
                        row
                        center
                        style={{
                            width: NowTheme.SIZES.WIDTH_90,
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

                        {/* partner */}
                        <Block
                            flex={7}
                            row
                        >
                            <Block flex>
                                <Block
                                    middle
                                    style={{
                                        padding: 10
                                    }}
                                >
                                    <Text
                                        size={NowTheme.SIZES.FONT_INFO}
                                        color={NowTheme.COLORS.ACTIVE}
                                        style={{
                                            marginBottom: 4,
                                            fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
                                        }}
                                    >
                                        {currentUser.earningExpected}
                                    </Text>
                                    <Text
                                        style={{ fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR }}
                                        size={NowTheme.SIZES.FONT_SUB_TITLE}
                                        color={NowTheme.COLORS.DEFAULT}
                                    >
                                        Kim cương/p
                                    </Text>
                                </Block>

                                <Block
                                    middle
                                    style={{
                                        padding: 10
                                    }}
                                >
                                    <Text
                                        color={NowTheme.COLORS.ACTIVE}
                                        size={NowTheme.SIZES.FONT_INFO}
                                        style={{ marginBottom: 4, fontFamily: NowTheme.FONT.MONTSERRAT_BOLD }}
                                    >
                                        26
                                    </Text>
                                    <Text
                                        style={{ fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR }}
                                        size={NowTheme.SIZES.FONT_SUB_TITLE}
                                        color={NowTheme.COLORS.DEFAULT}
                                    >
                                        Đơn hẹn
                                    </Text>
                                </Block>
                            </Block>

                            <Block flex>
                                <Block
                                    middle
                                    style={{
                                        padding: 10
                                    }}
                                >
                                    <Text
                                        color={NowTheme.COLORS.ACTIVE}
                                        size={NowTheme.SIZES.FONT_INFO}
                                        style={{ marginBottom: 4, fontFamily: NowTheme.FONT.MONTSERRAT_BOLD }}
                                    >
                                        3k
                                    </Text>
                                    <Text
                                        style={{ fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR }}
                                        size={NowTheme.SIZES.FONT_SUB_TITLE}
                                        color={NowTheme.COLORS.DEFAULT}
                                    >
                                        Lượt thích
                                    </Text>
                                </Block>

                                <Block
                                    middle
                                    style={{
                                        padding: 10
                                    }}
                                >
                                    <Text
                                        color={NowTheme.COLORS.ACTIVE}
                                        size={NowTheme.SIZES.FONT_INFO}
                                        style={{ marginBottom: 4, fontFamily: NowTheme.FONT.MONTSERRAT_BOLD }}
                                    >
                                        4.8/5
                                    </Text>
                                    <Text
                                        style={{ fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR }}
                                        size={NowTheme.SIZES.FONT_SUB_TITLE}
                                        color={NowTheme.COLORS.DEFAULT}
                                    >
                                        Đánh giá
                                    </Text>
                                </Block>
                            </Block>
                        </Block>
                    </Block>
                    <Block>
                        {renderButtonPanel(navigation)}
                        <Block
                            middle
                        >
                            <Line
                                borderColor={NowTheme.COLORS.ACTIVE}
                                borderWidth={0.5}
                                width={NowTheme.SIZES.WIDTH_90}
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
            {/* is partner */}
            <TouchableWithoutFeedback
                onPress={() => navigation.navigate(ScreenName.BUSY_CALENDAR)}
            >
                <IconCustom
                    name="timetable"
                    family={IconFamily.MATERIAL_COMMUNITY_ICONS}
                    size={23}
                    color={NowTheme.COLORS.ACTIVE}
                />
            </TouchableWithoutFeedback>

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
                            size={NowTheme.SIZES.FONT_INFO}
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
                                width: NowTheme.SIZES.WIDTH_90
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
                                fontSize={NowTheme.SIZES.FONT_BUTTON_TITLE}
                                style={{
                                    width: NowTheme.SIZES.WIDTH_90,
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
                    width={NowTheme.SIZES.WIDTH_90}
                />
            </Block>
        </Block>
    );

    const renderButtonAddPhoto = () => (
        <TouchableWithoutFeedback
            onPress={() => onClickUploadProfileImage()}
        >
            <Block
                row
                style={{
                    alignItems: 'center',
                    paddingVertical: 5
                }}
            >

                <IconCustom
                    name="add-a-photo"
                    size={NowTheme.SIZES.FONT_BUTTON_TITLE}
                    color={NowTheme.COLORS.ACTIVE}
                    family={IconFamily.MATERIAL_ICONS}
                />
                <Text
                    color={NowTheme.COLORS.ACTIVE}
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        marginLeft: 10
                    }}
                    size={NowTheme.SIZES.FONT_BUTTON_TITLE}
                >
                    Thêm ảnh
                </Text>
            </Block>
        </TouchableWithoutFeedback>
    );

    const renderAlbumItem = (imageItem, index) => (
        <TouchableWithoutFeedback
            onPress={() => {
                setVisible(true);
                setImageIndex(index);
                setListImageReview(listImageDisplay);
            }}
            onLongPress={() => onLongPressImage(imageItem.id)}
            key={imageItem.id}
        >
            <Block style={[
                styles.shadow
            ]}
            >
                <CenterLoader size="small" />
                <Block
                    style={{
                        zIndex: 99,
                        marginRight: (index + 1) % 3 !== 0 ? marginValue : 0,
                        marginTop: index > 2 ? marginValue : 0
                    }}
                >
                    <Image
                        resizeMode="cover"
                        source={{ uri: imageItem.url }}
                        style={styles.albumThumb}
                    />
                </Block>
            </Block>
        </TouchableWithoutFeedback>
    );

    const renderAlbums = () => (
        <Block
            flex
            style={{
                paddingBottom: 20,
                width: NowTheme.SIZES.WIDTH_90,
                alignSelf: 'center'
            }}
        >
            <Block>
                {renderButtonAddPhoto()}
                <Block>
                    {listImageDisplay.length === 0 ? (
                        <Block
                            style={{
                                alignItems: 'center',
                                marginTop: 15
                            }}
                        >
                            <Text
                                color={NowTheme.COLORS.SWITCH_OFF}
                                style={{
                                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                }}
                                size={NowTheme.SIZES.FONT_INFO}
                            >
                                Bạn chưa có ảnh
                            </Text>
                        </Block>
                    ) : (
                        <Block
                            row
                            style={{
                                marginTop: 15,
                                flexWrap: 'wrap',
                            }}
                        >
                            {listImageDisplay.map(
                                (imageItem, index) => renderAlbumItem(imageItem, index)
                            )}
                        </Block>
                    )}
                </Block>
            </Block>
        </Block>
    );

    const renderButtonLogout = () => (
        <Block
            style={{
                paddingBottom: 20,
                width: NowTheme.SIZES.WIDTH_90,
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
                        size={NowTheme.SIZES.FONT_BUTTON_TITLE}
                        color={NowTheme.COLORS.SWITCH_OFF}
                        family={IconFamily.FONT_AWESOME}
                    />
                    <Text
                        color={NowTheme.COLORS.SWITCH_OFF}
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                            marginLeft: 10
                        }}
                        size={NowTheme.SIZES.FONT_BUTTON_TITLE}
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
                <Block>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {renderImageView()}

                        {renderAvatarPanel()}

                        {renderInfoPanel(currentUser, navigation)}

                        <Block>
                            <Block style={{
                                marginTop: 20
                            }}
                            >
                                {renderAlbums()}
                            </Block>
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
