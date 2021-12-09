import { CustomCalendar } from '@components/businessComponents';
import {
    CustomButton, CustomInput, CustomText, OptionItem
} from '@components/uiComponents';
import { BookingNoteOptions, Theme } from '@constants/index';
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
        <View
            style={{
                marginBottom: 10,
                width: SIZES.WIDTH_BASE * 0.9,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}
        >
            <CustomButton
                onPress={() => {
                    setModalTimePickerVisible(true);
                    setModalActiveType('start');
                    onClickTriggerTimePicker('start');
                }}
                type="active"
                label={startTimeStr}
            />

            <CustomButton
                onPress={() => {
                    setModalActiveType('end');
                    setModalTimePickerVisible(true);
                    onClickTriggerTimePicker('end');
                }}
                type="active"
                label={endTimeStr}
            />

            {/* {renderIconShowModal()} */}
        </View>
    );

    const handlePressNoteOption = (index) => {
        const list = [...listNoteOptions];

        if (index === listNoteOptions.length - 1) {
            setIsShowNoteInput(true);
            const listTemp = [];

            list.forEach((item) => {
                listTemp.push({
                    value: item.value,
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
                height: 80,
            }}
        />
    );

    const renderInputAddress = () => (
        <CustomInput
            value={booking.address}
            onChangeText={(input) => onChangeAddress(input)}
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
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
                    marginVertical: 15,
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
                    marginTop: 10
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
                    <TouchableWithoutFeedback
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
                    </TouchableWithoutFeedback>
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
