/* eslint-disable camelcase */
import { CustomCalendar } from '@components/businessComponents';
import {
    CenterLoader, CustomButton, CustomInput, CustomModal, IconCustom
} from '@components/uiComponents';
import {
    DateTimeConst, IconFamily, NowTheme, ScreenName
} from '@constants/index';
import { CommonHelpers, ToastHelpers } from '@helpers/index';
import { Picker } from '@react-native-picker/picker';
import { setListBookingStore, setPersonTabActiveIndex } from '@redux/Actions';
import { BookingServices } from '@services/index';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    Alert, SafeAreaView, StyleSheet, Text, View
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ScrollPicker from 'react-native-wheel-scroll-picker';
import { useDispatch, useSelector } from 'react-redux';
import PartnerBusyCalendarModal from './PartnerBusyCalendarModal';

const {
    FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = NowTheme;

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

    const [packageActive, setPackageActive] = useState();

    const [total, setTotal] = useState(0);

    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

    useEffect(
        () => {
            getCalendarPartner();
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
        const result = await BookingServices.fetchListPartnerPackageAsync(id);
        const { data } = result;

        if (data) {
            const listPackage = data.data;
            if (!listPackage || listPackage.length === 0) return;

            setListPartnerPackage(data.data);
            setPackageActive(data.data[0]);
        }
        setIsShowSpinner(false);
    };

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const getCalendarPartner = async () => {
        const {
            params: {
                partner
            }
        } = route;

        setIsShowSpinner(true);
        const result = await BookingServices.fetchPartnerBusyCalendarAsync(partner.id);
        const { data } = result;

        if (data) {
            setBusyCalendar(data.data);
        }
        setIsShowSpinner(false);
    };

    const onSubmitBooking = async () => {
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
            Address: booking.address || 'N/a',
            Longtitude: booking.longtitude || 0,
            Latitude: booking.latitude || 0,
            Description: 'N/a',
            Noted: booking.noted,
            totalAmount: total !== 0 ? total : calculateTotalAmount(startTimeStr, endTimeStr)
        };

        setIsShowSpinner(true);
        const result = await BookingServices.submitScheduleBookingAsync(partner.id, bookingToSubmit);
        const { data } = result;

        if (data) {
            ToastHelpers.renderToast(data.message, 'success');
            getListBooking();
            dispatch(setPersonTabActiveIndex(2));
            navigation.reset({
                index: 0,
                routes: [{ name: ScreenName.PERSONAL }],
            });
        }
        setIsShowSpinner(false);
    };

    const getListBooking = async () => {
        const result = await BookingServices.fetchListBookingAsync();
        const { data } = result;

        if (data) {
            dispatch(setListBookingStore(data.data));
        }
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
        <View
            style={{
                alignSelf: 'center',
                width: SIZES.WIDTH_BASE * 0.8,
                marginVertical: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: COLORS.BASE
            }}
        >
            <ScrollPicker
                dataSource={hourArr}
                selectedIndex={
                    modalActiveType === 'start' ? startHourActive : endHourActive
                }
                renderItem={(data) => (
                    <Text>
                        {`${data}`}
                    </Text>
                )}
                onValueChange={(data) => {
                    onChangeHourTimePicker(data);
                }}
                wrapperHeight={120}
                wrapperWidth={150}
                wrapperBackground={COLORS.BLOCK}
                itemHeight={40}
                highlightColor={COLORS.BASE}
                highlightBorderWidth={2}
                activeItemTextStyle={{
                    color: COLORS.ACTIVE,
                    fontFamily: MONTSERRAT_REGULAR,
                    fontSize: SIZES.FONT_H1
                }}
                itemTextStyle={{
                    color: COLORS.DEFAULT,
                    fontFamily: MONTSERRAT_REGULAR,
                    fontSize: SIZES.FONT_H1
                }}
            />

            <ScrollPicker
                dataSource={minuteArr}
                selectedIndex={
                    modalActiveType === 'start' ? startMinuteActive : endMinuteActive
                }
                renderItem={(data) => (
                    <Text>
                        {`${data}`}
                    </Text>
                )}
                onValueChange={(data) => {
                    onChangeMinuteTimePicker(data);
                }}
                wrapperHeight={120}
                wrapperWidth={150}
                wrapperBackground={COLORS.BLOCK}
                itemHeight={40}
                highlightColor={COLORS.BASE}
                highlightBorderWidth={2}
                activeItemTextStyle={{
                    color: COLORS.ACTIVE,
                    fontFamily: MONTSERRAT_REGULAR,
                    fontSize: SIZES.FONT_H1
                }}
                itemTextStyle={{
                    color: COLORS.DEFAULT,
                    fontFamily: MONTSERRAT_REGULAR,
                    fontSize: SIZES.FONT_H1
                }}
            />
        </View>
    );

    const renderPartnerPackage = () => (
        <View
            style={{
                width: SIZES.WIDTH_BASE * 0.8,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}
        >
            {listPartnerPackage && packageActive && (
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.8,
                    }}
                >
                    <Picker
                        selectedValue={packageActive.id}
                        onValueChange={(itemValue) => onChangePackage(itemValue)}
                        fontFamily={MONTSERRAT_REGULAR}
                        itemStyle={{
                            fontSize: SIZES.FONT_H2,
                            color: COLORS.DEFAULT
                        }}
                    >
                        {listPartnerPackage.map((item) => (
                            <Picker.Item value={item.id} label={item.title} key={item.id} />
                        ))}
                    </Picker>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around'
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: MONTSERRAT_REGULAR,
                                color: COLORS.ACTIVE,
                                fontSize: SIZES.FONT_H1,
                                marginBottom: 10,
                            }}
                        >
                            {convertMinutesToStringHours(packageActive.startAt)}
                        </Text>
                        <Text
                            style={{
                                fontFamily: MONTSERRAT_REGULAR,
                                color: COLORS.ACTIVE,
                                fontSize: SIZES.FONT_H1,
                                marginBottom: 10
                            }}
                        >
                            {convertMinutesToStringHours(packageActive.endAt)}
                        </Text>
                    </View>

                    <Text
                        style={{
                            fontFamily: MONTSERRAT_REGULAR,
                            color: COLORS.DEFAULT,
                            fontSize: SIZES.FONT_H2,
                            marginBottom: 10
                        }}
                    >
                        {`Địa điểm: ${packageActive.address}`}
                    </Text>
                    <Text
                        style={{
                            fontFamily: MONTSERRAT_REGULAR,
                            color: COLORS.DEFAULT,
                            fontSize: SIZES.FONT_H2,
                            marginBottom: 10
                        }}
                    >
                        {`Lời nhắn từ đối tác: ${packageActive.noted}`}
                    </Text>
                    <View
                        style={{
                            alignSelf: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: MONTSERRAT_BOLD,
                                fontSize: 30,
                                paddingVertical: 10,
                                color: COLORS.ACTIVE
                            }}
                        >
                            {CommonHelpers.generateMoneyStr(packageActive.estimateAmount)}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );

    const renderTimePickerModal = () => (
        <CustomModal
            modalVisible={modalTimePickerVisible}
            renderContent={() => (
                <>
                    {renderTimePicker()}
                    <View
                        style={{
                            alignSelf: 'center'
                        }}
                    >
                        <CustomButton
                            onPress={() => setModalTimePickerVisible(false)}
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.8,
                                marginVertical: 10
                            }}
                            type="active"
                            label="Đóng"
                        />
                    </View>
                </>
            )}
        />
    );

    const renderPartnerPackageModal = () => (
        <CustomModal
            modalVisible={modalPartnerPackageVisible}
            renderContent={() => (
                <>
                    {renderPartnerPackage()}

                    <View
                        style={{
                            paddingVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.8,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >

                        <CustomButton
                            onPress={() => {
                                setModalPartnerPackageVisible(false);
                            }}
                            type="default"
                            label="Huỷ bỏ"
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.39
                            }}
                        />
                        <CustomButton
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
                                setTotal(packageActive.estimateAmount);
                                setBooking({
                                    ...booking,
                                    noted: packageActive.noted,
                                    address: packageActive.address
                                });
                            }}
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.39
                            }}
                            type="active"
                            label="Xác nhận"
                        />
                    </View>
                </>
            )}
        />
    );

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

    const renderAlert = () => (
        Alert.alert(
            'Huỷ bỏ?',
            'Bạn có chắc muốn huỷ đặt hẹn?',
            [
                {
                    text: 'Tiếp tục đặt',
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

    const onChangePackage = (packageIdInput) => {
        const packageChoose = listPartnerPackage.find((item) => item.id === packageIdInput);

        if (packageChoose) {
            setPackageActive(packageChoose);
        }
    };

    // const onChangeAddressGoogle = (input) => {
    //     const {
    //         formatted_address, geometry: {
    //             location: {
    //                 lgn, lat
    //             }
    //         }
    //     } = input;

    //     setBooking({
    //         ...booking,
    //         address: `${formatted_address}`,
    //         longtitude: lgn,
    //         latitude: lat
    //     });
    // };

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

    const renderFormView = (partner) => (
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

                {/* <GooglePlacesInput
                    label="Địa điểm (google API):"
                    onChangeAddress={(detail) => onChangeAddressGoogle(detail)}
                    addressInput={booking.address}
                /> */}

                {renderInputAddress()}

                {renderInputNote()}
            </View>
        </View>
    );

    const renderInfoView = (partner) => {
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

    const renderTotal = () => (
        <View>
            <View
                style={{
                    alignSelf: 'center',
                    width: SIZES.WIDTH_BASE * 0.9,
                    marginTop: 20,
                    marginBottom: 15
                }}
            >
                <Text
                    style={{
                        fontFamily: MONTSERRAT_BOLD,
                        fontSize: 30,
                        color: COLORS.ACTIVE,
                        textAlign: 'center',
                        marginBottom: 10
                    }}
                >
                    {CommonHelpers.generateMoneyStr(calculateTotalAmount(startTimeStr, endTimeStr))}
                </Text>

                {renderButtonPanel()}
            </View>

        </View>
    );

    const renderButtonPanel = () => (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}
        >
            <CustomButton
                onPress={() => renderAlert()}
                type="default"
                label="Huỷ bỏ"
            />
            <CustomButton
                onPress={() => onSubmitBooking()}
                type="active"
                label="Xác nhận"
            />
        </View>
    );

    // eslint-disable-next-line no-unused-vars
    const renderIconShowModal = () => (
        <View
            style={{
                alignSelf: 'center',
                alignItems: 'center'
            }}
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
                    color={COLORS.ACTIVE}
                />
            </TouchableWithoutFeedback>
        </View>
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
                    <SafeAreaView>
                        <KeyboardAwareScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                marginTop: 5
                            }}
                        >
                            <PartnerBusyCalendarModal
                                listBusyBySelectedDate={listBusyBySelectedDate}
                                modalVisible={modalVisible}
                                setModalVisible={setModalVisible}
                            />

                            {renderTimePickerModal()}
                            {renderPartnerPackageModal()}
                            <View
                                style={{
                                    backgroundColor: COLORS.BLOCK,
                                    width: SIZES.WIDTH_BASE
                                }}
                            >
                                {renderFormView(partner)}
                            </View>

                            <View
                                style={{
                                    backgroundColor: COLORS.BLOCK,
                                    width: SIZES.WIDTH_BASE,
                                    marginTop: 5,
                                    paddingBottom: 20
                                }}
                            >
                                {renderTotal()}
                            </View>
                        </KeyboardAwareScrollView>
                    </SafeAreaView>
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
        fontFamily: MONTSERRAT_BOLD,
        marginVertical: 10
    },
    timePickerText: {
        color: COLORS.ACTIVE,
        fontFamily: MONTSERRAT_BOLD,
        fontSize: SIZES.FONT_H2
    },
});
