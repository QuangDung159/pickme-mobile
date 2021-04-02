import { Block, Button, Text } from 'galio-framework';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    Alert, Modal, RefreshControl, ScrollView, StyleSheet
} from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { useDispatch, useSelector } from 'react-redux';
import { CardBooking } from '../components/bussinessComponents';
import { CenterLoader, Line } from '../components/uiComponents';
import {
    BookingStatus, NowTheme, Rx, ScreenName
} from '../constants';
import BookingProgressFlow from '../containers/BookingProgressFlow';
import { ToastHelpers } from '../helpers';
import { setPersonTabActiveIndex } from '../redux/Actions';
import { rxUtil } from '../utils';

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
    const [modalVisible, setModalVisible] = useState(false);

    const token = useSelector((state) => state.userReducer.token);

    const dispatch = useDispatch();

    useEffect(
        () => {
            renderAlertRatingReport();
            fetchBookingDetailInfo();
            const eventTriggerGetBookingDetail = navigation.addListener('focus', () => {
                if (from === ScreenName.CREATE_BOOKING) {
                // TODO: trigger call api get booking detail after update booking
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

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const onCancelBooking = () => {
        setIsShowSpinner(true);

        rxUtil(
            `${Rx.BOOKING.CANCEL_BOOKING}/${bookingId}`,
            'POST',
            {
                rejectReason: 'Ban dot xuat'
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

        // renderAlertRatingReport();

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

    const renderAlertRatingReport = () => (
        Alert.alert(
            'Cảm ơn <3',
            'Bạn vui lòng đánh giá hoặc báo cáo về đối tác của chúng tôi.',
            [
                {
                    text: 'Đánh giá',
                    onPress: () => {
                        setModalVisible(true);
                    },
                    style: 'cancel'
                },
                {
                    text: 'Báo cáo',
                    onPress: () => {
                        renderAlertReport();
                    },
                }
            ],
            { cancelable: false }
        )
    );

    const renderAlertReport = () => (
        Alert.prompt(
            'Điều gì khiến bạn khó chịu',
            'Bạn vui lòng cho biết chúng tôi cần gì để phục vụ bạn tốt hơn, cảm ơn.',
            [
                {
                    text: 'Gửi báo cáo',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                }
            ],
            'plain-text'
        )
    );

    const renderRatingModal = () => (
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
                            Vui lòng đánh giá cuộc hẹn
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
                                defaultRating={5}
                                size={25}
                            />
                        </Block>

                        <Block center>
                            <Button
                                onPress={() => {
                                    setModalVisible(false);
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
                renderAlertForCustomer();
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

    const renderAlertForCustomer = () => {
        // getPartnerInfo();

        const { partnerInfo } = {};

        return (
            Alert.alert(
                'Huỷ bỏ?',
                'Bạn có chắc là muốn huỷ hẹn?',
                [
                    {
                        text: 'Cân nhắc lại',
                        onPress: () => {},
                        style: 'cancel'
                    },
                    {
                        text: 'Thay đổi thông tin đặt hẹn',
                        onPress: () => {
                            // TODO: send notification to customer to update booking

                            navigation.navigate(ScreenName.BOOKING_DETAIL, {
                                bookingToEdit: booking,
                                partner: partnerInfo,
                                fullName: partnerInfo.fullName,
                            });
                        }
                    },
                    {
                        text: 'Tôi muốn huỷ hẹn',
                        onPress: () => {
                            // send notification to customer to update booking
                            // TODO
                            onCancelBooking();
                        }
                    }
                ],
                { cancelable: false }
            )
        );
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
        if (isBookingGoingOn()) return null;

        if (isBookingDone()) {
            return (
                renderCompleteBookingButton(0.9)
            );
        }

        if (booking.isConfirm) {
            if (booking.status === BookingStatus.SCHEDULING) {
                return (
                    <>
                        {renderConfirmPaymentButton(0.44)}
                        {renderCancelBooking(0.44)}
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
                                showEditButton
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

                            {/* partner confirmed: payment, cancel
                            customer payemnt: cancel
                            booking is going on: N/A
                            booking done: complete => report/rating */}
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
});
