import { CenterLoader, CustomButton } from '@components/uiComponents';
import IconFamily from '@constants/IconFamily';
import Theme from '@constants/Theme';
import React from 'react';
import {
    Image, StyleSheet, Text, TouchableWithoutFeedback, View
} from 'react-native';
import uuid from 'react-native-uuid';

const {
    SIZES, COLORS, FONT: {
        TEXT_REGULAR
    }
} = Theme;

const thumbMeasure = (SIZES.WIDTH_BASE * 0.85) / 3;
const marginValue = ((SIZES.WIDTH_BASE * 0.9) - thumbMeasure * 3) / 2;

export default function Albums({
    user, isPartner = false,
    listImageDisplay,
    onLongPressImage = null, setImageIndex, setVisible,
    onClickUploadProfileImage = null
}) {
    // render
    const renderAlbumItem = (imageItem, index, key) => {
        const isPrimary = imageItem.uri === user.imageUrl;
        return (
            <View
                key={key}
            >
                <TouchableWithoutFeedback
                    onPress={() => {
                        setVisible(true);
                        setImageIndex(index);
                    }}
                    onLongPress={() => !isPartner && onLongPressImage && onLongPressImage(imageItem)}
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

    const renderButtonAddPhoto = () => (
        <CustomButton
            onPress={() => onClickUploadProfileImage && onClickUploadProfileImage()}
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

    const renderAlbums = () => (
        <View
            style={{
                width: SIZES.WIDTH_BASE * 0.9,
                alignSelf: 'center',
                flex: 1
            }}
        >
            {!isPartner && renderButtonAddPhoto()}
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
                            {`${isPartner ? 'Không có gì để hiển thị' : 'Bạn chưa có ảnh'}`}
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

    try {
        return (
            <>
                {renderAlbums()}
            </>
        );
    } catch (error) {
        console.log('error :>> ', error);
    }
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
});
