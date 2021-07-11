/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { CenterLoader, CustomButton } from '@components/uiComponents';
import { Images, Rx, Theme } from '@constants/index';
import { MediaHelpers, ToastHelpers } from '@helpers/index';
import { UserServices } from '@services/index';
import React from 'react';
import {
    Image, StyleSheet, Text, View
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const {
    SIZES,
} = Theme;

export default function ImageForm({
    registerContainer,
    stepViewContainer,
    stepTitleText, stepFormContainer,
    inputWith,
    newUser,
    isShowDoneMessage,
    setIsShowDoneMessage,
    isShowSpinner,
    setIsShowSpinner,
    image,
    setImage,
    goToStep
}) {
    const onClickUploadProfileImage = () => {
        MediaHelpers.pickImage(true, [1, 1], (result) => handleUploadImageProfile(result.uri));
    };

    const handleUploadImageProfile = (uri) => {
        setIsShowSpinner(true);

        MediaHelpers.uploadImage(
            uri,
            Rx.USER.UPDATE_AVATAR,
            (res) => {
                ToastHelpers.renderToast(
                    res?.data?.message || 'Tải ảnh lên thành công!', 'success'
                );

                setIsShowSpinner(false);
                setImage(uri);
            },
            (err) => {
                ToastHelpers.renderToast(
                    err?.data?.message || 'Tải ảnh lên thất bại! Vui lòng thử lại.', 'error'
                );
                setIsShowSpinner(false);
            },
        );
    };

    const onSubmitAccountCreation = async () => {
        if (!image) {
            ToastHelpers.renderToast('Ảnh không hợp lệ!', 'error');
        } else {
            const {
                fullName, description, dob, height, earningExpected, weight, address, interests, hometown
            } = newUser;

            const body = {
                fullName,
                description,
                dob: `${dob}-01-01T14:00:00`,
                height: +height,
                earningExpected,
                weight: +weight,
                address,
                interests,
                homeTown: hometown,
                email: 'N/a'
            };

            setIsShowDoneMessage(true);
            setIsShowSpinner(true);

            const result = await UserServices.submitUpdateInfoAsync(body);
            const { data } = result;

            if (data) {
                goToStep(6);
            }
            setIsShowSpinner(false);
        }
    };

    const renderImageForm = () => (
        <View style={registerContainer}>
            <View
                style={stepViewContainer}
            >
                <Text
                    style={stepTitleText}
                    color="#333"
                    size={24}
                >
                    {isShowDoneMessage
                        ? 'Đang hoàn tất quá trình tạo tài khoản...'
                        : 'Hãy chọn một bức ảnh thật đẹp nào!'}
                </Text>
            </View>

            {isShowSpinner ? (
                <CenterLoader size="small" />
            ) : (
                <>
                    <View
                        style={stepFormContainer}
                    >
                        {isShowSpinner
                            ? (
                                <CenterLoader />
                            )
                            : (
                                <TouchableWithoutFeedback
                                    onPress={() => onClickUploadProfileImage()}
                                >
                                    {image ? (
                                        <Image
                                            source={{ uri: image }}
                                            style={styles.image}
                                        />
                                    ) : (
                                        <Image
                                            source={Images.defaultImage}
                                            style={styles.image}
                                        />
                                    )}
                                </TouchableWithoutFeedback>
                            )}
                    </View>

                    <View
                        center
                        style={{
                            marginTop: 50,
                        }}
                    >
                        <CustomButton
                            onPress={() => onSubmitAccountCreation()}
                            buttonStyle={inputWith}
                            type="active"
                            label="Hoàn tất"
                        />
                    </View>
                </>
            )}
        </View>
    );

    try {
        return (
            <View>
                {renderImageForm()}
            </View>
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

const styles = StyleSheet.create({
    image: {
        width: SIZES.HEIGHT_BASE * 0.35, height: SIZES.HEIGHT_BASE * 0.35
    }
});
