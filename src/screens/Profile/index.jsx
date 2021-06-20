/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { CardImage } from '@components/businessComponents';
import { CenterLoader, CustomButton } from '@components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '@constants';
import { NO_AVATAR_URL } from '@env';
import { CommonHelpers, ToastHelpers } from '@helpers';
import { rxUtil } from '@utils';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, View
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import { useSelector } from 'react-redux';
import UserInfoSection from '../Personal/UserInformation/UserInfoSection';

const {
    FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = NowTheme;

export default function Profile({ route, navigation }) {
    const [visible, setVisible] = useState(false);
    const [partnerInfo, setPartnerInfo] = useState({});
    const [isShowSpinner, setIsShowSpinner] = useState(true);
    const [imageIndex, setImageIndex] = useState(0);
    const [listImageFullscreen, setListImageFullscreen] = useState([]);

    const token = useSelector((state) => state.userReducer.token);
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

    const getPartnerInfo = () => {
        const {
            params: {
                userId
            }
        } = route;

        rxUtil(
            `${Rx.PARTNER.PARTNER_DETAIL}/${userId}`,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setIsShowSpinner(false);
                const {
                    data, data: {
                        posts
                    }
                } = res.data;
                setPartnerInfo(data);

                const listImage = [
                    {
                        uri: data.url,
                    }
                ];

                posts.forEach((post) => {
                    listImage.push({
                        uri: post.url
                    });
                });

                setListImageFullscreen(listImage);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
            }
        );
    };

    const renderSubInfo = () => {
        const {
            description,
            earningExpected,
            fullName,
            height,
            weight,
            dob,
            homeTown,
            interests
        } = partnerInfo;

        return (
            <View style={{
                marginTop: 30,
                width: SIZES.WIDTH_BASE * 0.9,
                alignSelf: 'center',
                alignItems: 'center'
            }}
            >
                <Text
                    style={{
                        color: COLORS.ACTIVE,
                        fontWeight: 'bold',
                        fontSize: SIZES.FONT_H1,
                        fontFamily: MONTSERRAT_BOLD,
                        marginBottom: 5
                    }}
                >
                    {fullName}
                    {' '}
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
                            fontFamily: MONTSERRAT_REGULAR,
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
                                value: earningExpected
                                && `${CommonHelpers.generateMoneyStr((earningExpected * 60))}/giờ`,
                                icon: {
                                    name: 'money',
                                    family: IconFamily.FONT_AWESOME,
                                    color: COLORS.ACTIVE,
                                    size: 22
                                }
                            },
                            {
                                value: '26 đơn hẹn',
                                icon: {
                                    name: 'list-alt',
                                    family: IconFamily.FONT_AWESOME,
                                    color: COLORS.ACTIVE,
                                    size: 22
                                }
                            },
                            {
                                value: '4.8/5 đánh giá',
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
                        <View key={`${imageItem.uri}`}>
                            {index === 0 ? (<></>) : (
                                <View style={{
                                    marginVertical: 10
                                }}
                                >
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            setImageIndex(index);
                                            setVisible(true);
                                        }}
                                    >
                                        <CardImage
                                            key={imageItem.imageId}
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
                    <View style={{ height: SIZES.HEIGHT_BASE * 0.13 }} />
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
                                                source={{
                                                    uri: partnerInfo.url || NO_AVATAR_URL
                                                }}
                                                style={[styles.profileContainer]}
                                                imageStyle={styles.profileBackground}
                                            />
                                        </View>
                                        <CenterLoader />
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
                                        backgroundColor: COLORS.ACTIVE
                                    }}
                                    labelStyle={{
                                        fontSize: 16,
                                        color: COLORS.BASE
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
                                        backgroundColor: COLORS.ACTIVE
                                    }}
                                    labelStyle={{
                                        fontSize: 16,
                                        color: COLORS.BASE
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
        top: SIZES.HEIGHT_BASE * 0.83,
        left: 0,
        right: 0,
        height: 80,
        zIndex: 2,
        width: SIZES.WIDTH_BASE,
    },
});
