import { CenterLoader, CustomButton } from '@components/uiComponents';
import IconFamily from '@constants/IconFamily';
import Theme from '@constants/Theme';
import React from 'react';
import {
    Image, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import uuid from 'react-native-uuid';

const {
    SIZES, COLORS, FONT: {
        TEXT_REGULAR
    }
} = Theme;

const thumbMeasure = (SIZES.WIDTH_90) / 3;
const marginValue = ((SIZES.WIDTH_MAIN) - thumbMeasure * 3) / 2;

export default function Albums({
    user,
    listImageDisplay,
    onLongPressImage = null, setImageIndex, setVisible,
    onClickUploadProfileImage = null,
    isCurrentUser
}) {
    // render
    const renderAlbumItem = (imageItem, index, key) => {
        const isPrimary = imageItem.uri === user.imageUrl;
        return (
            <View
                key={key}
            >
                <TouchableOpacity
                    onPress={() => {
                        setVisible(true);
                        setImageIndex(index);
                    }}
                    onLongPress={() => isCurrentUser && onLongPressImage && onLongPressImage(imageItem)}
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
                </TouchableOpacity>
            </View>
        );
    };

    const renderButtonAddPhoto = () => (
        <CustomButton
            onPress={() => onClickUploadProfileImage && onClickUploadProfileImage()}
            labelStyle={{
                fontSize: SIZES.FONT_H3,
                color: COLORS.ACTIVE,
                marginLeft: 5
            }}
            label="Thêm ảnh"
            buttonStyle={{
                width: 110,
                alignItems: 'flex-start',
                alignSelf: 'flex-start'
            }}
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
                width: SIZES.WIDTH_MAIN,
                alignSelf: 'center',
                flex: 1,
                marginTop: -20
            }}
        >
            {isCurrentUser && renderButtonAddPhoto()}
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
                                fontSize: SIZES.FONT_H3,
                                color: COLORS.DEFAULT
                            }}
                        >
                            {`${isCurrentUser ? 'Bạn chưa có ảnh' : 'Không có ảnh'}`}
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
