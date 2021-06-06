import { Picker } from '@react-native-picker/picker';
import {
    Block, Button, Text
} from 'galio-framework';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal, StyleSheet
} from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ScrollPicker from 'react-native-wheel-scroll-picker';
import { useDispatch, useSelector } from 'react-redux';
import { CustomCalendar } from '../components/businessComponents';
import { CenterLoader, IconCustom, Line } from '../components/uiComponents';
import {
    DateTimeConst, IconFamily, NowTheme, Rx, ScreenName
} from '../constants';
import { ToastHelpers } from '../helpers';
import { setListBookingLocation, setListBookingStore, setPersonTabActiveIndex } from '../redux/Actions';
import { rxUtil } from '../utils';

const hourArr = DateTimeConst.HOUR_ARR;
const minuteArr = DateTimeConst.MINUTE_ARR;

export default function CreateBooking({ route, navigation }) {
    const [booking, setBooking] = useState({
        start: '',
        end: '',
        description: '',
        address: '',
        noted: '',
        longtitude: '',
        latitude: ''
    });
    const [selectedDate, setSelectedDate] = useState(moment().format('DD-MM-YYYY'));
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [listBusyBySelectedDate, setListBusyBySelectedDate] = useState([]);
    const [busyCalendar, setBusyCalendar] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTimePickerVisible, setModalTimePickerVisible] = useState(false);
    const [modalPartnerPackageVisible, setModalPartnerPackageVisible] = useState(false);

    const [modalActiveType, setModalActiveType] = useState('start');
    const [startTimeStr, setStartTimeStr] = useState('07:00');
    const [endTimeStr, setEndTimeStr] = useState('09:00');

    const [startHourActive, setStartHourActive] = useState(0);
    const [startMinuteActive, setStartMinuteActive] = useState(0);
    const [endHourActive, setEndHourActive] = useState(0);
    const [endMinuteActive, setEndMinuteActive] = useState(0);
    const [listPartnerPackage, setListPartnerPackage] = useState([]);

    const [locationActive, setLocationActive] = useState();
    const [packageActive, setPackageActive] = useState();

    const [total, setTotal] = useState(0);

    const token = useSelector((state) => state.userReducer.token);
    const listBookingLocation = useSelector((state) => state.locationReducer.listBookingLocation);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

    useEffect(
        () => {
            getCalendarPartner();
            fetchListBookingLocation();
            fetchListPartnerPackage();
        }, []
    );

    useEffect(
        () => {
            if (isSignInOtherDeviceStore) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: ScreenName.SIGN_IN_WITH_OTP }],
                });
            }
        }, [isSignInOtherDeviceStore]
    );

    const fetchListPartnerPackage = async () => {
        const {
            params: {
                partner: {
                    id
                }
            }
        } = route;
        rxUtil(
            `${Rx.BOOKING.GET_PARTNER_PACKAGE}/${id}`,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setListPartnerPackage(res.data.data);
                setPackageActive(res.data.data[0]);
                setIsShowSpinner(false);
            },
            (res) => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast(res.data.message, 'error');
            },
            (res) => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast(res.data.message, 'error');
            }
        );
    };

    const fetchListBookingLocation = () => {
        if (listBookingLocation && listBookingLocation.length > 0) {
            setBooking({
                ...booking,
                address: listBookingLocation[0].address,
                description: listBookingLocation[0].description,
                longtitude: listBookingLocation[0].longtitude,
                latitude: listBookingLocation[0].latitude
            });
            setLocationActive(listBookingLocation[0]);
        } else {
            rxUtil(
                Rx.BOOKING.GET_LIST_BOOKING_LOCATION,
                'GET',
                null,
                {
                    Authorization: token
                },
                (res) => {
                    const listLocationFromAPI = res.data.data;
                    if (listLocationFromAPI.length > 0) {
                        dispatch(setListBookingLocation(listLocationFromAPI));
                        setLocationActive(listLocationFromAPI[0]);
                    }
                },
                (res) => ToastHelpers.renderToast(res.data.message, 'error'),
                (res) => ToastHelpers.renderToast(res.data.message, 'error')
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
            (res) => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast(res.data.message, 'error');
            },
            (res) => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast(res.data.message, 'error');
            }
        );
    };

    const onSubmitBooking = () => {
        const {
            params: {
                partner
            }
        } = route;

        const dateString = `${moment(selectedDate, 'DD-MM-YYYY').format('YYYY-MM-DD')}T00:00:00`;
        const startString = convertStringHoursToMinutes(startTimeStr);
        const endString = convertStringHoursToMinutes(endTimeStr);

        const bookingToSubmit = {
            StartAt: startString,
            EndAt: endString,
            Date: dateString,
            Address: locationActive.address,
            Longtitude: locationActive.longtitude,
            Latitude: locationActive.latitude,
            Description: locationActive.description,
            Noted: 'N/A'
        };

        setIsShowSpinner(true);

        rxUtil(
            `${Rx.BOOKING.SCHEDULE_BOOKING}/${partner.id}`,
            'POST',
            bookingToSubmit,
            {
                Authorization: token
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'success');
                navigation.reset({
                    index: 0,
                    routes: [{ name: ScreenName.PERSONAL }],
                });
                getListBooking();
                dispatch(setPersonTabActiveIndex(2));
            },
            (res) => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast();
                ToastHelpers.renderToast(res.data.message, 'error');
            },
            (res) => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast(res.data.message, 'error');
            }
        );
    };

    const getListBooking = () => {
        const pagingStr = '?pageIndex=1&pageSize=100';

        rxUtil(
            `${Rx.BOOKING.GET_MY_BOOKING_AS_CUSTOMER}${pagingStr}`,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                dispatch(setListBookingStore(res.data.data));
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
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

    const calculateTotalAmount = (start, end) => {
        if (total !== 0) return total;
        const { earningExpected } = route.params.partner;
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

    const onChangeHourTimePicker = (data) => {
        setTotal(0);
        if (modalActiveType === 'start') {
            const startTimeArr = startTimeStr.split(':');
            startTimeArr[0] = data;
            setStartTimeStr(startTimeArr.join(':'));

            const endTimeArr = endTimeStr.split(':');
            endTimeArr[0] = +data + 2;
            setEndTimeStr(endTimeArr.join(':'));
        } else {
            const endTimeArr = endTimeStr.split(':');
            endTimeArr[0] = data;
            setEndTimeStr(endTimeArr.join(':'));
        }
    };

    const onChangeMinuteTimePicker = (data) => {
        setTotal(0);
        if (modalActiveType === 'start') {
            const startTimeArr = startTimeStr.split(':');
            startTimeArr[1] = data;
            setStartTimeStr(startTimeArr.join(':'));

            const endTimeArr = endTimeStr.split(':');
            endTimeArr[1] = data;
            setEndTimeStr(endTimeArr.join(':'));
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

    const renderPartnerPackage = () => (
        <Block
            row
            space="between"
            style={{
                justifyContent: 'center',
                width: NowTheme.SIZES.WIDTH_BASE * 0.8
            }}
        >
            {listPartnerPackage && packageActive && (
                <Block
                    style={{
                        width: NowTheme.SIZES.WIDTH_BASE * 0.8,
                    }}
                >
                    <Picker
                        selectedValue={packageActive.id}
                        onValueChange={(itemValue) => onChangePackage(itemValue)}
                        fontFamily={NowTheme.FONT.MONTSERRAT_REGULAR}
                    >
                        {listPartnerPackage.map((item) => (
                            <Picker.Item value={item.id} label={item.title} key={item.id} />
                        ))}
                    </Picker>
                    <Block
                        row
                        space="around"
                    >
                        <Text
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                color: NowTheme.COLORS.ACTIVE,
                                fontSize: NowTheme.SIZES.FONT_H1,
                                marginBottom: 10
                            }}
                        >
                            {convertMinutesToStringHours(packageActive.startAt)}
                        </Text>
                        <Text
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                color: NowTheme.COLORS.ACTIVE,
                                fontSize: NowTheme.SIZES.FONT_H1,
                                marginBottom: 10
                            }}
                        >
                            {convertMinutesToStringHours(packageActive.endAt)}
                        </Text>
                    </Block>

                    <Text
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                            color: NowTheme.COLORS.DEFAULT,
                            fontSize: NowTheme.SIZES.FONT_H3,
                            marginBottom: 10
                        }}
                    >
                        {packageActive.description}
                    </Text>
                    <Text
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                            color: NowTheme.COLORS.DEFAULT,
                            fontSize: NowTheme.SIZES.FONT_H3,
                            marginBottom: 10
                        }}
                    >
                        {`Lời nhắn từ đối tác: ${packageActive.noted}`}
                    </Text>
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
                            {packageActive.totalAmount}
                            {' '}
                            <IconCustom
                                name="diamond"
                                family={IconFamily.SIMPLE_LINE_ICONS}
                                size={20}
                                color={NowTheme.COLORS.ACTIVE}
                            />
                        </Text>
                    </Block>
                </Block>
            )}
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
                            size={NowTheme.SIZES.FONT_H2}
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
                                style={{ marginVertical: 10 }}
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
                                style={{ marginVertical: 10 }}
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

    const renderPartnerPackageModal = () => (
        <Modal
            animationType="slide"
            transparent
            visible={modalPartnerPackageVisible}
        >
            <Block
                style={{
                    marginTop: -NowTheme.SIZES.HEIGHT_BASE * 0.17
                }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <Block style={styles.centeredView}>
                        <Block style={styles.modalView}>
                            {renderPartnerPackage()}

                            <Block
                                row
                                space="between"
                                style={{
                                    paddingVertical: 10,
                                    width: NowTheme.SIZES.WIDTH_BASE * 0.8
                                }}
                            >
                                <Button
                                    shadowless
                                    onPress={() => {
                                        setModalPartnerPackageVisible(false);
                                        const startHourString = convertMinutesToStringHours(
                                            packageActive.startAt
                                        );

                                        const endHourString = convertMinutesToStringHours(
                                            packageActive.endAt
                                        );

                                        setStartTimeStr(startHourString);
                                        setEndTimeStr(endHourString);

                                        setTotal(packageActive.totalAmount);
                                    }}
                                    style={{
                                        margin: 0,
                                        width: NowTheme.SIZES.WIDTH_BASE * 0.39
                                    }}
                                >
                                    Xác nhận
                                </Button>
                                <Button
                                    shadowless
                                    color={NowTheme.COLORS.DEFAULT}
                                    style={{
                                        margin: 0,
                                        width: NowTheme.SIZES.WIDTH_BASE * 0.39
                                    }}
                                    onPress={() => {
                                        setModalPartnerPackageVisible(false);
                                    }}
                                >
                                    Huỷ bỏ
                                </Button>
                            </Block>
                        </Block>
                    </Block>
                </ScrollView>
            </Block>
        </Modal>
    );

    const renderButtonTimePicker = () => (
        <Block
            space="between"
            row
            style={{
                marginBottom: 30,
                width: NowTheme.SIZES.WIDTH_BASE * 0.9,
            }}
        >
            <Button
                shadowless
                color={NowTheme.COLORS.TRANSPARENT}
                style={[
                    styles.timePickerButton,
                    {

                        marginLeft: 0
                    }]}
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
                style={styles.timePickerButton}
                textStyle={styles.timePickerText}
                onPress={() => {
                    setModalActiveType('end');
                    setModalTimePickerVisible(true);
                    onClickTriggerTimePicker('end');
                }}
            >
                {endTimeStr}
            </Button>
            {/* {renderIconShowModal()} */}
        </Block>
    );

    const renderAlert = () => (
        Alert.alert(
            'Huỷ bỏ?',
            'Bạn có chắc muốn huỷ đặt hẹn?',
            [
                {
                    text: 'Tiếp tục đặt',
                    onPress: (res) => ToastHelpers.renderToast(res.data.message, 'error'),
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

    const onChangeLocation = (locationIdInput) => {
        const locationChoose = listBookingLocation.find((item) => item.id === locationIdInput);

        if (locationChoose) {
            setLocationActive(locationChoose);
        }
    };

    const onChangePackage = (packageIdInput) => {
        const packageChoose = listPartnerPackage.find((item) => item.id === packageIdInput);

        if (packageChoose) {
            setPackageActive(packageChoose);
        }
    };

    const renderLocationPicker = () => (
        <>
            {locationActive && (
                <Block
                    style={{
                        marginBottom: 10
                    }}
                >
                    <Picker
                        selectedValue={locationActive.id}
                        onValueChange={(itemValue) => onChangeLocation(itemValue)}
                        fontFamily={NowTheme.FONT.MONTSERRAT_REGULAR}
                        style={[
                            styles.inputWith, {
                                marginTop: -30
                            }
                        ]}
                    >
                        {listBookingLocation.map((item) => (
                            <Picker.Item value={item.id} label={item.name} key={item.id} />
                        ))}
                    </Picker>
                    <Text
                        fontFamily={NowTheme.FONT.MONTSERRAT_REGULAR}
                        color={NowTheme.COLORS.ACTIVE}
                        size={NowTheme.SIZES.FONT_H2}
                    >
                        {locationActive.address}
                    </Text>
                </Block>
            )}
        </>
    );

    const renderFormBlock = (partner) => (
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
                    selectedDate={selectedDate}
                />

                {listPartnerPackage && listPartnerPackage.length !== 0 && (
                    <TouchableWithoutFeedback
                        containerStyle={{
                            width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                            alignSelf: 'center',
                            paddingVertical: 10,
                        }}
                        onPress={() => setModalPartnerPackageVisible(true)}
                    >
                        <Text
                            style={{
                                fontSize: NowTheme.SIZES.FONT_H3,
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                color: NowTheme.COLORS.ACTIVE
                            }}
                        >
                            Chọn gói đơn hẹn
                        </Text>
                    </TouchableWithoutFeedback>
                )}

                {renderButtonTimePicker()}

                {renderLocationPicker()}
            </Block>
        </Block>
    );

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
                    size={NowTheme.SIZES.FONT_H1}
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
            {renderButtonPanel()}
        </Block>
    );

    const renderButtonPanel = () => (
        <Block
            row
            space="between"
            style={{
                paddingVertical: 10,
            }}
        >
            <Button
                shadowless
                onPress={() => onSubmitBooking()}
                style={styles.button}
            >
                Xác nhận
            </Button>
            <Button
                shadowless
                color={NowTheme.COLORS.DEFAULT}
                style={styles.button}
                onPress={() => renderAlert()}
            >
                Huỷ bỏ
            </Button>
        </Block>
    );

    // eslint-disable-next-line no-unused-vars
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
                    <CenterLoader />
                ) : (
                    <>
                        <KeyboardAwareScrollView
                            style={{
                                width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                                alignSelf: 'center'
                            }}
                            showsVerticalScrollIndicator={false}
                        >
                            {renderModal()}
                            {renderTimePickerModal()}
                            {/* <Block
                                style={{
                                    marginTop: -100
                                }}
                            >
                                {renderPartnerPackageModal()}
                            </Block> */}
                            {renderPartnerPackageModal()}
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
        fontSize: NowTheme.SIZES.FONT_H2
    },
    timePickerButton: {
        borderWidth: 1,
        borderColor: NowTheme.COLORS.ACTIVE,
        borderRadius: 5,
        margin: 0,
        // width: NowTheme.SIZES.WIDTH_BASE * 0.37
        width: NowTheme.SIZES.WIDTH_BASE * 0.44
    },
    button: {
        margin: 0,
        width: NowTheme.SIZES.WIDTH_BASE * 0.44
    },
});
