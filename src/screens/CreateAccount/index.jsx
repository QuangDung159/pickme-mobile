/* eslint-disable max-len */
import {
    CenterLoader, CustomButton, CustomInput, CustomText, RadioButton
} from '@components/uiComponents';
import { Images, ScreenName, Theme } from '@constants/index';
import { MediaHelpers, ToastHelpers, ValidationHelpers } from '@helpers/index';
import { setToken } from '@redux/Actions';
import UserServices from '@services/UserServices';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    Alert, Image, Platform,
    StyleSheet,
    Text, TouchableOpacity, View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

const arrStep = [
    'info', 'image', 'done'
];

export default function CreateAccount(props) {
    const { navigation } = props;

    const [newUser, setNewUser] = useState({
        hometown: '',
        fullName: '',
        dob: '',
        location: '',
        earningExpected: 0,
        height: '',
        weight: '',
        description: '',
        phone: '',
        address: 'Việt Nam',
        interests: ''
    });
    const [step, setStep] = useState(arrStep[0]);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [isMale, setIsMale] = useState(true);

    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

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

    const onSubmitAccountCreation = async (stepIndex) => {
        if (!validateFormInfo()) {
            return;
        }

        const {
            fullName, description, dob, height, earningExpected, weight, address, interests, hometown
        } = newUser;

        const body = {
            fullName,
            description,
            dob,
            height,
            earningExpected,
            weight,
            address,
            interests,
            homeTown: hometown,
            email: 'N/a',
            url: imageUrl,
            IsMale: isMale
        };

        setIsShowSpinner(true);
        const result = await UserServices.submitUpdateInfoAsync(body);
        const { data } = result;
        if (data) {
            setStep(arrStep[stepIndex]);
        }
        setIsShowSpinner(false);
    };

    const validateFormInfo = () => {
        const validateArr = [
            {
                fieldName: 'Tên hiển thị',
                input: newUser.fullName,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 255,
                    },
                }
            },
            {
                fieldName: 'Năm sinh',
                input: newUser.dob,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 4,
                    },
                    minLength: {
                        value: 4
                    }
                }
            },
            {
                fieldName: 'Chiều cao',
                input: newUser.height,
                validate: {
                    required: {
                        value: true,
                    },
                }
            },
            {
                fieldName: 'Cân nặng',
                input: newUser.weight,
                validate: {
                    required: {
                        value: true,
                    },
                }
            },
            {
                fieldName: 'Sở thích',
                input: newUser.interests,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 255,
                    },
                }
            },
            {
                fieldName: 'Nơi sinh sống',
                input: newUser.hometown,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 255,
                    },
                }
            },
            {
                fieldName: 'Mô tả bản thân\n',
                input: newUser.description,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 255,
                    },
                }
            },
        ];

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

    const renderInfoForm = () => (
        <>
            <View style={styles.formContainer}>
                <CustomInput
                    value={newUser.fullName}
                    onChangeText={(input) => setNewUser({ ...newUser, fullName: input })}
                    containerStyle={{
                        marginVertical: 10,
                        width: SIZES.WIDTH_BASE * 0.9
                    }}
                    placeholder="Tên hiển thị"
                />

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginVertical: 10,
                    }}
                >
                    <CustomInput
                        inputStyle={{
                            width: SIZES.WIDTH_BASE * 0.44
                        }}
                        onChangeText={(input) => setNewUser({ ...newUser, dob: input })}
                        value={newUser.dob}
                        placeholder="Năm sinh"
                        keyboardType="number-pad"
                    />

                    <RadioButton
                        label="Nam"
                        selected={isMale}
                        onPress={() => setIsMale(true)}
                    />
                    <RadioButton
                        label="Nữ"
                        selected={!isMale}
                        onPress={() => setIsMale(false)}
                    />
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginVertical: 10,
                    }}
                >
                    <CustomInput
                        inputStyle={{
                            width: SIZES.WIDTH_BASE * 0.44
                        }}
                        onChangeText={(input) => setNewUser({ ...newUser, height: input })}
                        value={newUser.height}
                        placeholder="Chiều cao (cm)"
                        keyboardType="number-pad"
                    />

                    <CustomInput
                        inputStyle={{
                            width: SIZES.WIDTH_BASE * 0.44
                        }}
                        onChangeText={(input) => setNewUser({ ...newUser, weight: input })}
                        value={newUser.weight}
                        placeholder="Cân nặng (kg)"
                        keyboardType="number-pad"
                    />
                </View>

                <CustomInput
                    containerStyle={{
                        marginVertical: 10,
                        width: SIZES.WIDTH_BASE * 0.9
                    }}
                    onChangeText={(input) => setNewUser({ ...newUser, interests: input })}
                    value={newUser.interests}
                    placeholder="Sở thích"
                />

                <CustomInput
                    value={newUser.hometown}
                    onChangeText={(input) => setNewUser({ ...newUser, hometown: input })}
                    containerStyle={{
                        marginVertical: 10,
                        width: SIZES.WIDTH_BASE * 0.9
                    }}
                    placeholder="Nơi sinh sống"
                />

                <CustomInput
                    value={newUser.description}
                    multiline
                    onChangeText={(input) => setNewUser({ ...newUser, description: input })}
                    containerStyle={{
                        marginVertical: 10,
                        width: SIZES.WIDTH_BASE * 0.9
                    }}
                    inputStyle={{
                        height: 80,
                    }}
                    placeholder="Mô tả bản thân"
                />

            </View>

            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: SIZES.WIDTH_BASE * 0.9
                }}
            >
                <CustomButton
                    onPress={() => {
                        dispatch(setToken(''));
                        navigation.navigate(ScreenName.ONBOARDING);
                    }}
                    buttonStyle={styles.button}
                    type="active"
                    label="Đăng nhập"
                />
                <CustomButton
                    onPress={() => onSubmitAccountCreation(1)}
                    buttonStyle={styles.button}
                    type="active"
                    label="Xác nhận"
                />
            </View>
        </>
    );

    const renderByStep = () => {
        switch (step) {
            case 'info': {
                return (
                    <>
                        {renderInfoForm()}
                    </>
                );
            }
            case 'image': {
                return (
                    <>
                        {renderImageForm()}
                    </>
                );
            }
            default: {
                return (
                    <>
                        {renderDone()}
                    </>
                );
            }
        }
    };

    const handleUploadImageProfile = (uri) => {
        setIsShowSpinner(true);

        MediaHelpers.imgbbUploadImage(
            uri,
            (res) => {
                ToastHelpers.renderToast('Tải ảnh lên thành công!', 'success');
                setIsShowSpinner(false);
                setImage(uri);

                if (res?.data?.url) {
                    setImageUrl(res?.data?.url);
                }
            },
            () => {
                ToastHelpers.renderToast();
                setIsShowSpinner(false);
            }
        );
    };

    const onClickUploadProfileImage = () => {
        MediaHelpers.pickImage(true, [1, 1], (result) => handleUploadImageProfile(result.uri));
    };

    const renderDone = () => (
        <>
            <View
                style={styles.formContainer}
            >
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.9
                    }}
                >
                    <CustomText
                        text="Cảm ơn bạn đã ở đây"
                        style={{
                            color: COLORS.ACTIVE,
                            fontSize: SIZES.FONT_H1,
                            textAlign: 'center',
                            marginBottom: 10,
                            fontFamily: TEXT_BOLD
                        }}
                    />

                    <CustomText
                        text={'Chúc bạn có những trải nghiệm tuyệt vời\ncùng với 2SeeYou'}
                        style={{
                            color: COLORS.ACTIVE,
                            fontSize: SIZES.FONT_H3,
                            textAlign: 'center',
                        }}
                    />
                </View>
            </View>

            <View
                style={{
                    position: 'absolute',
                    bottom: 0
                }}
            >
                <CustomButton
                    onPress={() => {
                        dispatch(setToken(''));
                        navigation.navigate(ScreenName.ONBOARDING);
                    }}
                    buttonStyle={[styles.button, {
                        marginTop: 30,
                        width: SIZES.WIDTH_BASE * 0.9
                    }]}
                    type="active"
                    label="Quay về trang đăng nhập"
                />
            </View>
        </>
    );

    const renderImageForm = () => (
        <>
            <View
                style={styles.formContainer}
            >
                {isShowSpinner
                    ? (
                        <CenterLoader />
                    )
                    : (
                        <TouchableOpacity
                            onPress={() => onClickUploadProfileImage()}
                        >
                            <View
                                style={{
                                    borderWidth: 1,
                                    borderColor: COLORS.ACTIVE,
                                    borderRadius: 25,
                                    marginBottom: 10,
                                    width: SIZES.WIDTH_BASE * 0.9,
                                    height: SIZES.WIDTH_BASE * 0.9,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
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
                            </View>

                            <CustomText
                                text="Ảnh đại diện"
                                style={{
                                    textAlign: 'center',
                                    fontSize: SIZES.FONT_H2,
                                    fontFamily: TEXT_BOLD
                                }}
                            />
                        </TouchableOpacity>
                    )}
            </View>

            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: SIZES.WIDTH_BASE * 0.9
                }}
            >
                <CustomButton
                    onPress={() => {
                        dispatch(setToken(''));
                        navigation.navigate(ScreenName.ONBOARDING);
                    }}
                    buttonStyle={styles.button}
                    type="active"
                    label="Đăng nhập"
                />
                <CustomButton
                    onPress={() => onSubmitAccountCreation(2)}
                    buttonStyle={styles.button}
                    type="active"
                    label="Xác nhận"
                />
            </View>
        </>
    );

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <KeyboardAwareScrollView>
                        <View
                            style={{
                                flex: 1,
                                alignSelf: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <View
                                style={styles.stepSessionContainer}
                            >
                                <Text
                                    style={
                                        [
                                            styles.title,
                                            {
                                                color: COLORS.DEFAULT,
                                                fontSize: SIZES.FONT_H3,
                                                marginTop: SIZES.HEIGHT_BASE * 0.15
                                            }
                                        ]
                                    }
                                >
                                    {step !== arrStep[2] && 'Tạo tài khoản thành công.\nBạn có thể đăng nhập hoặc tiếp tục hoàn thiện thông tin tài khoản.'}
                                </Text>
                            </View>

                            {renderByStep()}
                        </View>
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
    },
    stepViewContainer: {
        height: SIZES.HEIGHT_BASE * 0.25,
        marginHorizontal: 20,
        justifyContent: 'center'
    },
    stepTitleText: {
        fontFamily: TEXT_REGULAR,
        fontSize: SIZES.FONT_H1,
        textAlign: 'center',
        color: COLORS.DEFAULT
    },
    stepFormContainer: {
        height: SIZES.HEIGHT_BASE * 0.35,
        alignItems: 'center'
    },
    inputWith: {
        width: SIZES.WIDTH_BASE * 0.9,
        marginTop: 10
    },
    title: {
        fontFamily: TEXT_BOLD,
        textAlign: 'center'
    },
    stepSessionContainer: {
        height: SIZES.HEIGHT_BASE * 0.3,
        alignSelf: 'center',
        alignItems: 'center',
        width: SIZES.WIDTH_BASE * 0.9
    },
    formContainer: {
        height: SIZES.HEIGHT_BASE * 0.65
    },
    button: {
        marginVertical: 10,
        width: SIZES.WIDTH_BASE * 0.44
    },
    image: {
        width: SIZES.HEIGHT_BASE * 0.35, height: SIZES.HEIGHT_BASE * 0.35
    }
});
