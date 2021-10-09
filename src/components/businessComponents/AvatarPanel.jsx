import { CenterLoader } from '@components/uiComponents';
import Images from '@constants/Images';
import Theme from '@constants/Theme';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const { SIZES } = Theme;

export default function AvatarPanel({
    user, image, isPartner = false, onClickAvatar = null
}) {
    // render
    const renderAvatar = () => {
        if (!isPartner && image) {
            return (
                <Image
                    style={styles.avatar}
                    source={{ uri: image }}
                />
            );
        }
        return (
            <Image
                style={styles.avatar}
                source={user.url ? { uri: user.url } : Images.defaultImage}
            />
        );
    };

    const renderAvatarPanel = () => (
        <View
            style={{
                width: SIZES.WIDTH_BASE * 0.3,
                marginTop: 5,
            }}
        >
            <View
                style={{
                    marginTop: 10
                }}
            >
                <CenterLoader />
                <View
                    style={{
                        zIndex: 99
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => !isPartner && onClickAvatar && onClickAvatar()}
                    >
                        {renderAvatar()}
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </View>
    );

    try {
        return (
            <>
                {renderAvatarPanel()}
            </>
        );
    } catch (error) {
        console.log('error :>> ', error);
    }
}

const styles = StyleSheet.create({
    avatar: {
        borderRadius: 100,
        width: SIZES.WIDTH_BASE * 0.25,
        height: SIZES.WIDTH_BASE * 0.25,
    },
});
