/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import {
    CenterLoader, CustomButton, Line
} from '@components/uiComponents';
import {
    IconFamily, Images, Rx, ScreenName, Theme, VerificationStatus
} from '@constants/index';
import { CommonHelpers, MediaHelpers, ToastHelpers } from '@helpers/index';
import { resetStoreSignOut, setCurrentUser } from '@redux/Actions';
import { UserServices } from '@services/index';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text, TouchableWithoutFeedback, View
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import uuid from 'react-native-uuid';
import { useDispatch, useSelector } from 'react-redux';
import ProfileInfoItem from './ProfileInfoItem';
import SubInfoProfile from './SubInfoProfile';
import UserInfoSection from './UserInfoSection';
import VerificationStatusPanel from './VerificationStatusPanel';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

const thumbMeasure = (SIZES.WIDTH_BASE * 0.85) / 3;
const marginValue = ((SIZES.WIDTH_BASE * 0.9) - thumbMeasure * 3) / 2;

export default function UserInformation({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [visible, setVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [listImageReview, setListImageReview] = useState([]);
    const [listImageDisplay, setListImageDisplay] = useState([]);
    const [image, setImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    useEffect(
        () => {
            createListImageDisplay();
        }, [currentUser]
    );

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const fetchCurrentUserInfo = async () => {
        const result = await UserServices.fetchCurrentUserInfoAsync();
        const { data } = result;

        if (data) {
            const currentUserInfo = await UserServices.mappingCurrentUserInfo(data.data);
            dispatch(setCurrentUser(currentUserInfo));
        }
        setIsShowSpinner(false);
        setRefreshing(false);
    };

    const createListImageDisplay = () => {
        const { posts } = currentUser;
        const listImage = [];

        if (!posts || posts.length === 0) return;

        posts.forEach((post) => {
            listImage.push({
                uri: post.url,
                id: post.id
            });
        });

        setListImageDisplay(listImage);
        setListImageReview(listImage);
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchCurrentUserInfo();
    };

    const handleOnPickAvatar = (uri) => {
        setIsShowSpinner(true);

        MediaHelpers.imgbbUploadImage(
            uri,
            (res) => {
                setIsShowSpinner(false);
                setImage(uri);

                const newUserInfo = { ...currentUser, url: res.data.url };
                dispatch(
                    setCurrentUser(newUserInfo)
                );
                onSubmitUpdateInfo(newUserInfo);
            },
            () => {
                ToastHelpers.renderToast();
                setIsShowSpinner(false);
            }
        );
    };

    const onSubmitUpdateInfo = async (body) => {
        setIsShowSpinner(true);

        const result = await UserServices.submitUpdateInfoAsync(body);
        const { data } = result;

        if (data) {
            ToastHelpers.renderToast(data.message, 'success');
        }
        setIsShowSpinner(false);
    };

    const onClickUpdateAvatar = () => {
        MediaHelpers.pickImage(true, [1, 1], (result) => handleOnPickAvatar(result.uri));
    };

    const onClickUploadProfileImage = () => {
        MediaHelpers.pickImage(false, [1, 1], (result) => handleUploadImageProfile(result.uri));
    };

    const onSignOut = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: ScreenName.ONBOARDING }],
        });
        dispatch(resetStoreSignOut());
        SecureStore.deleteItemAsync('api_token')
            .then(console.log('api_token was cleaned!'));
    };

    const onLongPressImage = (imageObj) => {
        Alert.alert(
            'Ảnh của bạn',
            '',
            [
                {
                    text: 'Huỷ',
                    style: 'cancel'
                },
                { text: 'Đặt làm ảnh chính', onPress: () => setImageToPrimary(imageObj.uri) },
                { text: 'Xoá ảnh', onPress: () => removeImage(imageObj) },
            ],
            { cancelable: false }
        );
    };

    const setImageToPrimary = async (imageUri) => {
        setIsShowSpinner(true);
        const newUser = { ...currentUser };
        newUser.imageUrl = imageUri;

        const result = await UserServices.submitUpdateInfoAsync(newUser);
        const { data } = result;

        if (data) {
            ToastHelpers.renderToast(data.message, 'success');
            fetchCurrentUserInfo();
        }
        setIsShowSpinner(false);
    };

    const removeImage = (imageObj) => {
        if (imageObj.uri === currentUser.imageUrl) {
            ToastHelpers.renderToast('Không thể xoá ảnh chính');
        } else {
            setIsShowSpinner(true);
            MediaHelpers.removeImage(
                `${Rx.USER.REMOVE_USER_IMAGE}/${imageObj.id}`,
                (res) => {
                    ToastHelpers.renderToast(
                        res?.data?.message || 'Xoá ảnh thành công!', 'success'
                    );

                    fetchCurrentUserInfo();
                },
                (err) => {
                    ToastHelpers.renderToast(
                        err?.data?.message || 'Xoá ảnh thất bại! Vui lòng thử lại.', 'error'
                    );
                    setIsShowSpinner(false);
                },
            );
        }
    };

    const handleUploadImageProfile = async (uri) => {
        setIsShowSpinner(true);
        MediaHelpers.imgbbUploadImage(
            uri,
            async (res) => {
                setIsShowSpinner(false);
                setImage(uri);

                const body = {
                    title: `${currentUser.fullName}`,
                    url: res.data.url
                };

                const result = await UserServices.addUserPostImageAsync(body);
                const { data } = result;

                if (data) {
                    fetchCurrentUserInfo();
                }
                setIsShowSpinner(false);
            },
            () => {
                ToastHelpers.renderToast();
                setIsShowSpinner(false);
            }
        );
    };

    // Render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderImageView = () => {
        const listImageObj = [];

        listImageReview.forEach((item) => {
            listImageObj.push({
                uri: item.uri
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
                source={currentUser.url ? { uri: currentUser.url } : Images.defaultImage}
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
                    fontSize: SIZES.FONT_H4,
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
            earningExpected,
            walletAmountDisplay,
            bookingCompletedCount,
            ratingAvg
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
                                value: walletAmountDisplay && `${walletAmountDisplay}`,
                                icon: {
                                    name: 'treasure-chest',
                                    family: IconFamily.MATERIAL_COMMUNITY_ICONS,
                                    color: COLORS.ACTIVE,
                                    size: 26
                                }
                            },
                            {
                                value: earningExpected && `${CommonHelpers.generateMoneyStr(earningExpected)}/phút`,
                                icon: {
                                    name: 'money',
                                    family: IconFamily.FONT_AWESOME,
                                    color: COLORS.ACTIVE,
                                    size: 24
                                }
                            },
                            {
                                value: `${bookingCompletedCount} đơn hẹn`,
                                icon: {
                                    name: 'list-alt',
                                    family: IconFamily.FONT_AWESOME,
                                    color: COLORS.ACTIVE,
                                    size: 24
                                }
                            },
                            {
                                value: `${ratingAvg}/5 đánh giá`,
                                icon: {
                                    name: 'star-o',
                                    family: IconFamily.FONT_AWESOME,
                                    color: COLORS.ACTIVE,
                                    size: 28
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
                    marginTop: 20,
                }}
            >
                <Text
                    style={{
                        color: COLORS.ACTIVE,
                        fontSize: 25,
                        fontFamily: TEXT_BOLD,
                        textAlign: 'center'
                    }}
                >
                    {currentUser.fullName}
                </Text>
            </View>

            <View
                style={{
                    marginBottom: 20
                }}
            >
                <Text
                    style={{
                        fontFamily: TEXT_REGULAR,
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
            <View style={{
                marginBottom: 10,
                alignItems: 'center'
            }}
            >
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.9
                    }}
                >
                    <SubInfoProfile user={currentUser} />
                    <ProfileInfoItem
                        fontSize={SIZES.FONT_H2}
                        iconName="badminton"
                        iconFamily={IconFamily.MATERIAL_COMMUNITY_ICONS}
                        content={`${currentUser.interests}`}
                    />
                </View>
                <View
                    style={{
                        marginVertical: 20
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
        </>
    );

    const renderButtonAddPhoto = () => (
        <CustomButton
            onPress={() => onClickUploadProfileImage()}
            labelStyle={{
                fontSize: SIZES.FONT_H3,
                color: COLORS.ACTIVE
            }}
            label="Thêm ảnh"
            leftIcon={{
                name: 'add-a-photo',
                size: SIZES.FONT_H3,
                color: COLORS.ACTIVE,
                family: IconFamily.MATERIAL_ICONS
            }}
        />
    );

    const renderAlbumItem = (imageItem, index, key) => {
        const isPrimary = imageItem.uri === currentUser.imageUrl;
        return (
            <View
                key={key}
            >
                <TouchableWithoutFeedback
                    onPress={() => {
                        setVisible(true);
                        setImageIndex(index);
                    }}
                    onLongPress={() => onLongPressImage(imageItem)}
                >
                    <View style={isPrimary && styles.shadow}>
                        <CenterLoader />
                        <View
                            style={{
                                zIndex: 99,
                                marginRight: (index + 1) % 3 === 0 ? 0 : marginValue,
                                marginTop: index > 2 ? marginValue : 0
                            }}
                        >
                            <Image
                                resizeMode="cover"
                                source={{ uri: imageItem.uri }}
                                style={[
                                    styles.albumThumb,
                                    isPrimary && {
                                        borderWidth: 1,
                                        borderColor: COLORS.ACTIVE
                                    }]}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };

    const renderAlbums = () => (
        <View
            style={{
                width: SIZES.WIDTH_BASE * 0.9,
                alignSelf: 'center',
                flex: 1
            }}
        >
            {renderButtonAddPhoto()}
            <>
                {listImageDisplay.length === 0 ? (
                    <View
                        style={{
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: TEXT_REGULAR,
                                fontSize: SIZES.FONT_H2,
                                color: COLORS.DEFAULT
                            }}
                        >
                            Bạn chưa có ảnh
                        </Text>
                    </View>
                ) : (
                    <View
                        style={{
                            flexWrap: 'wrap',
                            flexDirection: 'row'
                        }}
                    >
                        {listImageDisplay.map(
                            (imageItem, index) => renderAlbumItem(
                                imageItem, index, uuid.v4()
                            )
                        )}
                    </View>
                )}
            </>
        </View>
    );

    const renderButtonLogout = () => (
        <CustomButton
            onPress={() => onSignOut()}
            labelStyle={{
                fontSize: SIZES.FONT_H3,
            }}
            label="Đăng xuất"
            leftIcon={{
                name: 'logout',
                size: SIZES.FONT_H3,
                color: COLORS.DEFAULT,
                family: IconFamily.SIMPLE_LINE_ICONS
            }}
        />
    );

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
                    contentContainerStyle={{
                        paddingBottom: 30
                    }}
                >
                    {renderImageView()}
                    <View
                        style={{
                            width: SIZES.WIDTH_BASE * 0.9,
                            alignSelf: 'center',
                            flexDirection: 'row'
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

                    {currentUser.verifyStatus !== VerificationStatus.ACCEPTED && (
                        <TouchableWithoutFeedback
                            onPress={() => {
                                navigation.navigate(ScreenName.VERIFICATION);
                            }}
                        >

                            <View
                                style={{
                                    marginTop: 30,
                                    width: '90%',
                                    alignSelf: 'center',
                                    borderWidth: 0.5,
                                    borderColor: COLORS.ACTIVE,
                                    borderRadius: 7
                                }}
                            >
                                <VerificationStatusPanel />
                            </View>
                        </TouchableWithoutFeedback>
                    )}

                    {renderInfoPanel(currentUser, navigation)}
                    <View style={{
                        marginVertical: 10
                    }}
                    >
                        {renderAlbums()}
                    </View>
                    {renderButtonLogout(navigation)}
                </ScrollView>
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
        borderRadius: 7,
        alignSelf: 'center',
        width: thumbMeasure,
        height: thumbMeasure
    },
    avatar: {
        borderRadius: 100,
        width: SIZES.WIDTH_BASE * 0.25,
        height: SIZES.WIDTH_BASE * 0.25,
    },
    updateAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: SIZES.WIDTH_BASE * 0.15,
        zIndex: 99,
    }
});
