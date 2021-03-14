import {
    Block, Button as GaButton, Text, theme
} from 'galio-framework';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground, ScrollView, StyleSheet
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import { useSelector } from 'react-redux';
import { CardImage, SubInfoProfile } from '../components/bussinessComponents';
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

    useEffect(
        () => {
            getPartnerInfo();
        }, []
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
                    <CenterLoader size="large" />
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
                                        <CenterLoader size="small" />
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
                                        <Block style={{
                                            marginTop: 30
                                        }}
                                        >
                                            <Block row center style={{ marginBottom: 30 }}>
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

                                            <Block style={styles.info}>
                                                <Block row space="around">
                                                    <Block middle>
                                                        <Text
                                                            size={NowTheme.SIZES.FONT_INFO}
                                                            color={NowTheme.COLORS.DEFAULT}
                                                            style={{
                                                                marginBottom: 4,
                                                                fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
                                                            }}
                                                        >
                                                            {partnerInfo.earningExpected}
                                                        </Text>
                                                        <Text
                                                            style={{ fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR }}
                                                            size={NowTheme.SIZES.FONT_SUB_TITLE}
                                                            color={NowTheme.COLORS.DEFAULT}
                                                        >
                                                            Kim cương
                                                        </Text>
                                                    </Block>

                                                    <Block middle>
                                                        <Text
                                                            color={NowTheme.COLORS.DEFAULT}
                                                            size={NowTheme.SIZES.FONT_INFO}
                                                            style={{
                                                                marginBottom: 4,
                                                                fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
                                                            }}
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

                                                    <Block middle>
                                                        <Text
                                                            color={NowTheme.COLORS.DEFAULT}
                                                            size={NowTheme.SIZES.FONT_INFO}
                                                            style={{
                                                                marginBottom: 4,
                                                                fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
                                                            }}
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

                                                    <Block middle>
                                                        <Text
                                                            color={NowTheme.COLORS.DEFAULT}
                                                            size={NowTheme.SIZES.FONT_INFO}
                                                            style={{
                                                                marginBottom: 4,
                                                                fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
                                                            }}
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
                                            <Block
                                                center
                                                flex
                                                style={{
                                                    width: NowTheme.SIZES.WIDTH_BASE - 40,
                                                    paddingBottom: 10,
                                                    marginVertical: 10
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                                        textAlign: 'center',
                                                    }}
                                                    size={NowTheme.SIZES.FONT_INFO}
                                                    color={NowTheme.COLORS.DEFAULT}
                                                >
                                                    {'"'}
                                                    {partnerInfo.description}
                                                    {'"'}
                                                </Text>
                                            </Block>
                                            <Block style={{
                                                paddingHorizontal: theme.SIZES.BASE,
                                            }}
                                            >
                                                <SubInfoProfile user={partnerInfo} />
                                            </Block>
                                        </Block>
                                        {listImage && (
                                            <Block>
                                                {listImage.map((imageItem, index) => (
                                                    <Block key={imageItem.url}>
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
                                    </Block>
                                </ScrollView>
                            </Block>
                        </Block>
                        <Block style={styles.buttonPanelContainer}>
                            <Block
                                middle
                                row
                            >
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
                                <GaButton
                                    round
                                    onlyIcon
                                    shadowless
                                    icon="heart"
                                    iconFamily="Font-Awesome"
                                    iconColor={NowTheme.COLORS.BASE}
                                    iconSize={NowTheme.SIZES.BASE * 1.375}
                                    color={NowTheme.COLORS.DEFAULT}
                                    style={styles.social}
                                />
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

    info: {
        paddingHorizontal: 10,
        marginBottom: 20,
        marginTop: -13
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
    title: {
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
        paddingBottom: theme.SIZES.BASE,
        marginTop: 44,
        color: NowTheme.COLORS.HEADER
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
    }
});
