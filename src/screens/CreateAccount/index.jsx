/* eslint-disable max-len */
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image, ImageBackground,
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import noAvatar from '../../../assets/images/no-avatar.png';
import { CenterLoader, CustomButton, CustomInput } from '../../components/uiComponents';
import {
    Images, NowTheme, Rx, ScreenName
} from '../../constants';
import { MediaHelpers, ToastHelpers } from '../../helpers';
import { setToken } from '../../redux/Actions';
import { rxUtil } from '../../utils';

const {
    FONT: {
        MONTSERRAT_REGULAR,
    },
    SIZES,
    COLORS
} = NowTheme;

export default function CreateAccount(props) {
    const token = useSelector((state) => state.userReducer.token);

    const dispatch = useDispatch();

    const { navigation } = props;

    const [newUser, setNewUser] = useState({
        hometown: '',
        fullName: '',
        dob: '',
        description: '',
        address: 'Việt Nam',
        interests: ''
    });
    const [step, setStep] = useState(1);
    const [image, setImage] = useState(null);
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [isShowDoneMessage, setIsShowDoneMessage] = useState(false);

    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

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

    const onClickUploadProfileImage = () => {
        MediaHelpers.pickImage(true, [1, 1], (result) => handleUploadImageProfile(result.uri));
    };

    const handleUploadImageProfile = (uri) => {
        setIsShowSpinner(true);

        MediaHelpers.uploadImage(
            uri,
            Rx.USER.UPDATE_AVATAR,
            token,
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
            () => {
                ToastHelpers.renderToast('Tải ảnh lên thất bại! Vui lòng thử lại.', 'error');
                setIsShowSpinner(false);
            }
        );
    };

    const validate = () => {
        switch (step) {
            case 1: {
                if (!newUser.fullName) {
                    ToastHelpers.renderToast('Tên không hợp lệ!', 'error');
                    return false;
                }
                return true;
            }
            case 2: {
                if (!newUser.hometown) {
                    ToastHelpers.renderToast('Nơi sinh sống/làm việc không hợp lệ!', 'error');
                    return false;
                }
                return true;
            }
            case 3: {
                if (!newUser.description) {
                    ToastHelpers.renderToast('Vui lòng thêm mô tả!', 'error');
                    return false;
                }
                return true;
            }
            case 4: {
                if (!validateYearsOld(newUser.dob)) {
                    ToastHelpers.renderToast('Bạn phải đủ 16 tuổi!', 'error');
                    return false;
                }

                return true;
            }
            case 5: {
                if (!image) {
                    ToastHelpers.renderToast('Ảnh không hợp lệ!', 'error');
                    return false;
                }
                return true;
            }
            default: {
                return false;
            }
        }
    };

    const goToStep = (nextStep) => {
        if (validate()) {
            setStep(nextStep);
        }
    };

    const onChangeInputName = (nameInput) => {
        const user = { ...newUser, fullName: nameInput };
        setNewUser(user);
    };

    const onChangeInputHometown = (hometownInput) => {
        const user = { ...newUser, hometown: hometownInput };
        setNewUser(user);
    };

    const onChangeInputDescription = (descriptionInput) => {
        const user = { ...newUser, description: descriptionInput };
        setNewUser(user);
    };

    const onChangeInputInterests = (userInterestsInput) => {
        const user = { ...newUser, interests: userInterestsInput };
        setNewUser(user);
    };

    const onChangeYear = (yearInput) => {
        const user = { ...newUser, dob: yearInput };
        setNewUser(user);
    };

    const validateYearsOld = (dob) => {
        const dateString = moment(dob).format('YYYY-MM-DD');
        const years = moment().diff(dateString, 'years');

        return !(years < 16);
    };

    const onSubmitAccountCreation = () => {
        if (!image) {
            ToastHelpers.renderToast('Ảnh không hợp lệ!', 'error');
        } else {
            const {
                fullName, description, dob, address, interests, hometown
            } = newUser;

            const data = {
                fullName,
                description,
                dob: `${dob}-01-01T14:00:00`,
                height: 0,
                earningExpected: 0,
                weight: 0,
                address,
                interests,
                email: 'N/a',
                homeTown: hometown
            };

            const headers = {
                Authorization: token
            };

            setIsShowDoneMessage(true);
            setIsShowSpinner(true);

            rxUtil(
                Rx.USER.UPDATE_USER_INFO,
                'POST',
                data,
                headers,
                () => {
                    setIsShowSpinner(false);
                    goToStep(6);
                },
                (res) => {
                    setIsShowSpinner(false);
                    ToastHelpers.renderToast(res.data.message, 'error');
                },
                (res) => {
                    setIsShowSpinner(false);
                    ToastHelpers.renderToast(res.data.message, 'error');
                }
            );
        }
    };

    const renderMainContent = (nextStep) => {
        switch (nextStep) {
            case 1: {
                return (
                    <View style={styles.registerContainer}>
                        <View
                            style={styles.stepViewContainer}
                        >
                            <Text
                                style={
                                    [
                                        styles.stepTitleText,
                                        {
                                            color: '#333',
                                            fontSize: SIZES.FONT_H2
                                        }
                                    ]
                                }
                            >
                                {!newUser.fullName
                                    ? 'Xin hỏi, bạn là...?'
                                    : `Chào bạn, ${newUser.fullName}!`}
                            </Text>
                        </View>

                        <View
                            style={styles.stepFormContainer}
                        >
                            <CustomInput
                                value={newUser.fullName}
                                onChangeText={(name) => onChangeInputName(name)}
                                containerStyle={{
                                    marginVertical: 10,
                                    width: SIZES.WIDTH_BASE * 0.77
                                }}
                                placeholder="Nhập tên của bạn..."
                            />
                        </View>

                        <View
                            style={{
                                alignSelf: 'center'
                            }}
                        >
                            <CustomButton
                                onPress={() => goToStep(2)}
                                buttonStyle={styles.inputWith}
                                type="active"
                                label="Bước kế tiếp"
                            />
                        </View>
                    </View>
                );
            }
            case 2: {
                return (
                    <View style={styles.registerContainer}>
                        <View
                            style={styles.stepViewContainer}
                        >
                            <Text
                                style={
                                    [
                                        styles.stepTitleText,
                                        {
                                            color: '#333',
                                            fontSize: SIZES.FONT_H2
                                        }
                                    ]
                                }
                            >

                                {!newUser.hometown
                                    ? 'Quê quán?'
                                    : `${newUser.hometown} là một nơi tuyệt vời nhỉ!`}
                            </Text>
                        </View>

                        <View
                            style={styles.stepFormContainer}
                        >
                            <CustomInput
                                value={newUser.hometown}
                                onChangeText={(name) => onChangeInputHometown(name)}
                                containerStyle={{
                                    marginVertical: 10,
                                    width: SIZES.WIDTH_BASE * 0.77
                                }}
                                placeholder="Nhập quê quán..."
                            />
                        </View>

                        <View
                            style={{
                                alignSelf: 'center'
                            }}
                        >
                            <CustomButton
                                onPress={() => goToStep(3)}
                                buttonStyle={styles.inputWith}
                                type="active"
                                label="Bước kế tiếp"
                            />
                        </View>
                    </View>
                );
            }
            case 3: {
                return (
                    <View style={styles.registerContainer}>
                        <View
                            style={styles.stepViewContainer}
                        >
                            <Text
                                style={
                                    [
                                        styles.stepTitleText,
                                        {
                                            color: '#333',
                                            fontSize: SIZES.FONT_H2
                                        }
                                    ]
                                }
                            >
                                {!newUser.description
                                    ? 'Mô tả về bạn'
                                    : `${newUser.description}`}
                            </Text>
                        </View>

                        <View
                            style={styles.stepFormContainer}
                        >
                            <View
                                style={{
                                    height: 50,
                                    justifyContent: 'flex-end'
                                }}
                            >
                                <CustomInput
                                    value={newUser.description}
                                    multiline
                                    onChangeText={(description) => onChangeInputDescription(description)}
                                    containerStyle={{
                                        marginVertical: 10,
                                        width: SIZES.WIDTH_BASE * 0.77
                                    }}
                                    inputStyle={{
                                        height: 80,
                                    }}
                                    placeholder="Mô tả về mình đi nào..."
                                />
                            </View>
                        </View>

                        <View
                            style={{
                                alignSelf: 'center'
                            }}
                        >
                            <CustomButton
                                onPress={() => goToStep(4)}
                                buttonStyle={styles.inputWith}
                                type="active"
                                label="Bước kế tiếp"
                            />
                        </View>
                    </View>
                );
            }
            case 4: {
                return (
                    <View style={styles.registerContainer}>
                        <View
                            style={styles.stepViewContainer}
                        >
                            <Text
                                style={
                                    [
                                        styles.stepTitleText,
                                        {
                                            color: '#333',
                                            fontSize: SIZES.FONT_H2
                                        }
                                    ]
                                }
                            >
                                Thông tin cơ bản
                            </Text>
                        </View>

                        <View
                            style={
                                [
                                    styles.stepFormContainer,
                                    {
                                        zIndex: 99
                                    }
                                ]
                            }
                        >
                            <CustomInput
                                containerStyle={{
                                    marginVertical: 10,
                                    width: SIZES.WIDTH_BASE * 0.77
                                }}
                                onChangeText={(userInterests) => onChangeInputInterests(userInterests)}
                                value={newUser.interests}
                                placeholder="Nhập sở thích của bạn..."
                            />

                            <CustomInput
                                containerStyle={{
                                    marginVertical: 10,
                                    width: SIZES.WIDTH_BASE * 0.77
                                }}
                                onChangeText={(input) => onChangeYear(input)}
                                value={newUser.dob}
                                placeholder="Nhập năm sinh của bạn..."
                            />

                        </View>
                        <View
                            style={{
                                alignSelf: 'center'
                            }}
                        >
                            <CustomButton
                                onPress={() => goToStep(5)}
                                buttonStyle={styles.inputWith}
                                type="active"
                                label="Bước kế tiếp"
                            />
                        </View>
                    </View>
                );
            }
            case 5: {
                return (
                    <View style={styles.registerContainer}>
                        <View
                            style={styles.stepViewContainer}
                        >
                            <Text
                                style={
                                    [
                                        styles.stepTitleText,
                                        {
                                            color: '#333',
                                            fontSize: SIZES.FONT_H2
                                        }
                                    ]
                                }
                            >
                                {isShowDoneMessage
                                    ? 'Đang hoàn tất quá trình tạo tài khoản...'
                                    : 'Hãy chọn một bức ảnh thật đẹp nào!'}
                            </Text>
                        </View>

                        {isShowSpinner ? (
                            <CenterLoader />
                        ) : (
                            <>
                                <View
                                    style={styles.stepFormContainer}
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
                                                        source={noAvatar}
                                                        style={styles.image}
                                                    />
                                                )}
                                            </TouchableWithoutFeedback>
                                        )}
                                </View>

                                <View
                                    style={{
                                        marginTop: 50,
                                        alignSelf: 'center'
                                    }}
                                >
                                    <CustomButton
                                        onPress={() => onSubmitAccountCreation()}
                                        buttonStyle={styles.inputWith}
                                        type="active"
                                        label="Hoàn tất"
                                    />
                                </View>
                            </>
                        )}
                    </View>
                );
            }
            case 6: {
                return (
                    <View style={styles.registerContainer}>
                        <View
                            style={
                                [
                                    styles.finishStepViewContainer, {
                                        alignSelf: 'center',
                                        alignItems: 'center'
                                    }
                                ]
                            }
                        >
                            <Text
                                style={
                                    [
                                        styles.stepTitleText,
                                        {
                                            color: '#333',
                                            fontSize: SIZES.FONT_H2
                                        }
                                    ]
                                }
                            >
                                Hoàn tất quá trình tạo tài khoản!
                            </Text>
                            <View
                                style={{
                                    marginTop: 20
                                }}
                            >
                                <Text
                                    style={
                                        [
                                            styles.stepTitleText,
                                            {
                                                color: '#333',
                                                fontSize: SIZES.FONT_H2
                                            }
                                        ]
                                    }
                                >
                                    {`Cảm ơn bạn đã ở đây ${'<3'}!`}
                                </Text>
                            </View>
                        </View>

                        <>
                            <View
                                style={{
                                    marginTop: 50,
                                    alignSelf: 'center'
                                }}
                            >
                                <CustomButton
                                    onPress={() => {
                                        dispatch(setToken(''));
                                        navigation.navigate(ScreenName.ONBOARDING);
                                    }}
                                    buttonStyle={styles.inputWith}
                                    type="active"
                                    label="Quay về trang đăng nhập"
                                />
                            </View>
                        </>
                    </View>
                );
            }
            default: {
                return null;
            }
        }
    };

    try {
        return (
            <>
                <View
                    style={{
                        alignSelf: 'center',
                        alignItems: 'center',
                        flex: 1
                    }}
                >
                    <ImageBackground
                        source={Images.RegisterBackground}
                        style={styles.imageBackgroundContainer}
                        imageStyle={styles.imageBackground}
                    >
                        <KeyboardAwareScrollView>
                            <View
                                style={{
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    flex: 1
                                }}
                            >
                                {renderMainContent(step)}
                            </View>
                        </KeyboardAwareScrollView>
                    </ImageBackground>
                </View>
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

const styles = StyleSheet.create({
    imageBackgroundContainer: {
        width: SIZES.WIDTH_BASE,
        height: SIZES.HEIGHT_BASE,
        padding: 0,
        zIndex: 1
    },
    imageBackground: {
        width: SIZES.WIDTH_BASE,
        height: SIZES.HEIGHT_BASE
    },
    registerContainer: {
        marginTop: 55,
        width: SIZES.WIDTH_BASE * 0.9,
        height: SIZES.HEIGHT_BASE < 812 ? SIZES.HEIGHT_BASE * 0.8 : SIZES.HEIGHT_BASE * 0.8,
        backgroundColor: COLORS.BASE,
        borderRadius: 4,
        shadowColor: COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1,
        overflow: 'hidden'
    },
    stepViewContainer: {
        height: SIZES.HEIGHT_BASE * 0.25,
        marginHorizontal: 20,
        justifyContent: 'center'
    },
    stepTitleText: {
        fontFamily: MONTSERRAT_REGULAR,
        textAlign: 'center'
    },
    stepFormContainer: {
        height: SIZES.HEIGHT_BASE * 0.35,
        alignItems: 'center'
    },
    dropdownItem: {
        justifyContent: 'flex-start'
    },
    inputWith: {
        width: SIZES.WIDTH_BASE * 0.77,
    },
    image: {
        width: SIZES.HEIGHT_BASE * 0.35, height: SIZES.HEIGHT_BASE * 0.35
    },
    finishStepViewContainer: {
        height: SIZES.HEIGHT_BASE * 0.6,
        marginHorizontal: 20,
        justifyContent: 'center',
    }
});
