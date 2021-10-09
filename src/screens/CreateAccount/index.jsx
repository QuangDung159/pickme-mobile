/* eslint-disable max-len */
import { ScreenName, Theme } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    Alert, Platform,
    StyleSheet,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import DescForm from './DescForm';
import DoneSection from './DoneSection';
import HometownForm from './HometownForm';
import ImageForm from './ImageForm';
import NameForm from './NameForm';
import UserInfoForm from './UserInfoForm';

const {
    FONT: {
        TEXT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;

export default function CreateAccount(props) {
    const { navigation } = props;

    const [newUser, setNewUser] = useState({
        hometown: '',
        fullName: '',
        dob: '',
        location: '',
        earningExpected: 0,
        height: 0,
        weight: 0,
        description: '',
        phone: '',
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
                if (!newUser.interests) {
                    ToastHelpers.renderToast('Vui lòng nhập sở thích!', 'error');
                    return false;
                }

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

    const validateYearsOld = (dob) => {
        const dateString = moment(dob).format('YYYY-MM-DD');
        const years = moment().diff(dateString, 'years');

        return !(years < 16);
    };

    const renderMainContent = (nextStep) => {
        switch (nextStep) {
            case 1: {
                return (
                    <NameForm
                        goToStep={(stepIndex) => goToStep(stepIndex)}
                        inputWith={styles.inputWith}
                        newUser={newUser}
                        registerContainer={styles.registerContainer}
                        setNewUser={(newUserObj) => setNewUser(newUserObj)}
                        stepFormContainer={styles.stepFormContainer}
                        stepTitleText={styles.stepTitleText}
                        stepViewContainer={styles.stepViewContainer}
                    />
                );
            }
            case 2: {
                return (
                    <HometownForm
                        goToStep={(stepIndex) => goToStep(stepIndex)}
                        inputWith={styles.inputWith}
                        newUser={newUser}
                        registerContainer={styles.registerContainer}
                        setNewUser={(newUserObj) => setNewUser(newUserObj)}
                        stepFormContainer={styles.stepFormContainer}
                        stepTitleText={styles.stepTitleText}
                        stepViewContainer={styles.stepViewContainer}
                    />
                );
            }
            case 3: {
                return (
                    <DescForm
                        goToStep={(stepIndex) => goToStep(stepIndex)}
                        inputWith={styles.inputWith}
                        newUser={newUser}
                        registerContainer={styles.registerContainer}
                        setNewUser={(newUserObj) => setNewUser(newUserObj)}
                        stepFormContainer={styles.stepFormContainer}
                        stepTitleText={styles.stepTitleText}
                        stepViewContainer={styles.stepViewContainer}
                    />
                );
            }
            case 4: {
                return (
                    <UserInfoForm
                        goToStep={(stepIndex) => goToStep(stepIndex)}
                        inputWith={styles.inputWith}
                        newUser={newUser}
                        registerContainer={styles.registerContainer}
                        setNewUser={(newUserObj) => setNewUser(newUserObj)}
                        stepFormContainer={styles.stepFormContainer}
                        stepTitleText={styles.stepTitleText}
                        stepViewContainer={styles.stepViewContainer}
                    />
                );
            }
            case 5: {
                return (
                    <ImageForm
                        goToStep={(stepIndex) => goToStep(stepIndex)}
                        inputWith={styles.inputWith}
                        newUser={newUser}
                        registerContainer={styles.registerContainer}
                        stepFormContainer={styles.stepFormContainer}
                        stepTitleText={styles.stepTitleText}
                        stepViewContainer={styles.stepViewContainer}
                        image={image}
                        isShowDoneMessage={isShowDoneMessage}
                        isShowSpinner={isShowSpinner}
                        setImage={(url) => setImage(url)}
                        setIsShowDoneMessage={(isDone) => setIsShowDoneMessage(isDone)}
                        setIsShowSpinner={(isSpinner) => setIsShowSpinner(isSpinner)}
                    />
                );
            }
            case 6: {
                return (
                    <DoneSection
                        inputWith={styles.inputWith}
                        navigation={navigation}
                        registerContainer={styles.registerContainer}
                        stepTitleText={styles.stepTitleText}
                    />
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
                        flex: 1,
                        alignSelf: 'center',
                        alignItems: 'center'
                    }}
                >
                    <KeyboardAwareScrollView>
                        <View style={{
                            flex: 1,
                            alignSelf: 'center',
                            alignItems: 'center'
                        }}
                        >
                            {renderMainContent(step)}
                        </View>
                    </KeyboardAwareScrollView>
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
    }
});
