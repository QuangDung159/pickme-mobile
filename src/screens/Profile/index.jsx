/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { CardImage } from '@components/businessComponents';
import { CenterLoader, CustomButton, ImageLoader } from '@components/uiComponents';
import {
    IconFamily, Images, ScreenName, Theme
} from '@constants/index';
import { CommonHelpers, ToastHelpers } from '@helpers/index';
import { BookingServices } from '@services/index';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, View
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import uuid from 'react-native-uuid';
import { useSelector } from 'react-redux';
import UserInfoSection from '../Personal/UserInformation/PartnerDataSection';

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
    const [listImageFullscreen, setListImageFullscreen] = useState();

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
            const { posts } = data.data;

            const listImage = [
                {
                    uri: data.data.url,
                    id: uuid.v4()
                }
            ];

            posts.forEach((post) => {
                listImage.push({
                    uri: post.url,
                    id: uuid.v4()
                });
            });

            setListImageFullscreen(listImage);
        }
        setIsShowSpinner(false);
    };

    const renderSubInfo = () => {
        const {
            description,
            estimatePricing,
            fullName,
            height,
            weight,
            dob,
            homeTown,
            interests,
            ratingAvg,
            bookingCount
        } = partnerInfo;

        return (
            <View style={{
                marginTop: 30,
                width: SIZES.WIDTH_BASE * 0.9,
                alignSelf: 'center',
            }}
            >
                <Text
                    style={{
                        color: COLORS.ACTIVE,
                        fontWeight: 'bold',
                        fontSize: SIZES.FONT_H1,
                        fontFamily: TEXT_BOLD,
                        marginBottom: 10,
                        textAlign: 'center'
                    }}
                >
                    {`${fullName} `}
                    {/* {'( '}
                    <IconCustom
                        name={gender === Gender.FEMALE ? 'female' : 'male'}
                        family={IconFamily.FONT_AWESOME_5}
                        size={22}
                        color={COLORS.ACTIVE}
                    />
                    {' )'} */}
                </Text>

                <View
                    style={{
                        width: SIZES.WIDTH_BASE - 40,
                        paddingBottom: 30,
                        alignSelf: 'center'
                    }}
                >
                    <Text
                        style={{
                            fontFamily: TEXT_REGULAR,
                            textAlign: 'center',
                            fontSize: SIZES.FONT_H2,
                            color: COLORS.DEFAULT,
                        }}
                    >
                        {'"'}
                        {description}
                        {'"'}
                    </Text>
                </View>

                <UserInfoSection
                    listUserInfo={
                        [
                            {
                                value: estimatePricing
                                && `${CommonHelpers.numberWithCommas((estimatePricing))}đ/phút`,
                                icon: {
                                    name: 'money',
                                    family: IconFamily.FONT_AWESOME,
                                    color: COLORS.ACTIVE,
                                    size: 22
                                }
                            },
                            {
                                value: `${bookingCount} đơn hẹn`,
                                icon: {
                                    name: 'list-alt',
                                    family: IconFamily.FONT_AWESOME,
                                    color: COLORS.ACTIVE,
                                    size: 22
                                }
                            },
                            {
                                value: `${ratingAvg}/5 đánh giá`,
                                icon: {
                                    name: 'star-o',
                                    family: IconFamily.FONT_AWESOME,
                                    color: COLORS.ACTIVE,
                                    size: 22
                                }
                            },
                            {
                                value: `${height} cm`,
                                icon: {
                                    name: 'human-male-height',
                                    family: IconFamily.MATERIAL_COMMUNITY_ICONS,
                                    color: COLORS.ACTIVE,
                                    size: 22
                                }
                            },
                            {
                                value: `${weight} kg`,
                                icon: {
                                    name: 'weight',
                                    family: IconFamily.FONT_AWESOME_5,
                                    color: COLORS.ACTIVE,
                                    size: 22
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
                                    size: 22
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

    const renderListPostImage = () => (
        <>
            {listImageFullscreen && (
                <View>
                    {listImageFullscreen.map((imageItem, index) => (
                        <View key={imageItem.id}>
                            {index === 0 ? (<></>) : (
                                <View style={{
                                    marginBottom: 5
                                }}
                                >
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            setImageIndex(index);
                                            setVisible(true);
                                        }}
                                    >
                                        <CardImage
                                            imageUrl={imageItem.uri}
                                            user={partnerInfo}
                                            isShowTitle={false}
                                            navigation={navigation}
                                        />
                                    </TouchableWithoutFeedback>
                                </View>
                            )}
                        </View>
                    ))}
                    <View style={{ height: SIZES.HEIGHT_BASE * 0.1 }} />
                </View>
            )}
        </>
    );

    // const listImage = partnerInfo.posts;
    // const listImagePreview = createListImageForImageView();

    const {
        params: {
            userId
        }
    } = route;

    try {
        return (
            <SafeAreaView
                style={{
                    flex: 1
                }}
            >
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <>
                        <View style={{
                            justifyContent: 'space-between',
                            zIndex: 1,
                            backgroundColor: COLORS.BASE
                        }}
                        >
                            <ImageView
                                images={listImageFullscreen}
                                imageIndex={imageIndex}
                                visible={visible}
                                onRequestClose={() => setVisible(false)}
                            />

                            <View>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                >
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            setVisible(true);
                                            setImageIndex(0);
                                        }}
                                    >
                                        <View
                                            style={{
                                                zIndex: 99
                                            }}
                                        >
                                            <ImageBackground
                                                source={
                                                    partnerInfo.url ? { uri: partnerInfo.url } : Images.defaultImage
                                                }
                                                style={[styles.profileContainer]}
                                                imageStyle={styles.profileBackground}
                                            />
                                        </View>
                                        <ImageLoader />
                                    </TouchableWithoutFeedback>

                                    <View style={{ marginTop: -(SIZES.HEIGHT_BASE * 0.4) }}>
                                        {renderSubInfo()}
                                        {renderListPostImage()}
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                        <View style={styles.buttonPanelContainer}>
                            <View
                                style={{
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'row'
                                }}
                            >
                                <CustomButton
                                    onPress={() => {
                                        navigation.navigate(ScreenName.MESSAGE, {
                                            name: partnerInfo.fullName,
                                            userStatus: 'Vừa mới truy cập',
                                            toUserId: userId,
                                            userInfo: partnerInfo
                                        });
                                    }}
                                    type="active"
                                    label="Nhắn tin"
                                    buttonStyle={{
                                        width: 114,
                                        height: 44,
                                        marginHorizontal: 5,
                                        elevation: 0,
                                        borderRadius: 20,
                                        backgroundColor: COLORS.BASE,
                                    }}
                                    activeOpacity={0.8}
                                    labelStyle={{
                                        fontSize: 16,
                                        color: COLORS.DEFAULT
                                    }}
                                />

                                <CustomButton
                                    onPress={() => {
                                        navigation.navigate(ScreenName.CREATE_BOOKING, {
                                            partner: partnerInfo,
                                            from: ScreenName.PROFILE
                                        });
                                    }}
                                    type="active"
                                    label="Đặt hẹn"
                                    buttonStyle={{
                                        width: 114,
                                        height: 44,
                                        marginHorizontal: 5,
                                        elevation: 0,
                                        borderRadius: 20,
                                        backgroundColor: COLORS.BASE,
                                    }}
                                    activeOpacity={0.8}
                                    labelStyle={{
                                        fontSize: 16,
                                        color: COLORS.DEFAULT
                                    }}
                                />
                            </View>
                        </View>
                    </>
                )}
            </SafeAreaView>
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

const styles = StyleSheet.create({
    profileContainer: {
        width: SIZES.WIDTH_BASE,
        height: SIZES.HEIGHT_BASE,
        padding: 0,
        zIndex: 1
    },
    profileBackground: {
        width: SIZES.WIDTH_BASE,
        height: SIZES.HEIGHT_BASE * 0.6
    },
    buttonPanelContainer: {
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        zIndex: 2,
        width: SIZES.WIDTH_BASE,
    },
});
