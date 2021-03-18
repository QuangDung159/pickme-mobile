/* eslint-disable max-len */
import * as ImagePicker from 'expo-image-picker';
import {
    Block, Button, Text
} from 'galio-framework';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image, ImageBackground,
    Platform,
    StyleSheet
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import noAvatar from '../../assets/images/no-avatar.png';
import { Input } from '../components/uiComponents';
import {
    Images, NowTheme, Rx, ScreenName, Utils
} from '../constants';
import { MediaHelpers, ToastHelpers } from '../helpers';
import { setToken } from '../redux/Actions';
import { rxUtil } from '../utils';

const defaultDate = moment('1996-10-25').format(Utils.TIME_FORMAT_ZULU);

export default function CreateAccount(props) {
    const token = useSelector((state) => state.userReducer.token);
    const dispatch = useDispatch();

    const { navigation } = props;

    const [newUser, setNewUser] = useState({
        userId: 5,
        hometown: '',
        fullName: '',
        username: '',
        email: '',
        dob: defaultDate,
        gender: '',
        location: '',
        charge: 600,
        rating: 4.7,
        isVerify: false,
        walletAmount: '',
        height: '',
        weight: '',
        description: '',
        phone: '',
        image: []
    });
    const [step, setStep] = useState(1);
    const [image, setImage] = useState(null);
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [isShowDoneMessage, setIsShowDoneMessage] = useState(false);

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
                if (!newUser.location) {
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
                if (newUser.height <= 0) {
                    ToastHelpers.renderToast('Chiều cao không hợp lệ!', 'error');
                    return false;
                }

                if (!newUser.hometown) {
                    ToastHelpers.renderToast('Quê quán không hợp lệ!', 'error');
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

    const onChangeInputName = (nameInput) => {
        const user = { ...newUser, fullName: nameInput };
        setNewUser(user);
    };

    const onChangeInputLocation = (locationInput) => {
        const user = { ...newUser, location: locationInput };
        setNewUser(user);
    };

    const onChangeInputDescription = (descriptionInput) => {
        const user = { ...newUser, description: descriptionInput };
        setNewUser(user);
    };

    const onChangeInputHeight = (userHeightInput) => {
        const user = { ...newUser, height: userHeightInput };
        setNewUser(user);
    };

    const onChangeInputDOB = (dobInput) => {
        // format time to use
        const stringTimeFormated = moment(dobInput.split('-').reverse().join('-')).format(Utils.TIME_FORMAT_ZULU);
        const user = { ...newUser, dob: stringTimeFormated };

        setNewUser(user);
    };

    const onChangeInputHometown = (hometownInput) => {
        const user = { ...newUser, hometown: hometownInput };
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
            const data = {
                fullName: newUser.fullName,
                description: newUser.description,
                dob: newUser.dob,
                height: +newUser.height,
                earningExpected: 0,
                weight: 0
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
                () => {
                    setIsShowSpinner(false);
                    ToastHelpers.renderToast(
                        'Lỗi hệ thống! Vui lòng thử lại.',
                        'error'
                    );
                },
                () => {
                    setIsShowSpinner(false);
                    ToastHelpers.renderToast(
                        'Lỗi hệ thống! Vui lòng thử lại.',
                        'error'
                    );
                }
            );
        }
    };

    const renderMainContent = (nextStep) => {
        switch (nextStep) {
            case 1: {
                return (
                    <Block style={styles.registerContainer}>
                        <Block
                            style={styles.stepViewContainer}
                        >
                            <Text
                                style={styles.stepTitleText}
                                color="#333"
                                size={24}
                            >
                                {!newUser.fullName
                                    ? 'Xin hỏi, bạn là...?'
                                    : `Chào bạn, ${newUser.fullName}!`}
                            </Text>
                        </Block>

                        <Block
                            style={styles.stepFormContainer}
                        >
                            <Input
                                style={[styles.inputWith, {
                                    borderRadius: 5,
                                }]}
                                onChangeText={(name) => onChangeInputName(name)}
                                value={newUser.fullName}
                                placeholder="Nhập tên của bạn..."
                            />
                        </Block>

                        <Block center>
                            <Button
                                onPress={() => goToStep(2)}
                                style={styles.inputWith}
                                shadowless
                            >
                                Bước kế tiếp
                            </Button>
                        </Block>
                    </Block>
                );
            }
            case 2: {
                return (
                    <Block style={styles.registerContainer}>
                        <Block
                            style={styles.stepViewContainer}
                        >
                            <Text
                                style={styles.stepTitleText}
                                color="#333"
                                size={24}
                            >

                                {!newUser.location
                                    ? 'Nơi bạn sinh sống, làm việc?'
                                    : `${newUser.location} là một nơi tuyệt vời nhỉ!`}
                            </Text>
                        </Block>

                        <Block
                            style={styles.stepFormContainer}
                        >
                            <DropDownPicker
                                items={[
                                    {
                                        label: 'TP.Hồ Chí Minh', value: '1', hidden: true
                                    },
                                    {
                                        label: 'TP.Đà Nẵng', value: '2'
                                    },
                                    {
                                        label: 'TP.Cần Thơ', value: '3'
                                    },
                                    {
                                        label: 'Đồng Nai', value: '4'
                                    },
                                ]}
                                // defaultValue="1"
                                containerStyle={[styles.inputWith, {
                                    height: 43,
                                }]}
                                selectedtLabelStyle={{
                                    color: 'red'
                                }}
                                placeholderStyle={{
                                    color: NowTheme.COLORS.MUTED
                                }}
                                itemStyle={styles.dropdownItem}
                                activeLabelStyle={{ color: NowTheme.COLORS.ACTIVE }}
                                onChangeItem={(item) => onChangeInputLocation(item.label)}
                                labelStyle={{
                                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                                }}
                                placeholder="Nơi sinh sống, làm việc"
                                searchable
                                searchablePlaceholder="Nhập nơi sinh sống, làm việc..."
                                searchablePlaceholderTextColor="gray"
                                searchableError={() => <Text>Not Found</Text>}
                            />
                        </Block>

                        <Block center>
                            <Button
                                onPress={() => goToStep(3)}
                                style={styles.inputWith}
                                shadowless
                            >
                                Bước kế tiếp
                            </Button>
                        </Block>
                    </Block>
                );
            }
            case 3: {
                return (
                    <Block style={styles.registerContainer}>
                        <Block
                            style={styles.stepViewContainer}
                        >
                            <Text
                                style={styles.stepTitleText}
                                color="#333"
                                size={24}
                            >
                                {!newUser.description
                                    ? 'Mô tả về bạn'
                                    : `${newUser.description}`}
                            </Text>
                        </Block>

                        <Block
                            style={styles.stepFormContainer}
                        >
                            <Block
                                style={{
                                    height: 50,
                                    justifyContent: 'flex-end'
                                }}
                            >
                                <Input
                                    style={[styles.inputWith, {
                                        borderRadius: 5,
                                    }]}
                                    value={newUser.description}
                                    onChangeText={(description) => onChangeInputDescription(description)}
                                    placeholder="Mô tả về mình đi nào..."
                                />
                            </Block>
                        </Block>

                        <Block center>
                            <Button
                                onPress={() => goToStep(4)}
                                style={styles.inputWith}
                                shadowless
                            >
                                Bước kế tiếp
                            </Button>
                        </Block>
                    </Block>
                );
            }
            case 4: {
                return (
                    <Block style={styles.registerContainer}>
                        <Block
                            style={styles.stepViewContainer}
                        >
                            <Text
                                style={styles.stepTitleText}
                                color="#333"
                                size={24}
                            >
                                Thông tin cơ bản
                            </Text>
                        </Block>

                        <Block
                            style={[styles.stepFormContainer, {
                                zIndex: 2
                            }]}
                        >
                            <Input
                                placeholderStyle={{
                                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                    color: NowTheme.COLORS.MUTED
                                }}
                                style={[styles.inputWith, {
                                    borderRadius: 5,
                                }]}
                                onChangeText={(userHeight) => onChangeInputHeight(userHeight)}
                                value={newUser.height}
                                placeholder="Nhập chiều cao (cm)..."
                                keyboardType="number-pad"
                            />

                            <DatePicker
                                style={[styles.inputWith, {
                                    marginTop: 5
                                }]}
                                date={moment(newUser.dob).format('DD-MM-YYYY')}
                                mode="date"
                                format="DD-MM-YYYY"
                                confirmBtnText="Xác nhận"
                                cancelBtnText="Huỷ"
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: -4,
                                        marginLeft: 0,
                                        // marginTop: -5
                                    },
                                    dateInput: {
                                        borderRadius: 5,
                                        borderColor: NowTheme.COLORS.BORDER,
                                        height: 44,
                                        marginTop: -14
                                    },
                                    dateText: {
                                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                        alignSelf: 'flex-start',
                                        marginLeft: 40
                                    }
                                    // ... You can check the source to find the other keys.
                                }}
                                onDateChange={(dateInput) => { onChangeInputDOB(dateInput); }}
                            />

                            <DropDownPicker
                                items={[
                                    {
                                        label: 'TP.Hồ Chí Minh', value: '1', hidden: true
                                    },
                                    {
                                        label: 'TP.Đà Nẵng', value: '2'
                                    },
                                    {
                                        label: 'TP.Cần Thơ', value: '3'
                                    },
                                    {
                                        label: 'Đồng Nai', value: '4'
                                    },
                                ]}
                                // defaultValue="1"
                                containerStyle={[styles.inputWith, {
                                    height: 44
                                }]}
                                selectedtLabelStyle={{
                                    color: 'red'
                                }}
                                placeholderStyle={{
                                    color: NowTheme.COLORS.MUTED
                                }}
                                itemStyle={styles.dropdownItem}
                                dropDownStyle={{ backgroundColor: '#fafafa' }}
                                activeLabelStyle={{ color: NowTheme.COLORS.ACTIVE }}
                                onChangeItem={(item) => onChangeInputHometown(item.label)}
                                labelStyle={{
                                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                                }}
                                placeholder="Quê quán"
                                searchable
                                searchablePlaceholder="Nhập quê quán..."
                                searchablePlaceholderTextColor={NowTheme.COLORS.MUTED}
                                searchableError={() => <Text>Not Found</Text>}
                            />
                        </Block>

                        <Block
                            center
                            style={{
                                zIndex: 1
                            }}
                        >
                            <Button
                                onPress={() => goToStep(5)}
                                style={styles.inputWith}
                                shadowless
                            >
                                Bước kế tiếp
                            </Button>
                        </Block>
                    </Block>
                );
            }
            case 5: {
                return (
                    <Block style={styles.registerContainer}>
                        <Block
                            style={styles.stepViewContainer}
                        >
                            <Text
                                style={styles.stepTitleText}
                                color="#333"
                                size={24}
                            >
                                {isShowDoneMessage
                                    ? 'Đang hoàn tất quá trình tạo tài khoản...'
                                    : 'Hãy chọn một bức ảnh thật đẹp nào!'}
                            </Text>
                        </Block>

                        {isShowSpinner ? (
                            <ActivityIndicator
                                size="large"
                                color={NowTheme.COLORS.ACTIVE}
                            />
                        ) : (
                            <>
                                <Block
                                    style={styles.stepFormContainer}
                                >
                                    {isShowSpinner
                                        ? (
                                            <ActivityIndicator
                                                size="large"
                                                color={NowTheme.COLORS.ACTIVE}
                                            />
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
                                </Block>

                                <Block
                                    center
                                    style={{
                                        marginTop: 50,
                                    }}
                                >
                                    <Button
                                        onPress={() => onSubmitAccountCreation()}
                                        style={styles.inputWith}
                                        shadowless
                                    >
                                        Hoàn tất
                                    </Button>
                                </Block>
                            </>
                        )}
                    </Block>
                );
            }
            case 6: {
                return (
                    <Block style={styles.registerContainer}>
                        <Block
                            middle
                            style={styles.finishStepViewContainer}
                        >
                            <Text
                                style={styles.stepTitleText}
                                color="#333"
                                size={24}
                            >
                                Hoàn tất quá trình tạo tài khoản!
                            </Text>
                            <Block
                                style={{
                                    marginTop: 20
                                }}
                            >
                                <Text
                                    style={styles.stepTitleText}
                                    color="#333"
                                    size={24}
                                >
                                    {`Cảm ơn bạn đã ở đây ${'<3'}!`}
                                </Text>
                            </Block>
                        </Block>

                        <>
                            <Block
                                center
                                style={{
                                    marginTop: 50,
                                }}
                            >
                                <Button
                                    onPress={() => {
                                        dispatch(setToken(''));
                                        navigation.navigate(ScreenName.ONBOARDING);
                                    }}
                                    style={styles.inputWith}
                                    shadowless
                                >
                                    Quay về trang đăng nhập
                                </Button>
                            </Block>
                        </>
                    </Block>
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
                <Block flex middle>
                    <ImageBackground
                        source={Images.RegisterBackground}
                        style={styles.imageBackgroundContainer}
                        imageStyle={styles.imageBackground}
                    >
                        <KeyboardAwareScrollView>
                            <Block flex middle>
                                {renderMainContent(step)}
                            </Block>
                        </KeyboardAwareScrollView>
                    </ImageBackground>
                </Block>
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
        width: NowTheme.SIZES.WIDTH_BASE,
        height: NowTheme.SIZES.HEIGHT_BASE,
        padding: 0,
        zIndex: 1
    },
    imageBackground: {
        width: NowTheme.SIZES.WIDTH_BASE,
        height: NowTheme.SIZES.HEIGHT_BASE
    },
    registerContainer: {
        marginTop: 55,
        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
        height: NowTheme.SIZES.HEIGHT_BASE < 812 ? NowTheme.SIZES.HEIGHT_BASE * 0.8 : NowTheme.SIZES.HEIGHT_BASE * 0.8,
        backgroundColor: NowTheme.COLORS.BASE,
        borderRadius: 4,
        shadowColor: NowTheme.COLORS.BLACK,
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
        height: NowTheme.SIZES.HEIGHT_BASE * 0.25,
        marginHorizontal: 20,
        justifyContent: 'center'
    },
    stepTitleText: {
        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
        textAlign: 'center'
    },
    stepFormContainer: {
        marginTop: 50,
        height: NowTheme.SIZES.HEIGHT_BASE * 0.35,
        alignItems: 'center'
    },
    dropdownItem: {
        justifyContent: 'flex-start'
    },
    inputWith: {
        width: NowTheme.SIZES.WIDTH_BASE * 0.77,
    },
    image: {
        width: NowTheme.SIZES.HEIGHT_BASE * 0.35, height: NowTheme.SIZES.HEIGHT_BASE * 0.35
    },
    finishStepViewContainer: {
        height: NowTheme.SIZES.HEIGHT_BASE * 0.6,
        marginHorizontal: 20,
        justifyContent: 'center',
    }
});
