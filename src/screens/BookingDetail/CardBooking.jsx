import { CustomButton, CustomText } from '@components/uiComponents';
import TouchableText from '@components/uiComponents/TouchableText';
import { BookingStatus, IconFamily, Theme } from '@constants/index';
import { mappingStatusText } from '@helpers/CommonHelpers';
import { CommonHelpers, ToastHelpers } from '@helpers/index';
import * as Calendar from 'expo-calendar';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Linking,
    Platform,
    StyleSheet, View
} from 'react-native';
import { useSelector } from 'react-redux';

const v4Regex = /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/;

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function CardBooking({ booking }) {
    const [deviceCalendars, setDeviceCalendars] = useState([]);

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const timezone = useSelector((state) => state.appConfigReducer.timezone);

    useEffect(
        () => {
            getDeviceCalendar();
        }, []
    );

    const getDeviceCalendar = async () => {
        // await Calendar.deleteCalendarAsync('6');

        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
            setDeviceCalendars(calendars);
        }
    };

    const getDefaultCalendarSource = async () => {
        const defaultCalendar = await Calendar.getDefaultCalendarAsync();
        return defaultCalendar.source;
    };

    const checkAppCalendarExisted = async () => {
        if (!deviceCalendars || deviceCalendars.length === 0) {
            const calendarId = await createCalendar();
            return calendarId;
        }

        const appCalendar = deviceCalendars.find((item) => item.name === 'PickMe');
        if (!appCalendar) {
            const calendarId = await createCalendar();
            return calendarId;
        }
        return appCalendar.id;
    };

    const createCalendar = async () => {
        const defaultCalendarSource = Platform.OS === 'ios'
            ? await getDefaultCalendarSource()
            : { isLocalAccount: true, name: 'PickMe' };
        const newCalendarID = await Calendar.createCalendarAsync({
            title: 'Lịch PickMe',
            color: COLORS.ACTIVE,
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.id,
            source: defaultCalendarSource,
            name: 'PickMe',
            ownerAccount: currentUser.userName,
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });
        return newCalendarID.toString();
    };

    const createDatArr = (dateStr, minutes) => {
        let dateArr = dateStr.toString().split('T');
        dateArr = dateArr[0].split('-');

        const strHours = convertMinutesToStringHours(minutes).split(':');
        dateArr = dateArr.concat(strHours);
        return dateArr;
    };

    const checkEventExisted = async (calendarsId, bookingId) => {
        const startDateArr = createDatArr(booking.date, booking.startAt);
        const endDateArr = createDatArr(booking.date, booking.endAt);

        const calendars = await Calendar.getEventsAsync(
            [calendarsId],
            new Date(startDateArr[0],
                startDateArr[1],
                startDateArr[2],
                0,
                0,
                0, 0),
            new Date(endDateArr[0],
                endDateArr[1],
                endDateArr[2],
                23,
                59,
                59, 0)
        );

        let bookingIdFromNote = '';
        let event = null;
        calendars.forEach((item) => {
            bookingIdFromNote = getBookingId(item.notes);
            if (bookingIdFromNote === bookingId) {
                event = item;
            }
        });

        return event;
    };

    const getBookingId = (note) => {
        const uuidFromNote = note.match(v4Regex);
        if (uuidFromNote) {
            return uuidFromNote[0];
        }
        return null;
    };

    const addBookingToCalendar = async () => {
        const calendarId = await checkAppCalendarExisted();
        const startDateArr = createDatArr(booking.date, booking.startAt);
        const endDateArr = createDatArr(booking.date, booking.endAt);

        const detail = {
            title: `Hẹn với ${booking.customerId === currentUser?.id
                ? booking.partnerName
                : booking.customerName}`,
            startDate: new Date(startDateArr[0],
                startDateArr[1],
                startDateArr[2],
                startDateArr[3],
                startDateArr[4],
                0, 0),
            endDate: new Date(endDateArr[0],
                endDateArr[1],
                endDateArr[2],
                endDateArr[3],
                endDateArr[4],
                0, 0),
            allDay: false,
            location: booking.address,
            notes: `${booking.noted}\n\nMã cuộc hẹn: ${booking.id}`,
            timeZone: timezone,
            alarms: [{ relativeOffset: -60, method: Calendar.AlarmMethod.ALERT }],
        };

        const isEventExisted = await checkEventExisted(calendarId, booking.id);

        let eventId = '';
        if (isEventExisted) {
            eventId = isEventExisted.id;
        } else {
            eventId = await Calendar.createEventAsync(calendarId, detail);
        }

        if (eventId) {
            Alert.alert('Thêm thành công', '', [
                {
                    text: 'Đóng',
                    style: 'cancel'
                },
                {
                    text: 'Xem lịch',
                    onPress: () => {
                        Calendar.openEventInCalendar(eventId);
                    }
                }
            ],
            { cancelable: false });
        } else {
            ToastHelpers.renderToast('Lỗi thêm lịch. Vui lòng thử lại sau');
        }
    };

    const convertMinutesToStringHours = (minutes) => moment.utc()
        .startOf('day')
        .add(minutes, 'minutes')
        .format('HH:mm');

    const createMapUrl = (address) => {
        const addressStr = address.replace(/ /g, '+');
        return `https://www.google.com/maps?daddr=${addressStr}`;
    };

    try {
        const {
            startAt,
            endAt,
            partnerName,
            totalAmount,
            status,
            date,
            idReadAble,
            address,
            customerName,
            customerId
        } = booking;

        if (!booking) {
            return null;
        }

        const startStr = convertMinutesToStringHours(startAt);
        const endStr = convertMinutesToStringHours(endAt);

        return (
            <View
                style={{
                    marginTop: 10,
                    alignSelf: 'center',
                    width: SIZES.WIDTH_BASE * 0.9,
                    borderBottomColor: COLORS.ACTIVE,
                    borderBottomWidth: 0.5
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        width: SIZES.WIDTH_BASE * 0.9,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <CustomText
                        style={
                            [
                                styles.cardTitle,
                                {
                                    fontSize: SIZES.FONT_H5,
                                    color: COLORS.DEFAULT,
                                    fontFamily: TEXT_REGULAR,
                                    marginBottom: 0
                                }
                            ]
                        }
                        text={`${customerId === currentUser?.id ? 'Host' : 'Khách hàng'}`}
                    />
                    <CustomText
                        style={
                            [
                                styles.subInfoCard,
                                {
                                    fontSize: SIZES.FONT_H5,
                                    color: COLORS.DEFAULT,
                                    marginBottom: 0,
                                }
                            ]
                        }
                        text={`Mã đơn: #${idReadAble}`}
                    />
                </View>

                <CustomText
                    style={
                        [
                            styles.cardTitle,
                            {
                                fontSize: SIZES.FONT_H2,
                                color: COLORS.ACTIVE,
                            }
                        ]
                    }
                    text={`${customerId === currentUser?.id ? partnerName : customerName}`}
                />

                <View
                    style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                    }}
                >
                    <CustomText
                        style={
                            [
                                styles.subInfoCard,
                                {
                                    fontSize: SIZES.FONT_H2,
                                    color: COLORS.ACTIVE,
                                }
                            ]
                        }
                        text={`Ngày: ${moment(date).format('DD-MM-YYYY')}`}
                    />
                    <CustomText
                        style={
                            [
                                styles.subInfoCard,
                                {
                                    fontSize: SIZES.FONT_H2,
                                    color: COLORS.ACTIVE,
                                }
                            ]
                        }
                        text={`${startStr} - ${endStr}`}
                    />
                </View>

                <TouchableText
                    style={
                        [
                            styles.subInfoCard,
                            {
                                fontSize: SIZES.FONT_H3,
                                color: COLORS.DEFAULT,
                            }
                        ]
                    }
                    onPress={() => {
                        Linking.openURL(createMapUrl(address));
                    }}
                    text={`Tại: ${address || 'N/A'} (xem chỉ đường)`}
                />

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <CustomText
                        style={
                            [
                                styles.subInfoCard,
                                {
                                    fontSize: SIZES.FONT_H3,
                                    color: COLORS.DEFAULT,
                                }
                            ]
                        }
                        text={`Trạng thái: ${mappingStatusText(status)}`}
                    />
                </View>
                <View
                    style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 10,
                        flexDirection: 'row',
                        width: '100%',
                    }}
                >
                    <CustomText
                        style={{
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H1,
                            color: COLORS.ACTIVE
                        }}
                        text={CommonHelpers.generateMoneyStr(totalAmount)}
                    />
                    <CustomButton
                        onPress={() => {
                            if (booking.status === BookingStatus.PAID) {
                                addBookingToCalendar();
                            }
                        }}
                        type="active"
                        label="Thêm vào lịch"
                        buttonStyle={{
                            width: 135,
                        }}
                        labelStyle={{
                            fontFamily: TEXT_REGULAR,
                            fontSize: SIZES.FONT_H4,
                        }}
                        leftIcon={{
                            name: 'calendar',
                            size: SIZES.FONT_H3,
                            color: COLORS.ACTIVE,
                            family: IconFamily.ANT_DESIGN
                        }}
                    />
                </View>
            </View>
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

CardBooking.propTypes = {
    booking: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    cardTitle: {
        fontFamily: TEXT_BOLD,
    },
    subInfoCard: {
        fontFamily: TEXT_REGULAR,
    },
});
