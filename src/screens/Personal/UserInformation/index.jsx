/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { Albums, AvatarPanel } from '@components/businessComponents';
import {
    CenterLoader, CustomText, IconCustom, Line
} from '@components/uiComponents';
import {
    IconFamily, Rx, ScreenName, Theme, VerificationStatus
} from '@constants/index';
import { CommonHelpers, MediaHelpers, ToastHelpers } from '@helpers/index';
import { setCurrentUser } from '@redux/Actions';
import { UserServices } from '@services/index';
import React, { useEffect, useState } from 'react';
import {
    Alert, RefreshControl,
    ScrollView, Text, TouchableWithoutFeedback, View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import { useDispatch, useSelector } from 'react-redux';
import PartnerDataSection from './PartnerDataSection';
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

    const renderPartnerDataPanel = () => {
        const {
            earningExpected,
            bookingCompletedCount,
            ratingAvg
        } = currentUser;
        return (
            <View
                style={{
                    width: SIZES.WIDTH_BASE * 0.9,
                }}
            >
                <PartnerDataSection
                    listData={
                        [
                            {
                                value: earningExpected && `${CommonHelpers.generateMoneyStr(earningExpected)}/phút`,
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
                        paddingBottom: 30,
                        alignItems: 'center'
                    }}
                >
                    {renderImageView()}
                    <View
                        style={{
                            width: SIZES.WIDTH_BASE * 0.9,
                            alignSelf: 'center',
                            flexDirection: 'row',
                            marginBottom: 10
                        }}
                    >
                        <AvatarPanel
                            user={currentUser}
                            image={image}
                            onClickAvatar={() => onClickUpdateAvatar()}
                        />

                        <View style={{
                            width: SIZES.WIDTH_BASE * 0.6,
                            justifyContent: 'center',
                            marginTop: 10
                        }}
                        >
                            <TouchableOpacity
                                onPress={() => navigation.navigate(
                                    ScreenName.UPDATE_INFO_ACCOUNT,
                                )}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                                >
                                    <Text
                                        style={{
                                            color: COLORS.ACTIVE,
                                            fontSize: SIZES.FONT_H1,
                                            fontFamily: TEXT_BOLD,
                                            textAlign: 'center'
                                        }}
                                    >
                                        {`${currentUser.fullName}`}
                                    </Text>
                                    <IconCustom
                                        style={{
                                            marginTop: 10, marginLeft: 5
                                        }}
                                        name="edit-2"
                                        family={IconFamily.FEATHER}
                                        size={12}
                                        color={COLORS.DEFAULT}
                                    />
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
                                    {currentUser.description}
                                    {'"'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Line
                        borderColor={COLORS.ACTIVE}
                        borderWidth={0.5}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <SubInfoProfile user={currentUser} />

                    <View
                        style={{
                            alignItems: 'center'
                        }}
                    >
                        <CustomText
                            text={`Số dư: ${currentUser.walletAmount}`}
                            style={{
                                fontSize: SIZES.FONT_H3,
                                fontFamily: TEXT_BOLD,
                                color: COLORS.ACTIVE,
                                marginVertical: 10
                            }}
                        />
                        {renderPartnerDataPanel()}
                    </View>

                    {currentUser.verifyStatus !== VerificationStatus.ACCEPTED && (
                        <TouchableWithoutFeedback
                            onPress={() => {
                                navigation.navigate(ScreenName.VERIFICATION);
                            }}
                        >

                            <View
                                style={{
                                    marginVertical: 10,
                                    width: '90%',
                                    alignSelf: 'center',
                                    borderWidth: 0.5,
                                    borderColor: COLORS.ACTIVE,
                                    borderRadius: 20
                                }}
                            >
                                <VerificationStatusPanel />
                            </View>
                        </TouchableWithoutFeedback>
                    )}

                    <Line
                        borderColor={COLORS.ACTIVE}
                        borderWidth={0.5}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <Albums
                        user={currentUser}
                        listImageDisplay={listImageDisplay}
                        onLongPressImage={(imageItem) => onLongPressImage(imageItem)}
                        setImageIndex={(index) => setImageIndex(index)}
                        setVisible={(value) => setVisible(value)}
                        onClickUploadProfileImage={() => onClickUploadProfileImage()}
                    />
                </ScrollView>
            )}
        </>
    );
}
