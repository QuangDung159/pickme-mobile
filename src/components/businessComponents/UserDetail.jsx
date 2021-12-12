/* eslint-disable max-len */
/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { Albums, AvatarPanel } from '@components/businessComponents';
import { IconCustom, Line } from '@components/uiComponents';
import {
    IconFamily, Rx, ScreenName, Theme
} from '@constants/index';
import { CommonHelpers, MediaHelpers, ToastHelpers } from '@helpers/index';
import { setCurrentUser } from '@redux/Actions';
import { UserServices } from '@services/index';
import React, { useEffect, useState } from 'react';
import {
    Alert, RefreshControl,
    ScrollView, Text, TouchableOpacity, View
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import { useDispatch, useSelector } from 'react-redux';
import PartnerDataSection from './PartnerDataSection';
import ProfileInfoItem from './ProfileInfoItem';
import SubInfoProfile from './SubInfoProfile';
import VerificationStatusPanel from './VerificationStatusPanel';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function UserDetail({ navigation, userInfo, setIsShowSpinner }) {
    const [visible, setVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [listImageReview, setListImageReview] = useState([]);
    const [listImageDisplay, setListImageDisplay] = useState([]);
    const [image, setImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    useEffect(
        () => {
            createListImageDisplay();

            if (userInfo.id === currentUser.id) {
                setIsCurrentUser(true);
                checkIsFillDataForTheFirstTime();
            }
        }, [userInfo]
    );

    useEffect(
        () => {
            const onFocus = navigation.addListener('focus', () => {
                if (userInfo.id === currentUser.id) {
                    setIsCurrentUser(true);
                    checkIsFillDataForTheFirstTime();
                }
            });

            return onFocus;
        }, []
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
        const { posts } = userInfo;
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

                const newUserInfo = { ...userInfo, url: res.data.url, dob: userInfo?.dob?.substring(0, 3) || '1996' };
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

    const onLongPressImage = (imageObj) => {
        Alert.alert(
            'Ảnh của bạn',
            '',
            [
                {
                    text: 'Đóng',
                    style: 'cancel'
                },
                { text: 'Đặt làm ảnh chính', onPress: () => setImageToPrimary(imageObj.uri) },
                { text: 'Xoá ảnh', onPress: () => removeImage(imageObj) },
            ],
            { cancelable: true }
        );
    };

    const checkIsFillDataForTheFirstTime = () => {
        if (!currentUser.id) return;
        if (!currentUser.isFillDataFirstTime) {
            Alert.alert('Thông tin cá nhân',
                'Tài khoản của bạn chưa được cập nhật thông tin cá nhân.\nVui lòng cập nhật để có được trải nghiệm tốt nhất với 2SeeYou.',
                [
                    {
                        text: 'Đóng',
                        style: 'cancel'
                    },
                    {
                        text: 'Cập nhật',
                        onPress: () => {
                            navigation.navigate(ScreenName.UPDATE_INFO_ACCOUNT);
                        },
                        style: 'cancel'
                    }
                ],);
        }
    };

    const setImageToPrimary = async (imageUri) => {
        setIsShowSpinner(true);
        const newUser = { ...userInfo };
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
        if (imageObj.uri === userInfo.imageUrl) {
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
                    title: `${userInfo.fullName}`,
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

    const renderPartnerDataPanel = () => {
        const {
            earningExpected,
            bookingCompletedCount,
            ratingAvg
        } = userInfo;

        return (
            <View
                style={{
                    width: SIZES.WIDTH_BASE * 0.9,
                    marginTop: 10,
                }}
            >
                <PartnerDataSection
                    listData={
                        [
                            {
                                value: earningExpected && `${CommonHelpers.formatCurrency(earningExpected)}/phút`,
                            },
                            {
                                value: `${bookingCompletedCount} đơn hẹn`,
                            },
                            {
                                value: `${ratingAvg}/5 đánh giá`,
                            },
                        ]
                    }
                />
            </View>
        );
    };

    const handleShowPartnerDataPanel = () => {
        if (isCurrentUser) {
            if (currentUser.isPartnerVerified) {
                return (
                    <>
                        {renderPartnerDataPanel()}
                    </>
                );
            }
        }
        if (userInfo.isPartnerVerified) {
            return (
                <>
                    {renderPartnerDataPanel()}
                </>
            );
        }
        return <></>;
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={(
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                        if (isCurrentUser) {
                            onRefresh();
                        }
                    }}
                    tintColor={COLORS.ACTIVE}
                />
            )}
            contentContainerStyle={{
                paddingBottom: isCurrentUser ? 30 : 60,
                alignItems: 'center'
            }}
        >
            {renderImageView()}
            <View
                style={{
                    width: SIZES.WIDTH_BASE * 0.9,
                    flexDirection: 'row',
                    marginBottom: 10
                }}
            >
                <AvatarPanel
                    user={userInfo}
                    image={image}
                    onClickAvatar={() => {
                        if (isCurrentUser) {
                            onClickUpdateAvatar();
                        }
                    }}
                    isCurrentUser={isCurrentUser}
                />

                <View style={{
                    width: SIZES.WIDTH_BASE * 0.6,
                    justifyContent: 'center',
                    marginTop: 10
                }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            if (isCurrentUser) {
                                navigation.navigate(
                                    ScreenName.UPDATE_INFO_ACCOUNT
                                );
                            }
                        }}
                    >
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            width: 230
                        }}
                        >
                            <Text
                                style={{
                                    color: COLORS.ACTIVE,
                                    fontSize: SIZES.FONT_H1,
                                    fontFamily: TEXT_BOLD,
                                    textAlign: 'center',
                                }}
                            >
                                {`${userInfo.fullName || 'N/a'}`}
                            </Text>
                            {isCurrentUser && (
                                <IconCustom
                                    style={{
                                        marginTop: 10, marginLeft: 5
                                    }}
                                    name="edit-2"
                                    family={IconFamily.FEATHER}
                                    size={12}
                                    color={COLORS.DEFAULT}
                                />
                            )}
                        </View>
                    </TouchableOpacity>

                    <View>
                        <Text
                            style={{
                                fontFamily: TEXT_REGULAR,
                                fontSize: SIZES.FONT_H3,
                                color: COLORS.DEFAULT,
                                textAlign: 'center'
                            }}
                        >
                            {'"'}
                            {userInfo.description || 'N/a'}
                            {'"'}
                        </Text>
                    </View>
                </View>
            </View>

            <Line
                borderColor={COLORS.ACTIVE}
                width={SIZES.WIDTH_BASE * 0.9}
            />

            <SubInfoProfile user={userInfo} />

            <View
                style={{
                    width: '90%'
                }}
            >
                {isCurrentUser && (
                    <ProfileInfoItem
                        fontSize={SIZES.FONT_H3}
                        iconName="treasure-chest"
                        iconFamily={IconFamily.MATERIAL_COMMUNITY_ICONS}
                        content={`Số dư: ${CommonHelpers.formatCurrency(userInfo.walletAmount)}`}
                        iconSize={18}
                        contentTextStyle={{
                            fontFamily: TEXT_BOLD,
                            color: COLORS.ACTIVE
                        }}
                    />
                )}

                {handleShowPartnerDataPanel()}
            </View>

            {isCurrentUser && (
                <>
                    {!userInfo?.isCustomerVerified && (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate(ScreenName.VERIFICATION);
                            }}
                        >
                            <View
                                style={{
                                    marginVertical: 10,
                                    width: SIZES.WIDTH_BASE * 0.9,
                                    alignSelf: 'center',
                                    borderWidth: 0.5,
                                    borderColor: COLORS.ACTIVE,
                                    borderRadius: 20
                                }}
                            >
                                <VerificationStatusPanel />
                            </View>
                        </TouchableOpacity>
                    )}
                </>
            )}

            <Line
                borderColor={COLORS.ACTIVE}
                width={SIZES.WIDTH_BASE * 0.9}
            />

            <Albums
                isCurrentUser={isCurrentUser}
                user={userInfo}
                listImageDisplay={listImageDisplay}
                onLongPressImage={(imageItem) => {
                    if (isCurrentUser) {
                        onLongPressImage(imageItem);
                    }
                }}
                setImageIndex={(index) => setImageIndex(index)}
                setVisible={(value) => setVisible(value)}
                onClickUploadProfileImage={() => {
                    if (isCurrentUser) {
                        onClickUploadProfileImage();
                    }
                }}
            />
        </ScrollView>
    );
}
