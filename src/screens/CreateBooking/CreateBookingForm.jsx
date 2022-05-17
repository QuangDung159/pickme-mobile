/* eslint-disable max-len */
import { CustomCalendar } from '@components/businessComponents';
import {
    CustomButton, CustomInput, CustomText, OptionItem
} from '@components/uiComponents';
import {
    BookingNoteOptions, Theme
} from '@constants/index';
import ToastHelpers from '@helpers/ToastHelpers';
import moment from 'moment';
import React, { useState } from 'react';
import {
    Platform, StyleSheet, Text, View
} from 'react-native';

const {
    FONT: {
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

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
    partner
}) {
    const [listNoteOptions, setListNoteOptions] = useState(BookingNoteOptions);
    const [isShowNoteInput, setIsShowNoteInput] = useState(false);

    const onChangeDateCalendar = (date) => {
        const result = busyCalendar.find(
            (item) => date === moment(item.date).format('DD/MM/YYYY')
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
                    width: SIZES.WIDTH_MAIN,
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
                width: SIZES.WIDTH_MAIN
            }}
            inputStyle={{
                height: 60,
            }}
        />
    );

    const renderInputAddress = () => (
        <CustomInput
            value={booking.address}
            onChangeText={(input) => onChangeAddress(input)}
            containerStyle={{
                marginBottom: 10,
                marginTop: 5,
                width: SIZES.WIDTH_MAIN
            }}
            label="Địa điểm:"
        />

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
                    marginTop: 5
                }}
            />
            {isShowNoteInput && (
                <>
                    {renderInputNote()}
                </>
            )}
            {renderNoteOptions()}
        </>
    );

    const renderFormView = () => (
        <View
            style={{
                zIndex: 99,
                flex: 1,
                width: SIZES.WIDTH_MAIN,
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
                            width: SIZES.WIDTH_MAIN,
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
                            Chọn gói Yêu cầu thuê
                        </Text>
                    </TouchableOpacity>
                )} */}
                {renderButtonTimePicker()}
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
