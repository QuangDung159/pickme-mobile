import { CustomCalendar } from '@components/businessComponents';
import { CustomButton, CustomInput } from '@components/uiComponents';
import Theme from '@constants/Theme';
import ToastHelpers from '@helpers/ToastHelpers';
import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const {
    FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
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
    listPartnerPackage,
    setModalPartnerPackageVisible,
    booking,
    setBooking,
    partner
}) {
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

    const renderInputNote = () => (
        <CustomInput
            value={booking.noted}
            multiline
            onChangeText={(input) => onChangeNote(input)}
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            label="Ghi chú:"
            inputStyle={{
                height: 80,
            }}
        />
    );

    const renderInputAddress = () => (
        <CustomInput
            value={booking.address}
            multiline
            onChangeText={(input) => onChangeAddress(input)}
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            label="Địa điểm:"
            inputStyle={{
                height: 80,
            }}
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
                    marginBottom: 10,
                    alignSelf: 'center',
                    alignItems: 'center'
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

    const renderFormView = () => (
        <View
            style={{
                zIndex: 99,
                flex: 1,
                width: SIZES.WIDTH_BASE * 0.9,
                alignSelf: 'center',
                paddingBottom: 20
            }}
        >
            <View>

                {renderInfoView(partner)}

                <CustomCalendar
                    onChangeDate={(date) => { onChangeDateCalendar(date); }}
                    selectedDate={selectedDate}
                />

                {listPartnerPackage && listPartnerPackage.length !== 0 && (
                    <TouchableWithoutFeedback
                        containerStyle={{
                            width: SIZES.WIDTH_BASE * 0.9,
                            alignSelf: 'center',
                            paddingBottom: 10,
                        }}
                        onPress={() => setModalPartnerPackageVisible(true)}
                    >
                        <Text
                            style={{
                                fontSize: SIZES.FONT_H3,
                                fontFamily: MONTSERRAT_REGULAR,
                                color: COLORS.ACTIVE
                            }}
                        >
                            Chọn gói đơn hẹn
                        </Text>
                    </TouchableWithoutFeedback>
                )}

                {renderButtonTimePicker()}

                {renderInputAddress()}

                {renderInputNote()}
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
        fontFamily: MONTSERRAT_BOLD,
        marginVertical: 10
    },
});
