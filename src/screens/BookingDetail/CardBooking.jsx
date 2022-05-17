import { CustomButton, CustomText, IconCustom } from '@components/uiComponents';
import {
    BookingStatus, IconFamily, OutsideApp, Theme
} from '@constants/index';
import { mappingStatusText } from '@helpers/CommonHelpers';
import { CommonHelpers, ToastHelpers } from '@helpers/index';
import * as Calendar from 'expo-calendar';
import * as Linking from 'expo-linking';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    StyleSheet, TouchableOpacity, View
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

const {
    GOOGLE_MAP,
} = OutsideApp;

export default function CardBooking({ booking }) {
    const [deviceCalendars, setDeviceCalendars] = useState([]);
    const [openAppText, setOpenAppText] = useState();

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const timezone = useSelector((state) => state.appConfigReducer.timezone);

    useEffect(
        () => {
            getDeviceCalendar();
            createOpenAppText();
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

    // const createBookingDetailLink = (bookingId) => {
    //     const redirectUrl = Linking.createURL('booking-detail', {
    //         queryParams: { bookingId },
    //     });

    //     console.log('redirectUrl :>> ', redirectUrl);
    //     return redirectUrl;
    // };

    const getDefaultCalendarSource = async () => {
        const defaultCalendar = await Calendar.getDefaultCalendarAsync();
        return defaultCalendar.source;
    };

    const checkAppCalendarExisted = async () => {
        if (!deviceCalendars || deviceCalendars.length === 0) {
            const calendarId = await createCalendar();
            return calendarId;
        }

        const appCalendar = deviceCalendars.find((item) => item.name === '2SeeYou');
        if (!appCalendar) {
            const calendarId = await createCalendar();
            return calendarId;
        }
        return appCalendar.id;
    };

    const createCalendar = async () => {
        const defaultCalendarSource = Platform.OS === 'ios'
            ? await getDefaultCalendarSource()
            : { isLocalAccount: true, name: '2SeeYou' };
        const newCalendarID = await Calendar.createCalendarAsync({
            title: 'Lịch 2SeeYou',
            color: COLORS.ACTIVE,
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.id,
            source: defaultCalendarSource,
            name: '2SeeYou',
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
            notes: `${booking.noted}\n\nMã yêu cầu:\n${booking.id}`,
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
            ]);
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
        return `${GOOGLE_MAP.deepLink}${addressStr}`;
    };

    const createOpenAppText = () => {
        setOpenAppText({
            action: () => Linking.openURL(createMapUrl(booking.address)),
            icon: {
                name: 'map',
                family: IconFamily.ENTYPO,
                size: 12
            },
        });
    };

    try {
        const {
            startAt,
            endAt,
            partnerName,
            totalAmount,
            partnerFee,
            status,
            date,
            idReadAble,
            customerName,
            customerId
        } = booking;

        if (!booking) {
            return null;
        }

        const xuDisplay = customerId === currentUser?.id ? totalAmount : partnerFee;

        const startStr = convertMinutesToStringHours(startAt);
        const endStr = convertMinutesToStringHours(endAt);

        return (
            <View
                style={{
                    marginTop: 10,
                    alignSelf: 'center',
                    width: SIZES.WIDTH_MAIN,
                    borderBottomColor: COLORS.ACTIVE,
                    borderBottomWidth: 0.5
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        width: SIZES.WIDTH_MAIN,
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
                                    fontFamily: TEXT_REGULAR,
                                    marginBottom: 0
                                }
                            ]
                        }
                        text={`${customerId === currentUser?.id ? 'Host' : 'Khách'}`}
                    />
                    <CustomText
                        style={
                            [
                                styles.subInfoCard,
                                {
                                    fontSize: SIZES.FONT_H5,
                                    marginBottom: 0,
                                }
                            ]
                        }
                        text={`Hẹn: #${idReadAble}`}
                    />
                </View>

                <CustomText
                    style={
                        [
                            styles.cardTitle,
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
                            ]
                        }
                        text={`Thời gian: ${startStr} - ${endStr}`}
                    />
                    <CustomText
                        style={
                            [
                                styles.subInfoCard,
                            ]
                        }
                        text={`${moment(date).format('DD/MM/YYYY')}`}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => {
                        openAppText?.action();
                        // if (booking.status === BookingStatus.PAID) {
                        //     openAppText?.action();
                        // } else {
                        //     Alert.alert('Yêu cầu thuê không ở trạng thái "Đã được thanh toán"', '', [
                        //         {
                        //             text: 'Đã hiểu',
                        //             style: 'ok'
                        //         },
                        //     ], { cancelable: true });
                        // }
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <CustomText
                            style={
                                [
                                    styles.subInfoCard,
                                ]
                            }
                            text={`Tại: ${booking.address}`}
                        />
                        <IconCustom
                            name={openAppText?.icon.name}
                            family={openAppText?.icon.family}
                            size={openAppText?.icon.size}
                            color={COLORS.DEFAULT}
                            style={{
                                marginBottom: 5,
                                marginLeft: 5
                            }}
                        />
                    </View>
                </TouchableOpacity>

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
                        marginTop: -5,
                        flexDirection: 'row',
                        width: '100%',
                    }}
                >
                    <CustomText
                        text={`Xu: ${CommonHelpers.formatCurrency(xuDisplay)}`}
                    />
                    {booking.status === BookingStatus.PAID && (
                        <CustomButton
                            onPress={() => {
                                addBookingToCalendar();
                            }}
                            type="active"
                            label="Thêm vào lịch"
                            buttonStyle={{
                                width: 120,
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
                    )}
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
        marginBottom: 5
    },
    subInfoCard: {
        fontFamily: TEXT_REGULAR,
        marginBottom: 5
    },
});
