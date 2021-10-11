/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { Albums, AvatarPanel } from '@components/businessComponents';
import { CenterLoader, CustomButton, Line } from '@components/uiComponents';
import {
    IconFamily, ScreenName, Theme
} from '@constants/index';
import { CommonHelpers, ToastHelpers } from '@helpers/index';
import PartnerDataSection from '@screens/Personal/UserInformation/PartnerDataSection';
import SubInfoProfile from '@screens/Personal/UserInformation/SubInfoProfile';
import { BookingServices } from '@services/index';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { useSelector } from 'react-redux';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function Profile({ route, navigation }) {
    const [visible, setVisible] = useState(false);
    const [partnerInfo, setPartnerInfo] = useState({});
    const [isShowSpinner, setIsShowSpinner] = useState(true);
    const [imageIndex, setImageIndex] = useState(0);
    const [listImageReview, setListImageReview] = useState([]);
    const [listImageDisplay, setListImageDisplay] = useState([]);

    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    useEffect(
        () => {
            getPartnerInfo();
        }, []
    );

    useEffect(
        () => {
            if (isSignInOtherDeviceStore) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: ScreenName.SIGN_IN_WITH_OTP }],
                });
            }
        }, [isSignInOtherDeviceStore]
    );

    useEffect(
        () => {
            createListImageDisplay();
        }, [partnerInfo]
    );

    const getPartnerInfo = async () => {
        const {
            params: {
                userId
            }
        } = route;

        const result = await BookingServices.fetchPartnerInfoAsync(userId);
        const { data } = result;

        if (data) {
            setIsShowSpinner(false);
            setPartnerInfo(data.data);
        }
        setIsShowSpinner(false);
    };

    // const listImage = partnerInfo.posts;
    // const listImagePreview = createListImageForImageView();

    const createListImageDisplay = () => {
        const { posts } = partnerInfo;
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
                    {partnerInfo.fullName}
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
                    {partnerInfo.description}
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
                    {renderPartnerDataPanel()}
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

    const renderPartnerDataPanel = () => {
        const {
            earningExpected,
            bookingCompletedCount,
            ratingAvg
        } = partnerInfo;
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

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 50
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
                            <AvatarPanel
                                user={partnerInfo}
                                isPartner
                            />
                            <SubInfoProfile user={partnerInfo} />
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

                        {renderInfoPanel(partnerInfo, navigation)}
                        <View style={{
                            marginVertical: 10
                        }}
                        >
                            <Albums
                                user={partnerInfo}
                                listImageDisplay={listImageDisplay}
                                setImageIndex={(index) => setImageIndex(index)}
                                setVisible={(value) => setVisible(value)}
                                isPartner
                            />
                        </View>
                    </ScrollView>
                )}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: SIZES.WIDTH_BASE * 0.9,
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 10
                    }}
                >
                    <CustomButton
                        type="default"
                        label="Nhắn tin"
                    />
                    <CustomButton
                        type="active"
                        label="Đặt hẹn"
                    />
                </View>
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

Profile.propTypes = {
    route: PropTypes.object,
};

Profile.defaultProps = {
    route: {}
};
