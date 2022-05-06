import {
    CenterLoader, CustomButton, CustomCheckbox, CustomInput, CustomText
} from '@components/uiComponents';
import { Theme } from '@constants/index';
import {
    CommonHelpers, MediaHelpers, ToastHelpers, ValidationHelpers
} from '@helpers/index';
import { setCurrentUser, setPersonTabActiveIndex } from '@redux/Actions';
import { UserServices } from '@services/index';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImageScalable from 'react-native-scalable-image';
import { useDispatch, useSelector } from 'react-redux';

const {
    SIZES, COLORS, FONT: {
        TEXT_BOLD,
        TEXT_REGULAR
    }
} = Theme;

export default function PartnerData() {
    const [newUser, setNewUser] = useState({});
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [amountDisplay, setAmountDisplay] = useState('');
    const [amountDisplayOnline, setAmountDisplayOnline] = useState('');
    const [imageUri, setImageUri] = useState();
    const [isChangeImage, setIsChangeImage] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    useEffect(
        () => {
            setNewUser(currentUser);
            setAmountDisplay(CommonHelpers.formatCurrency(currentUser.earningExpected));
            setAmountDisplayOnline(CommonHelpers.formatCurrency(currentUser.onlineEarningExpected));
        }, []
    );

    const onChangeMinimumDuration = (durationInput) => {
        setNewUser({ ...newUser, minimumDuration: durationInput });
    };

    const onChangeEarningExpected = (input) => {
        setNewUser({ ...newUser, earningExpected: input });
        setAmountDisplay(input);
    };

    const renderEarningExpected = () => (
        <CustomInput
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            onChangeText={(input) => onChangeEarningExpected(input)}
            value={amountDisplay}
            label="Thu nhập mong muốn (Xu/phút):"
            onEndEditing={
                (e) => {
                    setAmountDisplay(CommonHelpers.formatCurrency(e.nativeEvent.text));
                }
            }
            onFocus={() => {
                setAmountDisplay(newUser.earningExpected);
            }}
        />
    );

    const renderInputMinimumDuration = () => (
        <CustomInput
            value={newUser.minimumDuration}
            onChangeText={(minimumDuration) => onChangeMinimumDuration(minimumDuration)}
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            label="Số phút tối thiểu của buổi hẹn:"
        />
    );

    const renderEarningExpectedOnline = () => (
        <CustomInput
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            onChangeText={(input) => {
                setNewUser({ ...newUser, onlineEarningExpected: input });
                setAmountDisplayOnline(input);
            }}
            value={amountDisplayOnline}
            label="Thu nhập mong muốn (online) (Xu/phút):"
            onEndEditing={
                (e) => {
                    setAmountDisplayOnline(CommonHelpers.formatCurrency(e.nativeEvent.text));
                }
            }
            onFocus={() => {
                setAmountDisplayOnline(newUser.onlineEarningExpected);
            }}
        />
    );

    const renderInputMinimumDurationOnline = () => (
        <CustomInput
            value={newUser.onlineMinimumDuration}
            onChangeText={(input) => setNewUser({ ...newUser, onlineMinimumDuration: input })}
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            label="Số phút tối thiểu của buổi hẹn (online):"
        />
    );

    const renderGetBookingType = () => (
        <View
            style={{
                width: SIZES.WIDTH_BASE * 0.9,
                marginBottom: 5,
                marginTop: 15
            }}
        >
            <CustomText
                style={{
                    color: COLORS.ACTIVE,
                    marginVertical: 5,
                }}
                text="Hình thức buổi hẹn:"
            />
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
            >
                <CustomCheckbox
                    label="Trực tiếp"
                    onChange={(checked) => {
                        setNewUser({
                            ...newUser,
                            isDatingOffline: checked
                        });
                    }}
                    containerStyle={{
                        width: SIZES.WIDTH_BASE * 0.3,
                    }}
                    labelStyle={{
                        fontFamily: TEXT_BOLD
                    }}
                    isChecked={newUser.isDatingOffline}
                />
                <CustomCheckbox
                    label="Online"
                    onChange={(checked) => {
                        setNewUser({
                            ...newUser,
                            isDatingOnline: checked
                        });
                    }}
                    containerStyle={{
                        width: SIZES.WIDTH_BASE * 0.3
                    }}
                    labelStyle={{
                        fontFamily: TEXT_BOLD
                    }}
                    isChecked={newUser.isDatingOnline}
                />
            </View>

        </View>

    );

    const renderButtonPanel = () => (
        <View
            style={{
                paddingTop: 10,
                paddingBottom: 20,
            }}
        >
            <CustomButton
                onPress={() => {
                    if (!validate()) {
                        return;
                    }

                    setIsShowSpinner(true);
                    if (isChangeImage) {
                        uploadImage();
                    } else {
                        onSubmitUpdateInfo(newUser);
                    }
                }}
                type="active"
                label="Xác nhận"
                buttonStyle={{
                    width: SIZES.WIDTH_BASE * 0.9
                }}
            />
        </View>
    );

    const validate = () => {
        let validateArr = [];

        if (newUser.isDatingOffline) {
            validateArr = [
                {
                    fieldName: 'Thu nhập mong muốn',
                    input: newUser.earningExpected,
                    validate: {
                        required: {
                            value: true,
                        },
                        equalGreaterThan: {
                            value: 600
                        }
                    }
                },
                {
                    fieldName: 'Số phút tối thiểu của buổi hẹn',
                    input: newUser.minimumDuration,
                    validate: {
                        required: {
                            value: true,
                        },
                        equalGreaterThan: {
                            value: 90
                        }
                    }
                }
            ];
        }

        if (newUser.isDatingOnline) {
            validateArr = validateArr.concat([
                {
                    fieldName: 'Thu nhập mong muốn (online)',
                    input: newUser.onlineEarningExpected,
                    validate: {
                        required: {
                            value: true,
                        },
                        equalGreaterThan: {
                            value: 600
                        }
                    }
                },
                {
                    fieldName: 'Số phút tối thiểu của buổi hẹn (online)',
                    input: newUser.onlineMinimumDuration,
                    validate: {
                        required: {
                            value: true,
                        },
                        equalGreaterThan: {
                            value: 30
                        }
                    }
                },
            ]);
        }

        if (!newUser.imageUrl) {
            ToastHelpers.renderToast('Vui lòng chọn ảnh hiển thị!', 'error');
            return false;
        }

        if (!newUser.isDatingOnline && !newUser.isDatingOffline) {
            ToastHelpers.renderToast('Bạn vui lòng chọn hình thức buổi hẹn!', 'error');
            return false;
        }

        if (!validateYearsOld(newUser.dob)) {
            ToastHelpers.renderToast('Bạn phải đủ 16 tuổi!', 'error');
            return false;
        }

        return ValidationHelpers.validate(validateArr);
    };

    const validateYearsOld = (dob) => {
        const dateString = moment(dob).format('YYYY-MM-DD');
        const years = moment().diff(dateString, 'years');

        return !(years < 16);
    };

    const onSubmitUpdateInfo = async (updateInfo) => {
        const {
            minimumDuration,
            earningExpected,
            onlineEarningExpected,
            onlineMinimumDuration,
            isDatingOnline,
            isDatingOffline,
            imageUrl
        } = updateInfo;

        const body = {
            imageUrl,
            minimumDuration: +minimumDuration,
            earningExpected: +earningExpected,
            onlineMinimumDuration: +onlineMinimumDuration,
            onlineEarningExpected: +onlineEarningExpected,
            IsDatingOnline: isDatingOnline,
            IsDatingOffline: isDatingOffline
        };

        // console.log('body :>> ', body);
        // setIsShowSpinner(false);
        // return;

        setIsShowSpinner(true);

        const result = await UserServices.submitUpdatePartnerInfoAsync(body);
        const { data } = result;

        if (data) {
            const userInfo = {
                ...currentUser,
                minimumDuration,
                earningExpected,
                onlineEarningExpected,
                onlineMinimumDuration,
                isDatingOnline,
                isDatingOffline,
                imageUrl
            };
            dispatch(setCurrentUser(userInfo));
            dispatch(setPersonTabActiveIndex(0));
            setNewUser(userInfo);
            ToastHelpers.renderToast(data.message, 'success');
        }
        setIsShowSpinner(false);
    };

    const uploadImage = async () => {
        MediaHelpers.imgbbUploadImage(
            imageUri.uri,
            (res) => {
                const { url } = res.data;

                const updateInfo = {
                    ...newUser,
                    imageUrl: url
                };

                onSubmitUpdateInfo(updateInfo);
            },
            () => {
                ToastHelpers.renderToast();
                setIsShowSpinner(false);
            }
        );
    };

    const onPickImage = () => {
        MediaHelpers.pickImage(
            false,
            [4, 3],
            (result) => {
                setImageUri(result);
                setIsChangeImage(true);
            },
            1
        );
    };

    const renderButtonUploadImage = (buttonText) => (
        <View style={{
            alignItems: 'center',
        }}
        >
            <CustomButton
                onPress={() => onPickImage()}
                type="active"
                label={buttonText}
                buttonStyle={{
                    width: SIZES.WIDTH_BASE * 0.9,
                    marginBottom: 10,
                    marginTop: 5
                }}
                labelStyle={{
                    fontFamily: TEXT_REGULAR,
                    fontSize: SIZES.FONT_H4
                }}
            />
        </View>
    );

    const renderImage = () => {
        if (isChangeImage) {
            if (imageUri) {
                return (
                    <View
                        style={{
                            alignSelf: 'center'
                        }}
                    >
                        <ImageScalable
                            style={{
                                zIndex: 99
                            }}
                            width={SIZES.WIDTH_BASE * 0.9}
                            source={imageUri}
                        />
                    </View>
                );
            }
        }
        if (currentUser.imageUrl) {
            return (
                <View
                    style={{
                        alignSelf: 'center'
                    }}
                >
                    <ImageScalable
                        style={{
                            zIndex: 99
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                        source={{ uri: currentUser.imageUrl }}
                    />
                </View>
            );
        }
        return (
            <View
                style={{
                    alignItems: 'center',
                    marginVertical: 15
                }}
            >
                <CustomText text="Chưa có ảnh" />
            </View>
        );
    };

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            backgroundColor: COLORS.BASE,
                            alignItems: 'center',
                            width: SIZES.WIDTH_BASE,
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                    >
                        {newUser && (
                            <>
                                {renderButtonUploadImage('Ảnh hiển thị trang chủ')}
                                {renderImage()}
                                {renderGetBookingType()}

                                {newUser.isDatingOffline && (
                                    <>
                                        {renderEarningExpected()}
                                        {renderInputMinimumDuration()}
                                    </>
                                )}

                                {newUser.isDatingOnline && (
                                    <>
                                        {renderEarningExpectedOnline()}
                                        {renderInputMinimumDurationOnline()}
                                    </>
                                )}

                                {renderButtonPanel()}
                            </>
                        )}
                    </KeyboardAwareScrollView>
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
