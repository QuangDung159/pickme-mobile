import { Picker } from '@react-native-picker/picker';
import {
    Block, Text
} from 'galio-framework';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    Alert, StyleSheet
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ScrollPicker from 'react-native-wheel-scroll-picker';
import { useDispatch, useSelector } from 'react-redux';
import { CustomCalendar } from '../../components/businessComponents';
import {
    CenterLoader, CustomButton, CustomInput, CustomModal, IconCustom, Line
} from '../../components/uiComponents';
import {
    DateTimeConst, IconFamily, NowTheme, Rx, ScreenName
} from '../../constants';
import { ToastHelpers } from '../../helpers';
import { setListBookingStore, setPersonTabActiveIndex } from '../../redux/Actions';
import { rxUtil } from '../../utils';

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

    const token = useSelector((state) => state.userReducer.token);
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
        rxUtil(
            `${Rx.BOOKING.GET_PARTNER_PACKAGE}/${id}`,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                const listPackage = res.data.data;
                if (!listPackage || listPackage.length === 0) return;

                setListPartnerPackage(res.data.data);
                setPackageActive(res.data.data[0]);
                setIsShowSpinner(false);

                console.log('res.data.data[0] :>> ', res.data.data[0]);
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
            Address: booking.address,
            Longtitude: '10.7723912895038',
            Latitude: '106.63063360556724',
            Description: 'locationActive.description',
            Noted: booking.noted,
            totalAmount: total !== 0 ? total : calculateTotalAmount(startTimeStr, endTimeStr)
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
                width: SIZES.WIDTH_BASE * 0.8,
                marginVertical: 10
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
                            fontFamily: MONTSERRAT_REGULAR
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
                            fontFamily: MONTSERRAT_REGULAR
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
                width: SIZES.WIDTH_BASE * 0.8
            }}
        >
            {listPartnerPackage && packageActive && (
                <Block
                    style={{
                        width: SIZES.WIDTH_BASE * 0.8,
                    }}
                >
                    <Picker
                        selectedValue={packageActive.id}
                        onValueChange={(itemValue) => onChangePackage(itemValue)}
                        fontFamily={MONTSERRAT_REGULAR}
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
                                fontFamily: MONTSERRAT_REGULAR,
                                color: COLORS.ACTIVE,
                                fontSize: SIZES.FONT_H1,
                                marginBottom: 10
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
                    </Block>

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
                    <Block
                        middle
                    >
                        <Text
                            style={{
                                fontFamily: MONTSERRAT_BOLD,
                                fontSize: 30,
                                paddingVertical: 10
                            }}
                            color={COLORS.ACTIVE}
                        >
                            {`${packageActive.estimateAmount}k`}
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
                                ? COLORS.LIST_ITEM_BACKGROUND_1
                                : COLORS.LIST_ITEM_BACKGROUND_2,
                            height: SIZES.HEIGHT_BASE * 0.07,
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
                                        fontFamily: MONTSERRAT_REGULAR
                                    }}
                                    size={27}
                                    color={COLORS.ACTIVE}
                                >
                                    {startStr}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: MONTSERRAT_REGULAR
                                    }}
                                    size={27}
                                    color={COLORS.ACTIVE}
                                >
                                    -
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: MONTSERRAT_REGULAR
                                    }}
                                    size={27}
                                    color={COLORS.ACTIVE}
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
        <CustomModal
            modalVisible={modalVisible}
            renderContent={() => (
                <>
                    <Text
                        size={SIZES.FONT_H2}
                        style={{
                            fontFamily: MONTSERRAT_REGULAR,
                            marginVertical: 10
                        }}
                    >
                        Lịch bận của đối tác
                    </Text>
                    <Block
                        style={{
                            width: SIZES.WIDTH_BASE * 0.8
                        }}
                    >
                        {renderBusyCalendar()}
                    </Block>

                    <Block center>
                        <CustomButton
                            onPress={() => setModalVisible(false)}
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.8,
                                marginVertical: 10
                            }}
                            type="active"
                            label="Đóng"
                        />
                    </Block>
                </>
            )}
        />
    );

    const renderTimePickerModal = () => (
        <CustomModal
            modalVisible={modalTimePickerVisible}
            renderContent={() => (
                <>
                    {renderTimePicker()}
                    <Block center>
                        <CustomButton
                            onPress={() => setModalTimePickerVisible(false)}
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.8,
                                marginVertical: 10
                            }}
                            type="active"
                            label="Đóng"
                        />
                    </Block>
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

                    <Block
                        row
                        space="between"
                        style={{
                            paddingVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.8
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
                    </Block>
                </>
            )}
        />
    );

    const renderButtonTimePicker = () => (
        <Block
            space="between"
            row
            style={{
                marginBottom: 10,
                width: SIZES.WIDTH_BASE * 0.9,
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
        </Block>
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

        console.log('packageChoose :>> ', packageChoose);
        if (packageChoose) {
            setPackageActive(packageChoose);
        }
    };

    const onChangeAddress = (input) => {
        setBooking({
            ...booking,
            address: input,
        });
    };

    const onChangeNote = (input) => {
        setBooking({
            ...booking,
            noted: input,
        });
    };

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

    const renderFormBlock = (partner) => (
        <Block
            style={{
                zIndex: 99,
            }}
            flex
        >
            <Block>
                <Text style={{
                    fontFamily: MONTSERRAT_REGULAR,
                    marginTop: 10
                }}
                >
                    THÔNG TIN CUỘC HẸN
                </Text>
                <Line
                    borderWidth={0.5}
                    borderColor={COLORS.ACTIVE}
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
                    color={COLORS.ACTIVE}
                    size={SIZES.FONT_H1}
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
                    fontFamily: MONTSERRAT_REGULAR,
                    marginTop: 10
                }}
                >
                    XÁC NHẬN ĐẶT
                </Text>
                <Line
                    borderWidth={0.5}
                    borderColor={COLORS.ACTIVE}
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
                        fontFamily: MONTSERRAT_BOLD,
                        fontSize: 30,
                        paddingVertical: 10
                    }}
                    color={COLORS.ACTIVE}
                >
                    {`${calculateTotalAmount(startTimeStr, endTimeStr)}k`}
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
                    color={COLORS.ACTIVE}
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
                        color={COLORS.SWITCH_OFF}
                        style={{
                            fontFamily: MONTSERRAT_REGULAR,
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
                                width: SIZES.WIDTH_BASE * 0.9,
                                alignSelf: 'center'
                            }}
                            showsVerticalScrollIndicator={false}
                        >
                            {renderModal()}
                            {renderTimePickerModal()}
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
        fontFamily: MONTSERRAT_BOLD,
        marginVertical: 10
    },
    timePickerText: {
        color: COLORS.ACTIVE,
        fontFamily: MONTSERRAT_BOLD,
        fontSize: SIZES.FONT_H2
    },
});
