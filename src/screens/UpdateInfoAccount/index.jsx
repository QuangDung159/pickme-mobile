/* eslint-disable no-unused-vars */
import {
    CenterLoader, CustomButton, CustomCheckbox, CustomInput, CustomModal, CustomText, OptionItem
} from '@components/uiComponents';
import { HOST_CONTENT } from '@constants/HostContent';
import { Images, Interests, Theme } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import MediaHelpers from '@helpers/MediaHelpers';
import ValidationHelpers from '@helpers/ValidationHelpers';
import { setCurrentUser, setPersonTabActiveIndex } from '@redux/Actions';
import { UserServices } from '@services/index';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImageScalable from 'react-native-scalable-image';
import { useDispatch, useSelector } from 'react-redux';

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
            inputStyle={{ width: SIZES.WIDTH_BASE * 0.65 }}
            onChangeText={(input) => onChangeName(input)}
            containerStyle={{
                width: SIZES.WIDTH_BASE * 0.9,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 15
            }}
            autoCapitalize
            label="Họ tên:"
            maxLength={35}
        />
    );

    const renderInputPhone = () => (
        <CustomInput
            value={newUser.phoneNum}
            inputStyle={{ width: SIZES.WIDTH_BASE * 0.65 }}
            onChangeText={(input) => setNewUser({ ...newUser, phoneNum: input })}
            containerStyle={{
                width: SIZES.WIDTH_BASE * 0.9,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10
            }}
            keyboardType="number-pad"
            label="SĐT:"
            maxLength={12}
        />
    );

    const renderInputHometown = () => (
        <CustomInput
            value={newUser.homeTown}
            onChangeText={(input) => onChangeHometown(input)}
            containerStyle={{
                width: SIZES.WIDTH_BASE * 0.9,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10
            }}
            inputStyle={{ width: SIZES.WIDTH_BASE * 0.65 }}
            autoCapitalize
            label="Nơi ở:"
            maxLength={35}
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
                inputStyle={{ width: SIZES.WIDTH_BASE * 0.48 }}
                containerStyle={{
                    width: SIZES.WIDTH_BASE * 0.9,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
                label="Zalo Username:"
                maxLength={35}
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
                inputStyle={{ width: SIZES.WIDTH_BASE * 0.48 }}
                containerStyle={{
                    marginVertical: 10,
                    width: SIZES.WIDTH_BASE * 0.9,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
                label="Skype Id:"
                maxLength={35}
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
                inputStyle={{ width: SIZES.WIDTH_BASE * 0.48 }}
                containerStyle={{
                    width: SIZES.WIDTH_BASE * 0.9,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
                label="Facebook Id:"
                maxLength={100}
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
                text="Sở thích:"
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
                        containerStyle={{
                            marginBottom: 10
                        }}
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
                width: SIZES.WIDTH_BASE * 0.9,
            }}
            inputStyle={{
                height: 60
            }}
            autoCapitalize
            label="Mô tả ngắn:"
            maxLength={100}
        />
    );

    const renderInputHeight = () => (
        <CustomInput
            inputStyle={{ width: SIZES.WIDTH_BASE * 0.65 }}
            label="Chiều cao:"
            onChangeText={(input) => setNewUser({ ...newUser, height: input })}
            value={newUser.height}
            keyboardType="number-pad"
            maxLength={3}
            containerStyle={{
                width: SIZES.WIDTH_BASE * 0.9,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10
            }}
        />
    );

    const renderInputWeight = () => (
        <CustomInput
            inputStyle={{ width: SIZES.WIDTH_BASE * 0.65 }}
            label="Cân nặng:"
            onChangeText={(input) => setNewUser({ ...newUser, weight: input })}
            value={newUser.weight}
            keyboardType="number-pad"
            maxLength={3}
            containerStyle={{
                width: SIZES.WIDTH_BASE * 0.9,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10
            }}
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
                    text="Chiều cao:"
                />
                <CustomInput
                    inputStyle={{
                        width: SIZES.WIDTH_BASE * 0.44
                    }}
                    onChangeText={(input) => setNewUser({ ...newUser, height: input })}
                    value={newUser.height}
                    keyboardType="number-pad"
                    maxLength={3}
                />
            </View>

            <View>
                <CustomText
                    style={{
                        color: COLORS.ACTIVE,
                        marginBottom: 5
                    }}
                    text="Cân nặng:"
                />
                <CustomInput
                    inputStyle={{
                        width: SIZES.WIDTH_BASE * 0.44
                    }}
                    onChangeText={(input) => setNewUser({ ...newUser, weight: input })}
                    value={newUser.weight}
                    keyboardType="number-pad"
                    maxLength={3}
                />
            </View>
        </View>
    );

    const renderDOB = () => (
        <CustomInput
            inputStyle={{ width: SIZES.WIDTH_BASE * 0.65 }}
            containerStyle={{
                width: SIZES.WIDTH_BASE * 0.9,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10
            }}
            onChangeText={(input) => onChangeYear(input)}
            value={newUser?.dob?.substr(0, 4)}
            label="Năm Sinh:"
            keyboardType="number-pad"
            maxLength={4}
        />
    );

    const renderGender = () => (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: SIZES.WIDTH_BASE * 0.9,
            marginTop: 10,
        }}
        >
            <CustomText
                style={{
                    color: COLORS.ACTIVE,
                }}
                text="Giới tính:"
            />
            <View
                style={{
                    width: SIZES.WIDTH_BASE * 0.65,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <OptionItem
                    item={{ value: 'Nam' }}
                    index={0}
                    handlePressItem={() => setNewUser({ ...newUser, isMale: true })}
                    isSelected={newUser.isMale}
                    containerStyle={{
                        width: '49%',
                        marginBottom: 0
                    }}
                    titleStyle={{
                        fontFamily: TEXT_BOLD,
                        textAlign: 'center'
                    }}
                />
                <OptionItem
                    item={{ value: 'Nữ' }}
                    index={1}
                    handlePressItem={() => setNewUser({ ...newUser, isMale: false })}
                    isSelected={!newUser.isMale}
                    containerStyle={{
                        width: '49%',
                        marginRight: 0,
                        marginBottom: 0
                    }}
                    titleStyle={{
                        fontFamily: TEXT_BOLD,
                        textAlign: 'center'
                    }}
                />
            </View>
        </View>
    );

    // const renderDobGender = () => (
    //     <View>
    //         <CustomInput
    //             inputStyle={{
    //                 width: SIZES.WIDTH_BASE * 0.44
    //             }}
    //             containerStyle={{
    //                 width: SIZES.WIDTH_BASE * 0.9,
    //                 flexDirection: 'row',
    //                 justifyContent: 'space-between',
    //                 alignItems: 'center'
    //             }}
    //             onChangeText={(input) => onChangeYear(input)}
    //             value={newUser?.dob?.substr(0, 4)}
    //             label="Năm Sinh:"
    //             keyboardType="number-pad"
    //         />

    //         <View style={{
    //             flexDirection: 'row',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //             width: SIZES.WIDTH_BASE * 0.9,
    //             marginTop: 10
    //         }}
    //         >

    //             <OptionItem
    //                 item={{ value: 'Nam' }}
    //                 index={0}
    //                 handlePressItem={() => setNewUser({ ...newUser, isMale: true })}
    //                 isSelected={newUser.isMale}
    //                 containerStyle={{
    //                     width: SIZES.WIDTH_BASE * 0.44
    //                 }}
    //                 titleStyle={{
    //                     fontFamily: TEXT_BOLD,
    //                     textAlign: 'center'
    //                 }}
    //             />
    //             <OptionItem
    //                 item={{ value: 'Nữ' }}
    //                 index={1}
    //                 handlePressItem={() => setNewUser({ ...newUser, isMale: false })}
    //                 isSelected={!newUser.isMale}
    //                 containerStyle={{
    //                     width: SIZES.WIDTH_BASE * 0.44,
    //                     marginRight: 0
    //                 }}
    //                 titleStyle={{
    //                     fontFamily: TEXT_BOLD,
    //                     textAlign: 'center'
    //                 }}
    //             />
    //         </View>
    //     </View>
    // );

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
    };

    // eslint-disable-next-line no-unused-vars
    const checkBoxLetOtherInviteCoffee = () => (
        <View
            style={{
                paddingBottom: 10,
            }}
        >
            <CustomCheckbox
                label="Tôi muốn trở thành Host"
                onPressLabel={() => {
                    setModalInviteCoffeeVisible(true);
                }}
                isChecked={isAcceptInviteCoffeeVisible}
                onChange={() => {
                    if (!isAcceptInviteCoffeeVisible) {
                        setModalInviteCoffeeVisible(true);
                    }
                    setAcceptInviteCoffeeVisible(!isAcceptInviteCoffeeVisible);
                }}
            />
            {renderImageUrl()}
        </View>
    );

    const renderImageUrl = () => (
        isAcceptInviteCoffeeVisible
            && (
                <View
                    style={{
                        marginTop: 10,
                        alignSelf: 'center'
                    }}
                >
                    <CustomButton
                        onPress={() => onChooseImage()}
                        type="active"
                        label="Chọn ảnh"
                        buttonStyle={{
                            width: SIZES.WIDTH_BASE * 0.9,
                        }}
                    />
                    <View
                        style={{
                            marginTop: 10,
                            alignSelf: 'center'
                        }}
                    >
                        {imagePath ? (
                            <ImageScalable
                                style={{
                                    zIndex: 99
                                }}
                                width={SIZES.WIDTH_BASE * 0.9}
                                source={{ uri: imagePath }}
                            />
                        ) : (
                            <View
                                style={{
                                    alignItems: 'center',
                                    marginVertical: 5
                                }}
                            >
                                <CustomText text="Chưa có ảnh" />
                            </View>
                        )}

                    </View>
                </View>
            )
    );

    const validateYearsOld = (dob) => {
        const dateString = moment(dob).format('YYYY-MM-DD');
        const years = moment().diff(dateString, 'years');

        return !(years < 16);
    };

    const uploadImage = (callback) => {
        MediaHelpers.imgbbUploadImage(
            imagePath,
            async (res) => callback(res),
        );
    };

    const submitUpdateInfo = async (url) => {
        const body = {
            ...newUser,
            email: currentUser.userName,
            IsMale: newUser.isMale,
            interests: createInterestStr(),
            isHost: isAcceptInviteCoffeeVisible,
            imageUrl: url
        };

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

    const onSubmitUpdateInfo = async () => {
        if (!validate()) {
            return;
        }

        setIsShowSpinner(true);
        uploadImage((image) => submitUpdateInfo(image.data.url));
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
                        text="Chọn vào dấu 3 chấm góc phải"
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
                        text="Username chính là zalo Id. Nếu chưa có bạn có thể tạo"
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
                    }}
                    >
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
                                {renderInputHometown()}
                                {renderInputHeight()}
                                {renderInputWeight()}
                                {/* {renderInputHeightWeight()} */}
                                {renderGender()}
                                {renderDOB()}
                                {/* {renderDobGender()} */}
                                {/* {renderInputInterests()} */}
                                {renderOptionInterests()}
                                {renderInputDescription()}
                                {checkBoxLetOtherInviteCoffee()}
                                {/* {renderInputZalo()}
                                {renderInputSkype()}
                                {renderInputMessenger()} */}
                                {renderButtonPanel()}
                            </>
                        )}
                        {/* {renderModalGuideMessenger()}
                        {renderModalGuideSkype()}
                        {renderModalGuideZalo()} */}
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
