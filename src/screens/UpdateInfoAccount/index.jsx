import {
    CenterLoader, CustomButton, CustomInput, CustomModal, CustomText, OptionItem, RadioButton, CustomCheckbox
} from '@components/uiComponents';
import { Images, Interests, Theme } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import ValidationHelpers from '@helpers/ValidationHelpers';
import { setCurrentUser, setPersonTabActiveIndex } from '@redux/Actions';
import { UserServices } from '@services/index';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImageScalable from 'react-native-scalable-image';
import { useDispatch, useSelector } from 'react-redux';
import MediaHelpers from '@helpers/MediaHelpers';
import { HOST_CONTENT } from '@constants/HostContent';

const { SIZES, COLORS, FONT: { TEXT_BOLD, TEXT_REGULAR } } = Theme;

export default function UpdateInfoAccount() {
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const [newUser, setNewUser] = useState({});
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    // const [listInterest, setListInterest] = useState();
    const [listInterestSelected, setListInterestSelected] = useState(Interests);
    const [isModalMessengerVisible, setIsModalMessengerVisible] = useState(false);
    const [isModalSkypeVisible, setIsModalSkypeVisible] = useState(false);
    const [isModalZaloVisible, setIsModalZaloVisible] = useState(false);
    const [isModalInviteCoffeeVisible, setModalInviteCoffeeVisible] = useState(false);
    const [isAcceptInviteCoffeeVisible, setAcceptInviteCoffeeVisible] = useState(currentUser.isHost);
    const [imageUrl, setImageUrl] = useState(currentUser.imageUrl);
    const [imagePath, setImagePath] = useState(currentUser.imageUrl);


    const dispatch = useDispatch();

    useEffect(
        () => {
            setNewUser({ ...currentUser, isMale: currentUser.isMale });
            handleListInterestFromAPI();
        }, []
    );

    const onChangeName = (nameInput) => {
        setNewUser({ ...newUser, fullName: nameInput });
    };

    const onChangeHometown = (hometownInput) => {
        setNewUser({ ...newUser, homeTown: hometownInput });
    };

    // const onChangeInterests = (interestsInput) => {
    //     setNewUser({ ...newUser, interests: interestsInput });
    // };

    const onChangeDescription = (descriptionInput) => {
        setNewUser({ ...newUser, description: descriptionInput });
    };

    const createInterestStr = () => {
        let interestStr = '';

        listInterestSelected.forEach((item) => {
            if (item.selected) {
                interestStr += `${item.value}, `;
            }
        });

        return interestStr;
    };

    const renderInputName = () => (
        <CustomInput
            value={newUser.fullName}
            inputStyle={{ width: 280 }}
            onChangeText={(input) => onChangeName(input)}
            containerStyle={{
                marginVertical: 5,
                width: SIZES.WIDTH_BASE * 0.9,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}
            autoCapitalize
            label="Họ Tên"
        />
    );

    const renderInputPhone = () => (
        <CustomInput
            value={newUser.phoneNum}
            inputStyle={{ width: 280 }}
            onChangeText={(input) => setNewUser({ ...newUser, phoneNum: input })}
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}
            keyboardType="number-pad"
            label="SĐT"
        />
    );

    const renderInputHometown = () => (
        <CustomInput
            value={newUser.homeTown}
            onChangeText={(input) => onChangeHometown(input)}
            containerStyle={{
                width: SIZES.WIDTH_BASE * 0.9,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}
            inputStyle={{ width: 280 }}
            autoCapitalize
            label="Nơi ở"
        />
    );

    const renderInputZalo = () => (
        <TouchableOpacity
            onPress={() => {
                setIsModalZaloVisible(true);
            }}
        >
            <CustomInput
                value={newUser.zalo}
                onChangeText={(input) => setNewUser({ ...newUser, zalo: input })}
                inputStyle={{ width: 200 }}
                containerStyle={{
                    width: SIZES.WIDTH_BASE * 0.9,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}
                label="Zalo Username"
            />
        </TouchableOpacity>
    );

    const renderInputSkype = () => (
        <TouchableOpacity
            onPress={() => {
                setIsModalSkypeVisible(true);
            }}
        >
            <CustomInput
                value={newUser.skype}
                onChangeText={(input) => setNewUser({ ...newUser, skype: input })}
                inputStyle={{ width: 200 }}
                containerStyle={{
                    marginVertical: 10,
                    width: SIZES.WIDTH_BASE * 0.9,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}
                label="Skype Id"
            />
        </TouchableOpacity>
    );

    const renderInputMessenger = () => (
        <TouchableOpacity
            onPress={() => {
                setIsModalMessengerVisible(true);
            }}
        >
            <CustomInput
                value={newUser.facebook}
                onChangeText={(input) => setNewUser({ ...newUser, facebook: input })}
                inputStyle={{ width: 200 }}
                containerStyle={{
                    width: SIZES.WIDTH_BASE * 0.9,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}
                label="Facebook Id"
            />
        </TouchableOpacity>
    );

    // const renderInputInterests = () => (
    //     <CustomInput
    //         value={newUser.interests}
    //         onChangeText={(input) => onChangeInterests(input)}
    //         containerStyle={{
    //             marginVertical: 10,
    //             width: SIZES.WIDTH_BASE * 0.9
    //         }}
    //         label="Sở thích:"
    //     />
    // );

    const handlePressInterest = (index) => {
        const list = [...listInterestSelected];
        list[index].selected = !list[index].selected;
        setListInterestSelected(list);
    };

    const handleListInterestFromAPI = () => {
        const list = currentUser?.interests ? currentUser.interests.split(', ') : [];

        if (list.length === 0) {
            return;
        }

        list.splice(list.length - 1, 1);
        const listResult = [...listInterestSelected];

        list.forEach((itemFromAPI) => {
            listResult.forEach((item, index) => {
                if (itemFromAPI === item.value) {
                    listResult[index].selected = true;
                }
            });
        });

        setListInterestSelected(listResult);
    };

    const renderOptionInterests = () => (
        <View
            style={{
                alignItems: 'flex-start',
                width: SIZES.WIDTH_BASE * 0.9,
                marginTop: 10
            }}
        >
            <CustomText
                text="Sở thích:*"
                style={{
                    color: COLORS.ACTIVE,
                    fontSize: SIZES.FONT_H3,
                }}
            />
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    flexWrap: 'wrap'
                }}
            >
                {listInterestSelected.map((item, index) => (
                    <OptionItem
                        item={item}
                        index={index}
                        handlePressItem={() => {
                            handlePressInterest(index);
                        }}
                        isSelected={item.selected}
                    />
                ))}
            </View>
        </View>
    );

    const renderInputDescription = () => (
        <CustomInput
            multiline
            value={newUser.description}
            onChangeText={(input) => onChangeDescription(input)}

            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            autoCapitalize
            label="Mô tả ngắn"
        />
    );

    const renderInputHeightWeight = () => (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 10,
                width: '90%'
            }}
        >

            <View>
                <CustomText
                    style={{
                        color: COLORS.ACTIVE,
                        marginBottom: 5
                    }}
                    text="Cao (cm)"
                />
                <CustomInput
                    inputStyle={{
                        width: SIZES.WIDTH_BASE * 0.44
                    }}
                    onChangeText={(input) => setNewUser({ ...newUser, height: input })}
                    value={newUser.height}
                    keyboardType="number-pad"
                />
            </View>

            <View>
                <CustomText
                    style={{
                        color: COLORS.ACTIVE,
                        marginBottom: 5
                    }}
                    text="Nặng (kg)"
                />
                <CustomInput
                    inputStyle={{
                        width: SIZES.WIDTH_BASE * 0.44
                    }}
                    onChangeText={(input) => setNewUser({ ...newUser, weight: input })}
                    value={newUser.weight}
                    keyboardType="number-pad"
                />
            </View>
        </View>
    );

    const renderDobGender = () => (
        <View
        // style={{
        //     flexDirection: 'row',
        //     justifyContent: 'space-between',
        //     alignItems: 'center',
        //     marginVertical: 10,
        //     width: '90%',
        // }}
        >
            <CustomInput
                inputStyle={{
                    width: SIZES.WIDTH_BASE * 0.44
                }}
                containerStyle={{
                    width: SIZES.WIDTH_BASE * 0.9,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}
                onChangeText={(input) => onChangeYear(input)}
                value={newUser?.dob?.substr(0, 4)}
                label="Năm Sinh"
                keyboardType="number-pad"
            />

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: SIZES.WIDTH_BASE * 0.44,
                marginTop: 10
            }}
            >
                <RadioButton
                    label="Nam"
                    selected={newUser.isMale}
                    onPress={() => setNewUser({ ...newUser, isMale: true })}
                />
                <RadioButton
                    label="Nữ"
                    selected={!newUser.isMale}
                    onPress={() => setNewUser({ ...newUser, isMale: false })}
                />
            </View>
        </View>
    );

    const onChangeYear = (yearInput) => {
        setNewUser({ ...newUser, dob: yearInput });
    };

    const renderButtonPanel = () => (
        <View
            style={{
                paddingTop: 10,
                paddingBottom: 20,
            }}
        >
            <CustomButton
                onPress={() => onSubmitUpdateInfo()}
                type="active"
                label="Xác nhận"
                buttonStyle={{
                    width: SIZES.WIDTH_BASE * 0.9
                }}
            />
        </View>
    );

    const validate = () => {
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
                fieldName: 'Số điện thoại',
                input: newUser.phoneNum,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 12,
                    },
                }
            },
            {
                fieldName: 'Năm sinh',
                input: newUser.dob.length > 0 ? newUser.dob.substr(0, 4) : newUser.dob,
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
                fieldName: 'Cao',
                input: newUser.height,
                validate: {
                    required: {
                        value: true,
                    },
                }
            },
            {
                fieldName: 'Nặng',
                input: newUser.weight,
                validate: {
                    required: {
                        value: true,
                    },
                }
            },
            {
                fieldName: 'Sở thích',
                input: createInterestStr(),
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
                fieldName: 'Nơi ở',
                input: newUser.homeTown,
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

    const onChooseImage = () => {
        MediaHelpers.pickImage(
            false,
            [4, 3],
            (result) => {
                setImagePath(result.uri);
            },
            0.6
        );
        // upload image after choose. should do spin & upload only when user click button
        MediaHelpers.imgbbUploadImage(
            imagePath,
            async (res) => {
                setImageUrl(res.data.url);
            },
        );
    }

    const checkBoxLetOtherInviteCoffee = () => {
        return (
            <View
                style={{
                    paddingTop: 10,
                }}
            >
                <CustomCheckbox
                    label="Trở thành HOST"
                    onPressLabel={() => {
                        setModalInviteCoffeeVisible(true);
                    }}
                    isChecked={isAcceptInviteCoffeeVisible}
                    onChange={() => {
                        if (!isAcceptInviteCoffeeVisible) {
                            setModalInviteCoffeeVisible(true);
                        }
                        setAcceptInviteCoffeeVisible(!isAcceptInviteCoffeeVisible)
                    }}
                />
                {renderImageUrl()}
            </View>
        )
    }

    const renderImageUrl = () => {
        return (
            isAcceptInviteCoffeeVisible &&
            <View
                style={{
                    marginTop: 10,
                    alignSelf: 'center'
                }}
            >
                <CustomButton
                    onPress={() => onChooseImage()}
                    type="active"
                    label='Chọn ảnh'
                    buttonStyle={{
                        width: SIZES.WIDTH_BASE * 0.9,
                    }}
                    labelStyle={{
                        fontFamily: TEXT_REGULAR,
                        fontSize: SIZES.FONT_H4
                    }}
                />
                <View
                    style={{
                        marginTop: 10,
                        alignSelf: 'center'
                    }}
                >
                    <ImageScalable
                        style={{
                            zIndex: 99
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                        source={{ uri: imagePath }}
                    />
                </View>
            </View>

        );
    };

    const validateYearsOld = (dob) => {
        const dateString = moment(dob).format('YYYY-MM-DD');
        const years = moment().diff(dateString, 'years');

        return !(years < 16);
    };

    const onSubmitUpdateInfo = async () => {
        if (!validate()) {
            return;
        }

        let body = {
            ...newUser,
            email: currentUser.userName,
            IsMale: newUser.isMale,
            interests: createInterestStr(),
            isHost: isAcceptInviteCoffeeVisible,
            imageUrl: imageUrl
        };

        setIsShowSpinner(true);

        const result = await UserServices.submitUpdateInfoAsync(body);
        const { data } = result;

        if (data) {
            dispatch(setCurrentUser(data.data));
            dispatch(setPersonTabActiveIndex(0));
            setNewUser(data.data);
            ToastHelpers.renderToast(data.message, 'success');
        }
        setIsShowSpinner(false);
    };

    const renderModalGuideMessenger = () => (
        <CustomModal
            modalVisible={isModalMessengerVisible}
            renderContent={() => (
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.9
                    }}
                >
                    <CustomText
                        text="Mở ứng dụng Facebook:"
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <ImageScalable
                        source={Images.Mess1}
                        style={{
                            zIndex: 99,
                            marginBottom: 10
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <CustomText
                        text="Chọn account:"
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <ImageScalable
                        source={Images.Mess2}
                        style={{
                            zIndex: 99,
                            marginBottom: 10
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <CustomText
                        text="Chọn chi tiết:"
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <ImageScalable
                        source={Images.Mess3}
                        style={{
                            zIndex: 99,
                            marginBottom: 10
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <CustomText
                        text='Chọn "Sao chép liên kết":'
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <ImageScalable
                        source={Images.Mess4}
                        style={{
                            zIndex: 99,
                            marginBottom: 10
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <CustomText
                        text="Dán liên kết vào ô nhập:"
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <ImageScalable
                        source={Images.Mess5}
                        style={{
                            zIndex: 99,
                            marginBottom: 10
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <CustomText
                        text='Xoá "https://www.facebook.com/":'
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <ImageScalable
                        source={Images.Mess6}
                        style={{
                            zIndex: 99,
                            marginBottom: 10
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <View>
                        <CustomButton
                            onPress={() => setIsModalMessengerVisible(false)}
                            buttonStyle={{ width: SIZES.WIDTH_BASE * 0.8 }}
                            type="active"
                            label="Đã hiểu"
                        />
                    </View>
                </View>
            )}
        />
    );

    const renderModalGuideSkype = () => (
        <CustomModal
            modalVisible={isModalSkypeVisible}
            renderContent={() => (
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.9
                    }}
                >
                    <CustomText
                        text="Mở ứng dụng Skype:"
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <ImageScalable
                        source={Images.Skype1}
                        style={{
                            zIndex: 99,
                            marginBottom: 10
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <CustomText
                        text="Chọn account:"
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <ImageScalable
                        source={Images.Skype2}
                        style={{
                            zIndex: 99,
                            marginBottom: 10
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <CustomText
                        text='Chọn "Hồ sơ Skype":'
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <ImageScalable
                        source={Images.Skype3}
                        style={{
                            zIndex: 99,
                            marginBottom: 10
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <CustomText
                        text='Chọn "Tên Skype":'
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <ImageScalable
                        source={Images.Skype4}
                        style={{
                            zIndex: 99,
                            marginBottom: 10
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <CustomText
                        text='Chọn "Sao chép":'
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <ImageScalable
                        source={Images.Skype5}
                        style={{
                            zIndex: 99,
                            marginBottom: 10
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <CustomText
                        text="Dán tên Skype đã sao chép vào ô nhập:"
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <ImageScalable
                        source={Images.Skype6}
                        style={{
                            zIndex: 99,
                            marginBottom: 10
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <View>
                        <CustomButton
                            onPress={() => setIsModalSkypeVisible(false)}
                            buttonStyle={{ width: SIZES.WIDTH_BASE * 0.8 }}
                            type="active"
                            label="Đã hiểu"
                        />
                    </View>
                </View>
            )}
        />
    );

    const renderModalGuideZalo = () => (
        <CustomModal
            modalVisible={isModalZaloVisible}
            renderContent={() => (
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.9
                    }}
                >
                    <CustomText
                        text="Mở ứng dụng Zalo chọn vào cá nhân"
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <ImageScalable
                        source={Images.Zalo1}
                        style={{
                            zIndex: 99,
                            marginBottom: 10
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <CustomText
                        text="Xem trang cá nhân"
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <ImageScalable
                        source={Images.Zalo2}
                        style={{
                            zIndex: 99,
                            marginBottom: 10
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <CustomText
                        text='Chọn vào dấu 3 chấm góc phải'
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <ImageScalable
                        source={Images.Zalo3}
                        style={{
                            zIndex: 99,
                            marginBottom: 10
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <CustomText
                        text='Chọn "Thôn tin"'
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <ImageScalable
                        source={Images.Zalo4}
                        style={{
                            zIndex: 99,
                            marginBottom: 10
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <CustomText
                        text='Username chính là zalo Id. Nếu chưa có bạn có thể tạo'
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <ImageScalable
                        source={Images.Zalo5}
                        style={{
                            zIndex: 99,
                            marginBottom: 10
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <CustomText
                        text="Copy Username và đưa vào Zalo Id"
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <View>
                        <CustomButton
                            onPress={() => setIsModalZaloVisible(false)}
                            buttonStyle={{ width: SIZES.WIDTH_BASE * 0.8 }}
                            type="active"
                            label="Đã hiểu"
                        />
                    </View>
                </View>
            )}
        />
    );

    const renderModalInviteCoffee = () => (
        <CustomModal
            modalVisible={isModalInviteCoffeeVisible}
            renderContent={() => (
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.9
                    }}
                >
                    <CustomText
                        text="Lưu ý"
                        style={{
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H3,
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                    />

                    <Text style={{
                        fontSize: SIZES.FONT_H4,
                        marginLeft: 10,
                        marginRight: 10,
                        fontFamily: TEXT_REGULAR,
                        color: COLORS.DEFAULT
                    }}>
                        {HOST_CONTENT}
                    </Text>

                    <View>
                        <CustomButton
                            onPress={() => {
                                setModalInviteCoffeeVisible(false);
                                setAcceptInviteCoffeeVisible(true);
                            }}
                            buttonStyle={{ width: SIZES.WIDTH_BASE * 0.8 }}
                            type="active"
                            label="Đã hiểu"
                        />
                    </View>
                </View>
            )}
        />
    );

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
                                {renderInputName()}
                                {renderInputPhone()}
                                {renderDobGender()}
                                {renderInputHeightWeight()}
                                {renderInputHometown()}
                                {checkBoxLetOtherInviteCoffee()}
                                {/* {renderInputInterests()} */}
                                {renderOptionInterests()}
                                {renderInputDescription()}
                                {renderInputZalo()}
                                {renderInputSkype()}
                                {renderInputMessenger()}
                                {renderButtonPanel()}
                            </>
                        )}
                        {renderModalGuideMessenger()}
                        {renderModalGuideSkype()}
                        {renderModalGuideZalo()}
                        {renderModalInviteCoffee()}
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
