import { Block } from 'galio-framework';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
    Image,
    StyleSheet, Text, TouchableWithoutFeedback
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import ImageScalable from 'react-native-scalable-image';
import { useSelector } from 'react-redux';
import { NowTheme, ScreenName } from '../../constants';
import { CenterLoader } from '../uiComponents';

const {
    FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = NowTheme;

export default function CardImage({
    navigation, user, isShowTitle, imageUrl,
}) {
    const [visible, setVisible] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const handleOnClickCard = () => {
        navigation.navigate(ScreenName.PROFILE, { userId: user.id });
    };

    const images = [{ uri: imageUrl }];

    return (
        <Block style={{
            backgroundColor: COLORS.BASE,
            borderWidth: 0,
        }}
        >
            <ImageView
                images={images}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setVisible(false)}
            />
            {isShowTitle && user !== {} ? (
                <Block
                    row
                    style={{
                        alignItems: 'center',
                        marginHorizontal: 10
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => handleOnClickCard(user, currentUser, navigation)}
                    >
                        <Block
                            style={{
                                marginRight: 10
                            }}
                        >
                            <Image
                                source={{ uri: user.url }}
                                style={{
                                    width: 45,
                                    height: 45,
                                    borderRadius: 25
                                }}
                            />
                        </Block>
                    </TouchableWithoutFeedback>

                    <Block style={{
                        justifyContent: 'center',
                        paddingVertical: 10
                    }}
                    >
                        <Block
                            row
                            style={{
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: SIZES.WIDTH_BASE * 0.8
                            }}
                        >
                            <TouchableWithoutFeedback
                                onPress={() => handleOnClickCard(user, currentUser, navigation)}
                            >
                                <Text
                                    style={{
                                        fontSize: SIZES.FONT_H2,
                                        fontFamily: MONTSERRAT_BOLD,
                                        color: COLORS.ACTIVE,
                                    }}
                                >
                                    {user.fullName}
                                </Text>
                            </TouchableWithoutFeedback>
                        </Block>
                        <Block>
                            <Text
                                style={styles.subInfoCard}
                                size={SIZES.FONT_H4}
                                color={COLORS.DEFAULT}
                            >
                                TP.Hồ Chí Minh
                            </Text>
                        </Block>
                    </Block>
                </Block>
            ) : (<Block />)}

            <Block flex style={styles.imageContainer}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        setVisible(true);
                    }}
                >
                    <ImageScalable
                        style={{
                            zIndex: 99
                        }}
                        width={SIZES.WIDTH_BASE}
                        source={{ uri: imageUrl }}
                    />
                </TouchableWithoutFeedback>
                <CenterLoader />
            </Block>
        </Block>
    );
}

CardImage.propTypes = {
    user: PropTypes.object.isRequired,
    isShowTitle: PropTypes.bool.isRequired,
    imageUrl: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
    imageContainer: {
        elevation: 1,
        overflow: 'hidden',
    },
    subInfoCard: {
        fontFamily: MONTSERRAT_REGULAR,
    },
});
