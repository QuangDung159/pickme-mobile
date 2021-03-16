import {
    Block, Button, Text
} from 'galio-framework';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal, StyleSheet
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ScrollPicker from 'react-native-wheel-scroll-picker';
import { useDispatch, useSelector } from 'react-redux';
import { CustomCalendar } from '../components/bussinessComponents';
import { CenterLoader, IconCustom, Line } from '../components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '../constants';
import { ToastHelpers } from '../helpers';
import { setListBookingLocation } from '../redux/Actions';
import { rxUtil } from '../utils';

const hourArr = [
    '06', '07', '08', '09', '10', '11', '12', '13', '14', '15',
    '16', '17', '18', '19', '20', '21', '22'
];

const minuteArr = [
    '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14',
    '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
    '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44',
    '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59',
];

export default function CreateBooking({ route, navigation }) {
    const [booking, setBooking] = useState({
        start: '',
        end: '',
        isDraft: true,
        locationId: '',
        locationAddress: ''
    });
    const [selectedDate, setSelectedDate] = useState(moment().format('DD-MM-YYYY'));
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [listBusyBySelectedDate, setListBusyBySelectedDate] = useState([]);
    const [busyCalendar, setBusyCalendar] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTimePickerVisible, setModalTimePickerVisible] = useState(false);
    const [listLocationForDropdown, setListLocationForDropdown] = useState([]);
    const [currentTask, setCurrentTask] = useState('create');
    const [earningExpected, setEarningExpected] = useState(0);

    const [modalActiveType, setModalActiveType] = useState('start');
    const [startTimeStr, setStartTimeStr] = useState('07:00');
    const [endTimeStr, setEndTimeStr] = useState('09:00');

    const [startHourActive, setStartHourActive] = useState(0);
    const [startMinuteActive, setStartMinuteActive] = useState(0);
    const [endHourActive, setEndHourActive] = useState(0);
    const [endMinuteActive, setEndMinuteActive] = useState(0);

    const token = useSelector((state) => state.userReducer.token);
    const listBookingLocation = useSelector((state) => state.locationReducer.listBookingLocation);

    const dispatch = useDispatch();

    useEffect(
        () => {
            const {
                params: {
                    bookingToEdit,
                    partner
                }
            } = route;

            if (bookingToEdit) {
                getPartnerInfo(partner.id);
                fillBookingDataFromDetail();
            } else {
                setEarningExpected(partner.earningExpected);
            }

            getCalendarPartner();
            fetchListBookingLocation();
        }, []
    );

    const fetchListBookingLocation = () => {
        if (listBookingLocation && listBookingLocation.length > 0) {
            setListLocationForDropdown(createListLocationForDropdown(listBookingLocation));
            setBooking({
                ...booking,
                locationId: listBookingLocation[0].id,
                locationAdress: listBookingLocation[0].address
            });
        } else {
            rxUtil(
                Rx.BOOKING.GET_LIST_BOOKING_LOCATION,
                'GET',
                null,
                {
                    Authorization: token
                },
                (res) => {
                    const listLocation = res.data.data;
                    if (listLocation.length > 0) {
                        dispatch(setListBookingLocation(listLocation));
                        setListLocationForDropdown(createListLocationForDropdown(listLocation));
                        setBooking({
                            ...booking,
                            locationId: listLocation[0].id,
                            locationAdress: listLocation[0].address
                        });
                    }
                }
            );
        }
    };

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const getCalendarPartner = () => {
        const {
            params: {
                partner
            }
        } = route;

        setIsShowSpinner(true);

        rxUtil(
            `${Rx.CALENDAR.PARTNER_CALENDAR}/${partner.id}`,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setBusyCalendar(res.data.data);
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            }
        );
    };

    const fillBookingDataFromDetail = () => {
        const {
            params: {
                bookingToEdit
            }
        } = route;

        if (bookingToEdit) {
            const {
                endAt,
                date,
                startAt,
                location: {
                    id,
                    address
                }
            } = bookingToEdit;

            setCurrentTask('update');
            setBooking({
                ...booking,
                start: convertMinutesToStringHours(startAt),
                end: convertMinutesToStringHours(endAt),
                locationId: id,
                locationAdress: address
            });

            setStartTimeStr(convertMinutesToStringHours(startAt));
            setEndTimeStr(convertMinutesToStringHours(endAt));

            onChangeDateCalendar(moment(date.substring(0, 10), 'YYYY-MM-DD').format('DD-MM-YYYY'));
        }
    };

    const onChangeLocation = (locationId, locationAdress) => {
        setBooking({
            ...booking, locationId, locationAdress
        });
    };

    const onSubmitBooking = () => {
        const {
            params: {
                partner,
                bookingToEdit
            }
        } = route;

        const dateString = `${moment(selectedDate, 'DD-MM-YYYY').format('YYYY-MM-DD')}T00:00:00`;
        const startString = convertStringHoursToMinutes(startTimeStr);
        const endString = convertStringHoursToMinutes(endTimeStr);

        const bookingToSubmit = {
            StartAt: startString,
            EndAt: endString,
            LocationId: booking.locationId,
            IsDraft: booking.isDraft,
            Date: dateString,
            isConfirm: false
        };

        setIsShowSpinner(true);

        const endpoint = currentTask === 'create'
            ? `${Rx.BOOKING.SCHEDULE_BOOKING}/${partner.id}`
            : `${Rx.BOOKING.UDPATE_BOOKING}/${bookingToEdit.id}`;

        rxUtil(
            endpoint,
            'POST',
            bookingToSubmit,
            {
                Authorization: token
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'success');
                navigation.navigate(ScreenName.BOOKING_LIST);
            },
            () => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast();
            },
            (errResponse) => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast(errResponse, 'error');
            }
        );
    };

    const convertStringHoursToMinutes = (hoursStr) => {
        const deltaTime = hoursStr.split(':');
        const hours = deltaTime[0];
        const minutes = deltaTime[1];
        return hours * 60 + +minutes;
    };

    const convertMinutesToStringHours = (minutes) => moment.utc()
        .startOf('day')
        .add(minutes, 'minutes')
        .format('HH:mm');

    const getPartnerInfo = (partnerId) => {
        rxUtil(
            `${Rx.PARTNER.PARTNER_DETAIL}/${partnerId}`,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setIsShowSpinner(false);
                setEarningExpected(res.data.data.earningExpected);
            },
            () => {
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            }
        );
    };

    const calculateTotalAmount = (start, end) => {
        const startMinutesNumber = convertStringHoursToMinutes(start) || 0;
        const endMinutesNumber = convertStringHoursToMinutes(end) || 0;
        if (startMinutesNumber < endMinutesNumber) {
            return (endMinutesNumber - startMinutesNumber) * earningExpected;
        }
        return 0;
    };

    const onChangeDateCalendar = (date) => {
        const result = busyCalendar.find(
            (item) => date === moment(item.date).format('DD-MM-YYYY')
        );

        setSelectedDate(date);
        setListBusyBySelectedDate(result ? result.details : []);
    };

    const createListLocationForDropdown = (listLocation) => {
        const listLocationFinal = [];

        if (listLocation) {
            listLocation.forEach((item) => {
                const location = { ...item };
                location.label = item.name;
                location.value = item.id;
                listLocationFinal.push(location);
            });
        }
        return listLocationFinal;
    };

    const onChangeHourTimePicker = (data) => {
        if (modalActiveType === 'start') {
            const startTimeArr = startTimeStr.split(':');
            startTimeArr[0] = data;
            setStartTimeStr(startTimeArr.join(':'));
        } else {
            const endTimeArr = endTimeStr.split(':');
            endTimeArr[0] = data;
            setEndTimeStr(endTimeArr.join(':'));
        }
    };

    const onChangeMinuteTimePicker = (data) => {
        if (modalActiveType === 'start') {
            const startTimeArr = startTimeStr.split(':');
            startTimeArr[1] = data;
            setStartTimeStr(startTimeArr.join(':'));
        } else {
            const endTimeArr = endTimeStr.split(':');
            endTimeArr[1] = data;
            setEndTimeStr(endTimeArr.join(':'));
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

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderTimePicker = () => (
        <Block
            row
            space="between"
            style={{
                alignSelf: 'center',
                width: NowTheme.SIZES.WIDTH_BASE * 0.6
            }}
        >
            <ScrollPicker
                dataSource={hourArr}
                selectedIndex={
                    modalActiveType === 'start' ? startHourActive : endHourActive
                }
                renderItem={(data) => (
                    <Text
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                        }}
                    >
                        {`${data}`}
                    </Text>
                )}
                onValueChange={(data) => {
                    onChangeHourTimePicker(data);
                }}
                wrapperHeight={120}
                wrapperWidth={150}
                wrapperBackground="#FFFFFF"
                itemHeight={40}
                highlightColor="#d8d8d8"
                highlightBorderWidth={2}
                activeItemColor="#222121"
                itemColor="#B4B4B4"
            />

            <ScrollPicker
                dataSource={minuteArr}
                selectedIndex={
                    modalActiveType === 'start' ? startMinuteActive : endMinuteActive
                }
                renderItem={(data) => (
                    <Text
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                        }}
                    >
                        {`${data}`}
                    </Text>
                )}
                onValueChange={(data) => {
                    onChangeMinuteTimePicker(data);
                }}
                wrapperHeight={120}
                wrapperWidth={150}
                wrapperBackground="#FFFFFF"
                itemHeight={40}
                highlightColor="#d8d8d8"
                highlightBorderWidth={2}
                activeItemColor="#222121"
                itemColor="#B4B4B4"
            />
        </Block>
    );

    const renderListBusySection = () => {
        if (listBusyBySelectedDate[0] !== '') {
            return listBusyBySelectedDate.map((item, sectionIndex) => {
                const startStr = convertMinutesToStringHours(item.startAt);
                const endStr = convertMinutesToStringHours(item.endAt);

                return (
                    <Block
                        // eslint-disable-next-line react/no-array-index-key
                        key={sectionIndex}
                        style={{
                            backgroundColor: sectionIndex % 2 === 0
                                ? NowTheme.COLORS.LIST_ITEM_BACKGROUND_1
                                : NowTheme.COLORS.LIST_ITEM_BACKGROUND_2,
                            height: NowTheme.SIZES.HEIGHT_BASE * 0.07,
                            justifyContent: 'center',
                        }}
                    >
                        <Block
                            row
                            space="between"
                            style={{
                                marginHorizontal: 10,
                                alignItems: 'center'
                            }}
                        >
                            <Block
                                row
                                flex
                                space="around"
                            >
                                <Text
                                    style={{
                                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                                    }}
                                    size={27}
                                    color={NowTheme.COLORS.ACTIVE}
                                >
                                    {startStr}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                                    }}
                                    size={27}
                                    color={NowTheme.COLORS.ACTIVE}
                                >
                                    -
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                                    }}
                                    size={27}
                                    color={NowTheme.COLORS.ACTIVE}
                                >
                                    {endStr}
                                </Text>
                            </Block>
                        </Block>
                    </Block>
                );
            });
        }
        return <></>;
    };

    const renderModal = () => (
        <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <Block style={styles.centeredView}>
                    <Block style={styles.modalView}>
                        <Text
                            size={NowTheme.SIZES.FONT_INFO}
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                marginVertical: 10
                            }}
                        >
                            Lịch bận của đối tác
                        </Text>
                        <Block
                            style={{
                                width: NowTheme.SIZES.WIDTH_BASE * 0.75
                            }}
                        >
                            {renderBusyCalendar()}
                        </Block>

                        <Block center>
                            <Button
                                onPress={() => setModalVisible(false)}
                                style={[styles.buttonModal, {
                                    marginVertical: 10
                                }]}
                                shadowless
                            >
                                Đóng
                            </Button>
                        </Block>
                    </Block>
                </Block>
            </ScrollView>
        </Modal>
    );

    const renderTimePickerModal = () => (
        <Modal
            animationType="slide"
            transparent
            visible={modalTimePickerVisible}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <Block style={styles.centeredView}>
                    <Block style={styles.modalView}>
                        {renderTimePicker()}

                        <Block center>
                            <Button
                                onPress={() => {
                                    setModalTimePickerVisible(false);
                                }}
                                style={[styles.buttonModal, {
                                    marginVertical: 10
                                }]}
                                shadowless
                            >
                                Đóng
                            </Button>
                        </Block>
                    </Block>
                </Block>
            </ScrollView>
        </Modal>
    );

    const renderButtonTimePicker = () => (
        <Block
            space="between"
            row
            style={{
                marginBottom: 10,
                width: NowTheme.SIZES.WIDTH_BASE * 0.95,
            }}
        >
            <Button
                shadowless
                color={NowTheme.COLORS.TRANSPARENT}
                style={{
                    borderWidth: 1,
                    borderColor: NowTheme.COLORS.ACTIVE,
                    borderRadius: 5,
                    width: NowTheme.SIZES.WIDTH_BASE * 0.4,
                    marginLeft: 0
                }}
                textStyle={styles.timePickerText}
                onPress={() => {
                    setModalTimePickerVisible(true);
                    setModalActiveType('start');
                    onClickTriggerTimePicker('start');
                }}
            >
                {startTimeStr}
            </Button>

            <Button
                shadowless
                color={NowTheme.COLORS.TRANSPARENT}
                style={{
                    borderWidth: 1,
                    borderColor: NowTheme.COLORS.ACTIVE,
                    borderRadius: 5,
                    width: NowTheme.SIZES.WIDTH_BASE * 0.4
                }}
                textStyle={styles.timePickerText}
                onPress={() => {
                    setModalActiveType('end');
                    setModalTimePickerVisible(true);
                    onClickTriggerTimePicker('end');
                }}
            >
                {endTimeStr}
            </Button>
            {renderIconShowModal()}
        </Block>
    );

    const renderAlert = () => (
        Alert.alert(
            'Huỷ bỏ?',
            'Bạn có chắc muốn huỷ đặt hẹn?',
            [
                {
                    text: 'Tiếp tục đặt',
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: 'Đồng ý huỷ',
                    onPress: () => {
                        navigation.navigate(ScreenName.PROFILE, {
                            user: route.params.partner
                        });
                    }
                }
            ],
            { cancelable: false }
        )
    );

    const renderDropDownLocation = () => (
        <Block
            style={{
                width: NowTheme.SIZES.WIDTH_BASE * 0.95,
                alignSelf: 'center',
                marginBottom: 10,
            }}
        >
            {listLocationForDropdown && listLocationForDropdown.length !== 0 && (
                <DropDownPicker
                    items={listLocationForDropdown}
                    defaultValue={booking.locationId}
                    containerStyle={{
                        borderRadius: 5,
                        width: NowTheme.SIZES.WIDTH_95,
                        alignSelf: 'center',
                        marginBottom: 10
                    }}
                    selectedtLabelStyle={{
                        color: 'red'
                    }}
                    placeholderStyle={{
                        color: NowTheme.COLORS.MUTED
                    }}
                    itemStyle={{
                        justifyContent: 'flex-start',
                    }}
                    dropDownStyle={{ backgroundColor: '#fafafa' }}
                    activeLabelStyle={{ color: NowTheme.COLORS.ACTIVE }}
                    onChangeItem={(item) => onChangeLocation(item.value, item.address)}
                    labelStyle={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                    }}
                    placeholder="Chọn địa điểm..."
                    searchable
                    searchablePlaceholder="Tìm kiếm..."
                    searchablePlaceholderTextColor={NowTheme.COLORS.MUTED}
                    searchableError={() => <Text>Not Found</Text>}
                />
            )}
            <Block>
                {booking.locationAdress ? (
                    <Text
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                            fontSize: NowTheme.SIZES.FONT_SUB_TITLE,
                            marginBottom: 10
                        }}
                        color={NowTheme.COLORS.ACTIVE}
                    >
                        {booking.locationAdress}
                    </Text>
                ) : (
                    <Block style={{
                        marginBottom: 10
                    }}
                    />
                )}
            </Block>
        </Block>
    );

    const renderFormBlock = (partner) => {
        const {
            params: {
                bookingToEdit
            }
        } = route;

        const activeDate = bookingToEdit
            ? moment(bookingToEdit.date.substring(0, 10), 'YYYY-MM-DD').format('DD-MM-YYYY')
            : selectedDate;

        return (
            <Block
                style={{
                    zIndex: 99,
                }}
                flex
            >
                <Block>
                    <Text style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        marginTop: 10
                    }}
                    >
                        THÔNG TIN CUỘC HẸN
                    </Text>
                    <Line
                        borderWidth={0.5}
                        borderColor={NowTheme.COLORS.ACTIVE}
                        style={{
                            marginVertical: 10
                        }}
                    />
                    {renderInfoBlock(partner)}

                    <CustomCalendar
                        onChangeDate={(date) => { onChangeDateCalendar(date); }}
                        selectedDate={activeDate}
                    />

                    {renderButtonTimePicker()}

                    {renderDropDownLocation()}

                </Block>
            </Block>
        );
    };

    const renderInfoBlock = (partner) => {
        const {
            params: {
                fullName
            }
        } = route;

        return (
            <Block
                middle
                style={{
                    marginBottom: 10,
                }}
            >
                <Text
                    color={NowTheme.COLORS.ACTIVE}
                    size={NowTheme.SIZES.FONT_MAIN_TITLE}
                    style={styles.title}
                >
                    {fullName || partner.fullName}
                </Text>
            </Block>
        );
    };

    const renderTotal = () => (
        <Block>
            <Block>
                <Text style={{
                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                    marginTop: 10
                }}
                >
                    XÁC NHẬN ĐẶT
                </Text>
                <Line
                    borderWidth={0.5}
                    borderColor={NowTheme.COLORS.ACTIVE}
                    style={{
                        marginTop: 10
                    }}
                />
            </Block>
            <Block
                middle
            >
                <Text
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                        fontSize: 30,
                        paddingVertical: 10
                    }}
                    color={NowTheme.COLORS.ACTIVE}
                >
                    {calculateTotalAmount(startTimeStr, endTimeStr)}
                    {' '}
                    <IconCustom
                        name="diamond"
                        family={IconFamily.SIMPLE_LINE_ICONS}
                        size={20}
                        color={NowTheme.COLORS.ACTIVE}
                    />
                </Text>
            </Block>
            {renderButton()}
        </Block>
    );

    const renderButton = () => (
        <Block
            row
            center
            space="between"
        >
            <Button
                onPress={() => {
                    onSubmitBooking();
                }}
                shadowless
            >
                Xác nhận
            </Button>

            <Button
                onPress={() => {
                    renderAlert();
                }}
                shadowless
                color={NowTheme.COLORS.DEFAULT}
            >
                Huỷ bỏ
            </Button>
        </Block>
    );

    const renderIconShowModal = () => (
        <Block
            middle
        >
            <TouchableWithoutFeedback
                onPress={() => {
                    setModalVisible(true);
                }}
            >
                <IconCustom
                    name="calendar"
                    family={IconFamily.FONT_AWESOME}
                    size={23}
                    color={NowTheme.COLORS.ACTIVE}
                />
            </TouchableWithoutFeedback>
        </Block>
    );

    const renderBusyCalendar = () => (
        <>
            {!listBusyBySelectedDate || listBusyBySelectedDate.length === 0 ? (
                <Block
                    middle
                    flex
                    style={{
                        marginBottom: 10
                    }}
                >
                    <Text
                        color={NowTheme.COLORS.SWITCH_OFF}
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        }}
                        size={14}
                    >
                        Đối tác rảnh vào ngày này, đặt hẹn nào!
                    </Text>
                </Block>
            ) : (
                <Block>
                    {renderListBusySection()}
                </Block>
            )}
        </>
    );

    const {
        params: {
            partner,
        }
    } = route;

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader size="large" />
                ) : (
                    <>
                        <KeyboardAwareScrollView
                            style={{
                                width: NowTheme.SIZES.WIDTH_95,
                                alignSelf: 'center'
                            }}
                            showsVerticalScrollIndicator={false}
                        >
                            {renderModal()}

                            {renderTimePickerModal()}

                            {renderFormBlock(partner)}

                            {renderTotal()}
                        </KeyboardAwareScrollView>
                    </>
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

const styles = StyleSheet.create({
    title: {
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
        marginVertical: 10
    },
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: NowTheme.SIZES.HEIGHT_BASE * 0.3
    },
    modalView: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    timePickerText: {
        color: NowTheme.COLORS.ACTIVE,
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
        fontSize: NowTheme.SIZES.FONT_INFO
    }
});
