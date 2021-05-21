import {
    Block, Button as GaButton, Text
} from 'galio-framework';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground, ScrollView, StyleSheet
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import { useSelector } from 'react-redux';
import { CardImage } from '../components/businessComponents';
import ProfileInfoRow from '../components/businessComponents/ProfileInfoRow';
import { Button, CenterLoader } from '../components/uiComponents';
import { NowTheme, Rx, ScreenName } from '../constants';
import { ToastHelpers } from '../helpers';
import { rxUtil } from '../utils';

export default function Profile({ route, navigation }) {
    const [visible, setVisible] = useState(false);
    const [partnerInfo, setPartnerInfo] = useState({});
    const [isShowSpinner, setIsShowSpinner] = useState(true);
    const [imageIndex, setImageIndex] = useState(0);

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
                setPartnerInfo(res.data.data);
            },
            () => {
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            }
        );
    };

    const createListImageForImageView = () => {
        const { images } = partnerInfo;

        const listImagePreview = [];

        if (images) {
            images.forEach((image) => {
                const item = { ...image };
                item.uri = image.url;
                listImagePreview.push(item);
            });
        }
        return listImagePreview;
    };

    const renderSubInfo = () => (
        <Block style={{
            marginTop: 30
        }}
        >
            <Block row center style={{ marginBottom: 20 }}>
                <Text
                    style={{
                        color: NowTheme.COLORS.ACTIVE,
                        fontWeight: 'bold',
                        fontSize: 25,
                        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                    }}
                >
                    {partnerInfo.fullName}
                    {' '}
                </Text>
            </Block>

            <Block
                center
                style={{
                    width: NowTheme.SIZES.WIDTH_BASE - 40,
                    paddingBottom: 40,
                }}
            >
                <Text
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        textAlign: 'center',
                    }}
                    size={NowTheme.SIZES.FONT_H2}
                    color={NowTheme.COLORS.DEFAULT}
                >
                    {'"'}
                    {partnerInfo.description}
                    {'"'}
                </Text>
            </Block>

            <ProfileInfoRow
                listProfileInfo={
                    [
                        {
                            value: partnerInfo.earningExpected,
                            label: 'Kim cương/p'
                        },
                        {
                            value: 26,
                            label: 'Đơn hẹn'
                        },
                        {
                            value: '4.8/5',
                            label: 'Đánh giá'
                        },
                    ]
                }
            />

            <ProfileInfoRow
                listProfileInfo={
                    [
                        {
                            value: `${partnerInfo.height} cm`,
                            label: 'Chiều cao'
                        },
                        {
                            value: `${partnerInfo.weight} kg`,
                            label: 'Cân nặng'
                        },
                        {
                            value: moment(partnerInfo.dob).format('YYYY').toString(),
                            label: 'Năm sinh'
                        },
                    ]
                }
                style={{
                    marginTop: 5
                }}
            />

            <ProfileInfoRow
                listProfileInfo={
                    [
                        {
                            value: partnerInfo.interests || 'N/a',
                            label: 'Sở thích'
                        },
                        {
                            value: partnerInfo.homeTown || 'N/a',
                            label: 'Quê quán'
                        },
                        {
                            value: '',
                            label: ''
                        },
                    ]
                }
                style={{
                    marginTop: 5
                }}
            />
        </Block>
    );

    const renderListPostImage = () => (
        <>
            {listImage && (
                <Block>
                    {listImage.map((imageItem, index) => (
                        <Block key={`${imageItem.url}`}>
                            {index === 0 ? (<></>) : (
                                <Block style={{
                                    marginVertical: 20
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
                                            imageUrl={imageItem.url}
                                            user={partnerInfo}
                                            isShowTitle={false}
                                            navigation={navigation}
                                        />
                                    </TouchableWithoutFeedback>
                                </Block>
                            )}
                        </Block>
                    ))}
                    <Block style={{ height: NowTheme.SIZES.HEIGHT_BASE * 0.13 }} />
                </Block>
            )}
        </>
    );

    const listImage = partnerInfo.images;
    const listImagePreview = createListImageForImageView();

    const {
        params: {
            userId
        }
    } = route;

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <>
                        <Block style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            zIndex: 1,
                            backgroundColor: NowTheme.COLORS.BASE
                        }}
                        >
                            <ImageView
                                images={listImagePreview}
                                imageIndex={imageIndex}
                                visible={visible}
                                onRequestClose={() => setVisible(false)}
                            />

                            <Block flex={1}>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                >
                                    <Block>
                                        <CenterLoader />
                                        <Block
                                            style={{
                                                zIndex: 99
                                            }}
                                        >
                                            <TouchableWithoutFeedback
                                                onPress={() => {
                                                    setVisible(true);
                                                    setImageIndex(0);
                                                }}
                                            >
                                                {listImage && (
                                                    <ImageBackground
                                                        source={{
                                                            uri: listImage.length !== 0
                                                                ? listImage[0].url
                                                                : 'google.com'
                                                        }}
                                                        style={[styles.profileContainer]}
                                                        imageStyle={styles.profileBackground}
                                                    />
                                                )}
                                            </TouchableWithoutFeedback>
                                        </Block>
                                    </Block>

                                    <Block style={{ marginTop: -(NowTheme.SIZES.HEIGHT_BASE * 0.4) }}>
                                        {renderSubInfo()}
                                        {renderListPostImage()}
                                    </Block>
                                </ScrollView>
                            </Block>
                        </Block>
                        <Block style={styles.buttonPanelContainer}>
                            <Block
                                middle
                                row
                            >
                                <GaButton
                                    round
                                    onlyIcon
                                    shadowless
                                    icon="comment"
                                    iconFamily="Font-Awesome"
                                    iconColor={NowTheme.COLORS.BASE}
                                    iconSize={NowTheme.SIZES.BASE * 1.375}
                                    color={NowTheme.COLORS.DEFAULT}
                                    style={styles.social}
                                    onPress={() => {
                                        navigation.navigate(ScreenName.MESSAGE, {
                                            name: partnerInfo.fullName,
                                            userStatus: 'Vừa mới truy cập',
                                            toUserId: userId,
                                            userInfo: partnerInfo
                                        });
                                    }}
                                />

                                <Button
                                    style={{
                                        width: 114,
                                        height: 44,
                                        marginHorizontal: 5,
                                        elevation: 0
                                    }}
                                    textStyle={{ fontSize: 16 }}
                                    round
                                    color={NowTheme.COLORS.ACTIVE}
                                    onPress={() => {
                                        navigation.navigate(ScreenName.CREATE_BOOKING, {
                                            partner: partnerInfo,
                                            from: ScreenName.PROFILE
                                        });
                                    }}
                                >
                                    Đặt hẹn
                                </Button>
                            </Block>
                        </Block>
                    </>
                )}
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

const styles = StyleSheet.create({
    profileContainer: {
        width: NowTheme.SIZES.WIDTH_BASE,
        height: NowTheme.SIZES.HEIGHT_BASE,
        padding: 0,
        zIndex: 1
    },
    profileBackground: {
        width: NowTheme.SIZES.WIDTH_BASE,
        height: NowTheme.SIZES.HEIGHT_BASE * 0.6
    },
    nameInfo: {
        marginTop: 35
    },
    social: {
        width: NowTheme.SIZES.BASE * 3,
        height: NowTheme.SIZES.BASE * 3,
        borderRadius: NowTheme.SIZES.BASE * 1.5,
        justifyContent: 'center',
        zIndex: 99,
        marginHorizontal: 5
    },
    buttonPanelContainer: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: NowTheme.SIZES.HEIGHT_BASE * 0.8,
        left: 0,
        right: 0,
        height: 80,
        zIndex: 2,
        width: NowTheme.SIZES.WIDTH_BASE,
    },
});
