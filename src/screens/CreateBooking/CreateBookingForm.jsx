/* eslint-disable max-len */
import { CustomCalendar } from '@components/businessComponents';
import {
    CustomButton, CustomInput, CustomText, OptionItem
} from '@components/uiComponents';
import {
    BookingNoteOptions, BookingTypes, OutsideApp, Theme, ScreenName
} from '@constants/index';
import ToastHelpers from '@helpers/ToastHelpers';
import moment from 'moment';
import React, { useState } from 'react';
import {
    Alert,
    Platform, StyleSheet, Text, View
} from 'react-native';
import { useSelector } from 'react-redux';

const {
    FONT: {
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

const {
    SKYPE,
    ZALO,
    MESSENGER,
    GAMING
} = OutsideApp;

export default function CreateBookingForm({
    route,
    busyCalendar,
    selectedDate,
    setSelectedDate,
    setListBusyBySelectedDate,
    hourArr,
    startTimeStr,
    setStartHourActive,
    minuteArr,
    setStartMinuteActive,
    endTimeStr,
    setEndHourActive,
    setEndMinuteActive,
    setModalTimePickerVisible,
    setModalActiveType,
    // listPartnerPackage,
    // setModalPartnerPackageVisible,
    booking,
    setBooking,
    partner,
    navigation
}) {
    const [listNoteOptions, setListNoteOptions] = useState(BookingNoteOptions);
    const [isShowNoteInput, setIsShowNoteInput] = useState(false);
    const [listBookingTypes] = useState(BookingTypes);
    const [isShowInputOptions, setIsShowInputOptions] = useState(true);
    const [isShowAddress, setIsShowAddress] = useState(true);
    const [selectedBookingType, setSelectedBookingType] = useState(BookingTypes[0]);

    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const onChangeDateCalendar = (date) => {
        const result = busyCalendar.find(
            (item) => date === moment(item.date).format('DD-MM-YYYY')
        );

        setSelectedDate(date);
        setListBusyBySelectedDate(result ? result.details : []);
    };

    const onChangeAddress = (input) => {
        setBooking({
            ...booking,
            address: input,
            longtitude: 0,
            latitude: 0
        });
    };

    const onChangeNote = (input) => {
        setBooking({
            ...booking,
            noted: input,
        });
    };

    const getPlatformId = (bookingType) => {
        switch (bookingType.key) {
            case SKYPE.key: {
                return `${SKYPE.deepLink}${currentUser.skype}`;
            }
            case ZALO.key: {
                return `${ZALO.deepLink}${currentUser.zalo}`;
            }
            case GAMING.key: {
                return `${GAMING.deepLink}`;
            }
            default: {
                return `${MESSENGER.deepLink}${currentUser.facebook}`;
            }
        }
    };

    const onClickTriggerTimePicker = (modalType) => {
        if (modalType === 'start') {
            const hourIndex = hourArr.findIndex((item) => item === startTimeStr.split(':')[0]);
            setStartHourActive(hourIndex);

            const minuteIndex = minuteArr.findIndex((item) => item === startTimeStr.split(':')[1]);
            setStartMinuteActive(minuteIndex);
        } else {
            const hourIndex = hourArr.findIndex((item) => item === endTimeStr.split(':')[0]);
            setEndHourActive(hourIndex);

            const minuteIndex = minuteArr.findIndex((item) => item === endTimeStr.split(':')[1]);
            setEndMinuteActive(minuteIndex);
        }
    };

    const renderButtonTimePicker = () => (
        <>
            <View
                style={{
                    width: SIZES.WIDTH_BASE * 0.9,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 5
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <CustomText
                        style={{
                            color: COLORS.ACTIVE,
                            marginRight: 5
                        }}
                        text="Bắt đầu:"
                    />
                    <CustomButton
                        onPress={() => {
                            setModalTimePickerVisible(true);
                            setModalActiveType('start');
                            onClickTriggerTimePicker('start');
                        }}
                        type="active"
                        label={startTimeStr}
                        buttonStyle={{
                            width: 80
                        }}
                    />
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <CustomText
                        style={{
                            color: COLORS.ACTIVE,
                            marginRight: 5
                        }}
                        text="Kết thúc:"
                    />
                    <CustomButton
                        onPress={() => {
                            setModalActiveType('end');
                            setModalTimePickerVisible(true);
                            onClickTriggerTimePicker('end');
                        }}
                        type="active"
                        label={endTimeStr}
                        buttonStyle={{
                            width: 80
                        }}
                    />

                </View>

                {/* {renderIconShowModal()} */}
            </View>
        </>
    );

    const handlePressNoteOption = (index) => {
        const list = [...listNoteOptions];

        if (index === listNoteOptions.length - 1) {
            setIsShowNoteInput(true);
            const listTemp = [];

            list.forEach((item) => {
                listTemp.push({
                    ...item,
                    selected: false
                });
            });

            setListNoteOptions(listTemp);
            setBooking({
                ...booking,
                noted: '',
            });
            return;
        }
        setIsShowNoteInput(false);

        list[index].selected = !list[index].selected;
        setListNoteOptions(list);

        let noteStr = '';
        list.forEach((item) => {
            if (item.selected) {
                noteStr += `${item.value}, `;
            }
        });

        const noteArr = noteStr.split(', ');
        if (noteArr.length > 0) {
            noteArr.splice(noteArr.length - 1, 1);
        }

        const result = noteArr.join(', ');

        setBooking({
            ...booking,
            noted: result,
        });
    };

    const handlePressBookingType = (typeObj) => {
        if (typeObj.type === 'online') {
            if (typeObj.key === OutsideApp.SKYPE.key) {
                if (!currentUser.skype) {
                    Alert.alert('', 'Để thuận tiện cho việc thực hiện cuộc hẹn, bạn có thể cung cấp thông tin SkypeID trong phần cập nhật thông tin cá nhân', [
                        {
                            text: 'Cập nhật thông tin',
                            style: 'cancel',
                            onPress: () => navigation.navigate(
                                ScreenName.UPDATE_INFO_ACCOUNT
                            )
                        },
                        {
                            text: 'Tiếp tục'
                        },
                    ]);
                }
            }

            if (typeObj.key === OutsideApp.ZALO.key) {
                if (!currentUser.zalo) {
                    Alert.alert('', 'Để thuận tiện cho việc thực hiện cuộc hẹn, bạn có thể cung cấp thông tin Zalo trong phần cập nhật thông tin cá nhân', [
                        {
                            text: 'Cập nhật thông tin',
                            style: 'cancel',
                            onPress: () => navigation.navigate(
                                ScreenName.UPDATE_INFO_ACCOUNT
                            )
                        },
                        {
                            text: 'Tiếp tục'
                        },
                    ]);
                }
            }

            if (typeObj.key === OutsideApp.MESSENGER.key) {
                if (!currentUser.facebook) {
                    Alert.alert('', 'Để thuận tiện cho việc thực hiện cuộc hẹn, bạn có thể cung cấp thông tin SkypeID trong phần cập nhật thông tin cá nhân', [
                        {
                            text: 'Cập nhật thông tin',
                            style: 'cancel',
                            onPress: () => navigation.navigate(
                                ScreenName.UPDATE_INFO_ACCOUNT
                            )
                        },
                        {
                            text: 'Tiếp tục'
                        },
                    ]);
                }
            }
        }
        setSelectedBookingType(typeObj);

        if (typeObj.type === 'online') {
            setIsShowNoteInput(true);
            setIsShowInputOptions(false);
            setBooking({
                ...booking,
                noted: '',
                isOnline: true,
                address: getPlatformId(typeObj)
            });
            setIsShowAddress(false);
        } else {
            setIsShowNoteInput(false);
            setIsShowInputOptions(true);
            setIsShowAddress(true);
            setBooking({
                ...booking,
                isOnline: false,
                address: ''
            });
        }
    };

    const handleShowOnlineOption = () => {
        console.log('partner :>> ', partner);
        return (
            <>
                {listBookingTypes.map((item, index) => {
                    if (partner.isDatingOffline && item.key === 'truc_tiep') {
                        return (
                            <OptionItem
                                item={item}
                                index={index}
                                handlePressItem={() => {
                                    handlePressBookingType(item);
                                }}
                                isSelected={selectedBookingType.key === item.key}
                            />
                        );
                    }

                    if (partner.isDatingOnline) {
                        // if ((currentUser.skype && item.key === SKYPE.key)
                        //     || (currentUser.facebook && item.key === MESSENGER.key)
                        //     || (currentUser.zalo && item.key === ZALO.key)
                        // ) {
                        //     return (
                        //         <OptionItem
                        //             item={item}
                        //             index={index}
                        //             handlePressItem={() => {
                        //                 handlePressBookingType(item);
                        //             }}
                        //             isSelected={selectedBookingType.key === item.key}
                        //         />
                        //     );
                        // }

                        // if (item.key === 'choi_game') {
                        //     return (
                        //         <OptionItem
                        //             item={item}
                        //             index={index}
                        //             handlePressItem={() => {
                        //                 handlePressBookingType(item);
                        //             }}
                        //             isSelected={selectedBookingType.key === item.key}
                        //         />
                        //     );
                        // }

                        return (
                            <OptionItem
                                item={item}
                                index={index}
                                handlePressItem={() => {
                                    handlePressBookingType(item);
                                }}
                                isSelected={selectedBookingType.key === item.key}
                            />
                        );
                    }

                    return <></>;
                })}
            </>
        );
    };

    // if (!currentUser.facebook && !currentUser.zalo && !currentUser.skype) {
    //     return <></>;
    // }
    const renderBookingTypes = () => (
        <>
            <CustomText
                text="Hình thức:"
                style={{
                    color: COLORS.ACTIVE,
                    fontSize: SIZES.FONT_H3,
                    marginTop: 5
                }}
            />
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: 10,
                    flexWrap: 'wrap'
                }}
            >
                {handleShowOnlineOption()}
            </View>
        </>
    );

    const renderNoteOptions = () => (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                marginBottom: 10,
                flexWrap: 'wrap'
            }}
        >
            {listNoteOptions.map((item, index) => (
                <OptionItem
                    item={item}
                    index={index}
                    handlePressItem={() => {
                        handlePressNoteOption(index);
                    }}
                    isSelected={item.selected}
                />
            ))}
        </View>
    );

    const renderInputNote = () => (
        <CustomInput
            value={booking.noted}
            multiline
            onChangeText={(input) => onChangeNote(input)}
            containerStyle={{
                marginVertical: 5,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            inputStyle={{
                height: 60,
            }}
        />
    );

    const renderInputAddress = () => (
        <>
            {isShowAddress && (
                <CustomInput
                    value={booking.address}
                    onChangeText={(input) => onChangeAddress(input)}
                    containerStyle={{
                        marginBottom: 10,
                        marginTop: 5,
                        width: SIZES.WIDTH_BASE * 0.9
                    }}
                    label="Địa điểm:"
                />
            )}
        </>

    );

    const renderInfoView = () => {
        const {
            params: {
                fullName
            }
        } = route;

        return (
            <View
                style={{
                    alignSelf: 'center',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={
                        [
                            styles.title,
                            {
                                color: COLORS.ACTIVE,
                                fontSize: SIZES.FONT_H1,
                            }
                        ]
                    }
                >
                    {fullName || partner.fullName}
                </Text>
            </View>
        );
    };

    const renderNoteSection = () => (
        <>
            <CustomText
                text="Ghi chú:"
                style={{
                    color: COLORS.ACTIVE,
                    fontSize: SIZES.FONT_H3,
                    marginTop: 5
                }}
            />
            {isShowNoteInput && (
                <>
                    {renderInputNote()}
                </>
            )}
            {isShowInputOptions && (
                <>
                    {renderNoteOptions()}
                </>
            )}
        </>
    );

    const renderFormView = () => (
        <View
            style={{
                zIndex: 99,
                flex: 1,
                width: SIZES.WIDTH_BASE * 0.9,
                alignSelf: 'center',
            }}
        >
            <View>

                {renderInfoView(partner)}

                <View
                    style={{
                        marginBottom: Platform.OS === 'ios' || 20,
                    }}
                >
                    <CustomCalendar
                        onChangeDate={(date) => { onChangeDateCalendar(date); }}
                        selectedDate={selectedDate}
                    />
                </View>

                {/* {listPartnerPackage && listPartnerPackage.length !== 0 && (
                    <TouchableOpacity
                        containerStyle={{
                            width: SIZES.WIDTH_BASE * 0.9,
                            alignSelf: 'center',
                            paddingBottom: 20,
                        }}
                        onPress={() => setModalPartnerPackageVisible(true)}
                    >
                        <Text
                            style={{
                                fontSize: SIZES.FONT_H3,
                                fontFamily: TEXT_REGULAR,
                                color: COLORS.ACTIVE
                            }}
                        >
                            Chọn gói đơn hẹn
                        </Text>
                    </TouchableOpacity>
                )} */}

                {renderButtonTimePicker()}
                {renderBookingTypes()}
                {renderInputAddress()}
                {renderNoteSection()}
            </View>
        </View>
    );

    try {
        return (
            <>
                {renderFormView()}
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
    title: {
        fontFamily: TEXT_BOLD,
        marginVertical: 10
    },
});
