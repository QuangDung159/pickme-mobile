/* eslint-disable camelcase */
import {
    CenterLoader, IconCustom
} from '@components/uiComponents';
import {
    DateTimeConst, IconFamily, Theme, ScreenName
} from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import { BookingServices } from '@services/index';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import CreateBookingForm from './CreateBookingForm';
import PartnerBusyCalendarModal from './PartnerBusyCalendarModal';
import PartnerPackageModal from './PartnerPackageModal';
import TimePickerModal from './TimePickerModal';
import Total from './Total';

const {
    SIZES,
    COLORS
} = Theme;

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
    const [startTimeStr, setStartTimeStr] = useState('06:00');
    const [endTimeStr, setEndTimeStr] = useState('08:00');

    const [startHourActive, setStartHourActive] = useState(0);
    const [startMinuteActive, setStartMinuteActive] = useState(0);
    const [endHourActive, setEndHourActive] = useState(0);
    const [endMinuteActive, setEndMinuteActive] = useState(60);
    const [listPartnerPackage, setListPartnerPackage] = useState([]);

    const [packageActive, setPackageActive] = useState();

    const [total, setTotal] = useState(0);

    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

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

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

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
                    <SafeAreaView
                        style={{
                            flex: 1,
                            backgroundColor: COLORS.BLOCK
                        }}
                    >
                        <KeyboardAwareScrollView
                            // keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                marginTop: 5,
                            }}
                        >
                            <PartnerBusyCalendarModal
                                listBusyBySelectedDate={listBusyBySelectedDate}
                                modalVisible={modalVisible}
                                setModalVisible={setModalVisible}
                            />

                            <TimePickerModal
                                setTotal={setTotal}
                                modalActiveType={modalActiveType}
                                startTimeStr={startTimeStr}
                                setStartTimeStr={setStartTimeStr}
                                endTimeStr={endTimeStr}
                                setEndTimeStr={setEndTimeStr}
                                startHourActive={startHourActive}
                                endHourActive={endHourActive}
                                startMinuteActive={startMinuteActive}
                                endMinuteActive={endMinuteActive}
                                modalTimePickerVisible={modalTimePickerVisible}
                                setModalTimePickerVisible={setModalTimePickerVisible}
                            />

                            <PartnerPackageModal
                                listPartnerPackage={listPartnerPackage}
                                packageActive={packageActive}
                                setPackageActive={setPackageActive}
                                modalPartnerPackageVisible={modalPartnerPackageVisible}
                                setModalPartnerPackageVisible={setModalPartnerPackageVisible}
                                setStartTimeStr={setStartTimeStr}
                                setEndTimeStr={setEndTimeStr}
                                setTotal={setTotal}
                                setBooking={setBooking}
                                booking={booking}
                            />

                            <View
                                style={{
                                    backgroundColor: COLORS.BLOCK,
                                    width: SIZES.WIDTH_BASE
                                }}
                            >
                                <CreateBookingForm
                                    route={route}
                                    busyCalendar={busyCalendar}
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    setListBusyBySelectedDate={setListBusyBySelectedDate}
                                    hourArr={hourArr}
                                    startTimeStr={startTimeStr}
                                    setStartHourActive={setStartHourActive}
                                    minuteArr={minuteArr}
                                    setStartMinuteActive={setStartMinuteActive}
                                    endTimeStr={endTimeStr}
                                    setEndHourActive={setEndHourActive}
                                    setEndMinuteActive={setEndMinuteActive}
                                    setModalTimePickerVisible={setModalTimePickerVisible}
                                    setModalActiveType={setModalActiveType}
                                    listPartnerPackage={listPartnerPackage}
                                    setModalPartnerPackageVisible={setModalPartnerPackageVisible}
                                    booking={booking}
                                    setBooking={setBooking}
                                    partner={partner}
                                />
                            </View>

                            <View
                                style={{
                                    backgroundColor: COLORS.BLOCK,
                                    width: SIZES.WIDTH_BASE,
                                    marginTop: 5,
                                    paddingBottom: 20,
                                    marginBottom: 10
                                }}
                            >
                                <Total
                                    total={total}
                                    route={route}
                                    navigation={navigation}
                                    selectedDate={selectedDate}
                                    startTimeStr={startTimeStr}
                                    endTimeStr={endTimeStr}
                                    booking={booking}
                                    setIsShowSpinner={setIsShowSpinner}
                                />
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
