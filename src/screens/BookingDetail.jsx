import { Block, Button, Text } from 'galio-framework';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    Alert, Modal, RefreshControl, ScrollView, StyleSheet
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { AirbnbRating } from 'react-native-ratings';
import { useDispatch, useSelector } from 'react-redux';
import { CardBooking } from '../components/bussinessComponents';
import { CenterLoader, Input, Line } from '../components/uiComponents';
import {
    BookingStatus, NowTheme, Rx, ScreenName
} from '../constants';
import BookingProgressFlow from '../containers/BookingProgressFlow';
import { ToastHelpers } from '../helpers';
import { setPersonTabActiveIndex } from '../redux/Actions';
import { rxUtil } from '../utils';

const reasonDropdownArr = [
    { label: 'Bận đột xuất', value: 0 },
    { label: 'Sai thông tin', value: 1 },
    { label: 'Lý do khác', value: 2 }
];

export default function BookingDetail({
    route: {
        params: {
            from,
            bookingId
        }
    },
    navigation
}) {
    const [isShowSpinner, setIsShowSpinner] = useState(true);
    const [booking, setBooking] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [modalRatingVisible, setModalRatingVisible] = useState(false);
    const [modalReportVisible, setModalReportVisible] = useState(false);
    const [modalReasonVisible, setModalReasonVisible] = useState(false);
    const [ratingValue, setRatingValue] = useState(4);
    const [reportDesc, setReportDesc] = useState();
    const [reasonDesc, setReasonDesc] = useState(reasonDropdownArr[0].label);

    const token = useSelector((state) => state.userReducer.token);

    const dispatch = useDispatch();

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    useEffect(
        () => {
            fetchBookingDetailInfo();
            const eventTriggerGetBookingDetail = navigation.addListener('focus', () => {
                if (from === ScreenName.CREATE_BOOKING) {
                    fetchBookingDetailInfo();
                }
            });

            return eventTriggerGetBookingDetail;
        }, []
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchBookingDetailInfo();
    };

    const fetchBookingDetailInfo = () => {
        rxUtil(
            `${Rx.BOOKING.DETAIL_BOOKING}/${bookingId}`,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setBooking(res.data.data);
                setRefreshing(false);
                setIsShowSpinner(false);
            },
            () => {
                setRefreshing(false);
                setIsShowSpinner(false);
            },
            () => {
                setRefreshing(false);
                setIsShowSpinner(false);
            }
        );
    };

    const sendRequestToCancelBooking = () => {
        setIsShowSpinner(true);
        rxUtil(
            `${Rx.BOOKING.CANCEL_BOOKING}/${bookingId}`,
            'POST',
            {
                rejectReason: reasonDesc
            },
            {
                Authorization: token
            },
            (res) => {
                navigation.navigate(ScreenName.PERSONAL);
                dispatch(setPersonTabActiveIndex(2));
                ToastHelpers.renderToast(res.data.message, 'success');
            },
            () => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast();
            },
            (errMessage) => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast(errMessage, 'error');
            }
        );
    };

    const onClickCompleteBooking = () => {
        setIsShowSpinner(true);

        renderAlertRatingReport();

        rxUtil(
            `${Rx.BOOKING.COMPLETE_BOOKING}/${bookingId}`,
            'POST',
            null,
            {
                Authorization: token
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'success');
                navigation.navigate(ScreenName.PERSONAL);
                dispatch(setPersonTabActiveIndex(2));
                setIsShowSpinner(false);
            },
            () => {
                ToastHelpers.renderToast();
                setIsShowSpinner(false);
            },
            (errMessage) => {
                ToastHelpers.renderToast(errMessage, 'error');
                setIsShowSpinner(false);
            }
        );
    };

    const sendRating = () => {
        rxUtil(
            `${Rx.BOOKING.BOOKING_RATE}/${bookingId}`,
            'POST',
            {
                score: reportDesc ? 2 : ratingValue,
                description: reportDesc || 'Rating'
            },
            {
                Authorization: token
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'success');
            },
            () => {},
            (catchRes) => {
                ToastHelpers.renderToast(catchRes);
            }
        );
    };

    const onChangeReport = (reportInput) => {
        setReportDesc(reportInput);
    };

    const convertMinutesToUnix = (minutes) => moment(booking.date)
        .startOf('day')
        .add(minutes, 'minutes')
        .unix();

    const isBookingGoingOn = () => {
        const currentUnix = moment().unix();
        const startTimestamp = convertMinutesToUnix(booking.startAt);
        const endTimestamp = convertMinutesToUnix(booking.endAt);

        return startTimestamp <= currentUnix && currentUnix <= endTimestamp;
    };

    const isBookingDone = () => {
        const currentUnix = moment().unix();
        const endTimestamp = convertMinutesToUnix(booking.endAt);

        return endTimestamp < currentUnix;
    };

    const handleShowButtonByStatus = () => {
        // partner confirmed: payment, cancel
        // customer payemnt: cancel
        // booking is going on: N/A
        // booking done: complete => report/rating
        if (isBookingGoingOn() || booking.status === BookingStatus.CANCEL) return null;

        if (isBookingDone()) {
            return (
                renderCompleteBookingButton(0.9)
            );
        }

        if (booking.isConfirm) {
            if (booking.status === BookingStatus.SCHEDULING) {
                return (
                    <>
                        {renderCancelBooking(0.44)}
                        {renderConfirmPaymentButton(0.44)}
                    </>
                );
            }

            if (booking.status === BookingStatus.FINISH_PAYMENT) {
                return (
                    renderCancelBooking(0.9)
                );
            }
        }

        return null;
    };

    const onCustomerConfirmPayment = () => {
        setIsShowSpinner(true);

        rxUtil(
            `${Rx.PAYMENT.CREATE_PAYMENT}/${bookingId}`,
            'POST',
            null,
            {
                Authorization: token
            },
            (res) => {
                navigation.navigate(ScreenName.PERSONAL);
                dispatch(setPersonTabActiveIndex(2));
                ToastHelpers.renderToast(res.message || 'Thao tác thành công.', 'success');
            },
            () => {
                ToastHelpers.renderToast();
                setIsShowSpinner(false);
            },
            (errMessage) => {
                ToastHelpers.renderToast(errMessage || 'Lỗi hệ thống, vui lòng thử lại.', 'error');
                setIsShowSpinner(false);
            }
        );
    };

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderAlertRatingReport = () => (
        Alert.alert(
            'Cảm ơn <3',
            'Bạn vui lòng đánh giá hoặc báo cáo về đối tác của chúng tôi.',
            [
                {
                    text: 'Đánh giá',
                    onPress: () => {
                        setModalRatingVisible(true);
                    },
                    style: 'cancel'
                },
                {
                    text: 'Báo cáo',
                    onPress: () => {
                        setModalReportVisible(true);
                    },
                }
            ],
            { cancelable: false }
        )
    );

    const renderRatingModal = () => (
        <Modal
            animationType="slide"
            transparent
            visible={modalRatingVisible}
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
                            Bạn vui lòng góp ý để chúng tôi phục vụ bạn tốt hơn, cảm ơn.
                        </Text>
                        <Block
                            style={{
                                width: NowTheme.SIZES.WIDTH_BASE * 0.75
                            }}
                        >
                            <AirbnbRating
                                count={5}
                                reviewSize={25}
                                reviews={['Tệ', 'Không ổn', 'Bình thường', 'Tốt', 'Tuyệt vời <3']}
                                defaultRating={ratingValue}
                                size={25}
                                onFinishRating={(ratingNumber) => {
                                    setRatingValue(ratingNumber);
                                }}
                            />
                        </Block>

                        <Block center>
                            <Button
                                onPress={() => {
                                    sendRating();
                                    setModalRatingVisible(false);
                                }}
                                style={{ marginVertical: 10 }}
                                shadowless
                            >
                                Gửi đánh giá
                            </Button>
                        </Block>
                    </Block>
                </Block>
            </ScrollView>
        </Modal>
    );

    const renderReasonDropdown = () => (
        <DropDownPicker
            items={reasonDropdownArr}
            defaultValue={reasonDropdownArr[0].value}
            containerStyle={[styles.inputWith, {
                height: 43,
                marginBottom: 10
            }]}
            selectedtLabelStyle={{
                color: 'red'
            }}
            placeholderStyle={{
                color: NowTheme.COLORS.MUTED
            }}
            itemStyle={{
                justifyContent: 'flex-start'
            }}
            activeLabelStyle={{ color: NowTheme.COLORS.ACTIVE }}
            onChangeItem={(item) => setReasonDesc(item.label)}
            labelStyle={{
                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
            }}
        />
    );

    const renderReasonCancelBookingModal = () => (
        <Modal
            animationType="slide"
            transparent
            visible={modalReasonVisible}
            style={{
                width: NowTheme.SIZES.WIDTH_BASE * 0.9
            }}
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
                            Vui lòng chọn lý do
                        </Text>
                        {renderReasonDropdown()}
                        <Block
                            middle
                            row
                            style={{
                                width: NowTheme.SIZES.WIDTH_BASE * 0.9
                            }}
                            space="between"
                        >
                            <Button
                                onPress={() => {
                                    sendRequestToCancelBooking();
                                    setModalReasonVisible(false);
                                }}
                                style={{
                                    margin: 0,
                                    width: NowTheme.SIZES.WIDTH_BASE * 0.44
                                }}
                                shadowless
                                color={
                                    NowTheme.COLORS.DEFAULT
                                }
                            >
                                Xác nhận huỷ
                            </Button>
                            <Button
                                onPress={() => {
                                    setModalReasonVisible(false);
                                }}
                                style={{
                                    margin: 0,
                                    width: NowTheme.SIZES.WIDTH_BASE * 0.44
                                }}
                                shadowless
                            >
                                Cân nhắc lại
                            </Button>
                        </Block>
                    </Block>
                </Block>
            </ScrollView>
        </Modal>
    );

    const renderReportModal = () => (
        <Modal
            animationType="slide"
            transparent
            visible={modalReportVisible}
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
                            Vui lòng nhập ý kiến
                        </Text>
                        <Input
                            style={[styles.inputWith, {
                                borderRadius: 5,
                            }]}
                            onChangeText={(reportInput) => onChangeReport(reportInput)}
                            value={reportDesc}
                            placeholder="Nhập mô tả..."
                        />
                        <Block center>
                            <Button
                                onPress={() => {
                                    sendRating();
                                    setModalReportVisible(false);
                                }}
                                style={{ marginVertical: 10 }}
                                shadowless
                            >
                                Gửi báo cáo
                            </Button>
                        </Block>
                    </Block>
                </Block>
            </ScrollView>
        </Modal>
    );

    const renderCompleteBookingButton = (width) => (
        <Button
            onPress={() => {
                // TODO: call api complete
                onClickCompleteBooking();
            }}
            shadowless
            style={{
                margin: 0,
                width: NowTheme.SIZES.WIDTH_BASE * width
            }}
        >
            Hoàn tất buổi hẹn
        </Button>
    );

    const renderCancelBooking = (width) => (
        <Button
            onPress={() => {
                setModalReasonVisible(true);
            }}
            shadowless
            color={NowTheme.COLORS.DEFAULT}
            style={{
                margin: 0,
                width: NowTheme.SIZES.WIDTH_BASE * width
            }}
        >
            Huỷ buổi hẹn
        </Button>
    );

    const renderConfirmPaymentButton = (width) => (
        <Button
            onPress={() => {
                onCustomerConfirmPayment(bookingId);
            }}
            shadowless
            style={{
                margin: 0,
                width: NowTheme.SIZES.WIDTH_BASE * (+width)
            }}
        >
            Thanh toán
        </Button>
    );

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader size="large" />
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={(
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => onRefresh()}
                            />
                        )}
                        contentContainerStyle={{
                            paddingBottom: 10
                        }}
                    >
                        {renderRatingModal()}
                        {renderReportModal()}
                        {renderReasonCancelBookingModal()}

                        <Block style={{
                            width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                            alignSelf: 'center',
                            marginTop: 10,
                        }}
                        >
                            <Text style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                            }}
                            >
                                CHI TIẾT ĐƠN HẸN
                            </Text>
                            <Line
                                borderWidth={0.5}
                                borderColor={NowTheme.COLORS.ACTIVE}
                                style={{
                                    marginVertical: 10
                                }}
                            />

                            <CardBooking
                                booking={booking}
                                navigation={navigation}
                            />

                            <BookingProgressFlow
                                status={booking.status}
                                partner={booking.partner}
                                booking={booking}
                            />

                            <Text style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                            }}
                            >
                                GHI CHÚ CUỘC HẸN
                            </Text>
                            <Line
                                borderWidth={0.5}
                                borderColor={NowTheme.COLORS.ACTIVE}
                                style={{
                                    marginVertical: 10
                                }}
                            />
                            <Text
                                color={NowTheme.COLORS.DEFAULT}
                                size={NowTheme.SIZES.FONT_H3}
                                style={styles.subTitle}
                            >
                                Lorem ipsum dolor, sit amet consectetur
                                adipisicing elit. Culpa, voluptates in
                                voluptate vel mollitia unde repellendus f
                                acere asperiores maxime velit esse sint eos ut minus,
                                possimus exercitationem. Reiciendis, sapiente quibusdam!
                                Lorem ipsum dolor, sit amet consectetur
                                adipisicing elit. Culpa, voluptates
                            </Text>

                            <Block
                                center
                                row
                                style={{
                                    width: NowTheme.SIZES.WIDTH_BASE * 0.9
                                }}
                                space="between"
                            >
                                {handleShowButtonByStatus()}
                            </Block>
                        </Block>
                    </ScrollView>
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
        marginBottom: 20
    },
    subTitle: {
        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
        marginBottom: 10
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
    inputWith: {
        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
    },
});
