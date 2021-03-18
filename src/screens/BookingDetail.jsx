import { Block, Button, Text } from 'galio-framework';
import React, { useEffect, useState } from 'react';
import {
    Alert, RefreshControl, ScrollView, StyleSheet
} from 'react-native';
import { useSelector } from 'react-redux';
import { CardBooking } from '../components/bussinessComponents';
import { CenterLoader, Line } from '../components/uiComponents';
import {
    BookingStatus, NowTheme, Rx, ScreenName
} from '../constants';
import BookingProgressFlow from '../containers/BookingProgressFlow';
import { ToastHelpers } from '../helpers';
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
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [booking, setBooking] = useState();
    const [refreshing, setRefreshing] = useState(false);

    const token = useSelector((state) => state.userReducer.token);

    useEffect(
        () => {
            setIsShowSpinner(true);
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
            null,
            {
                Authorization: token
            },
            (res) => {
                navigation.navigate(ScreenName.BOOKING_LIST);
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

        rxUtil(
            `${Rx.BOOKING.COMPLETE_BOOKING}/${bookingId}`,
            'POST',
            null,
            {
                Authorization: token
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'success');
                navigation.navigate(ScreenName.BOOKING_LIST);
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

    const renderCompleteBookingButton = () => (
        <Block
            row
            center
            space="between"
        >
            <Button
                onPress={() => {
                    // TODO: call api complete
                    onClickCompleteBooking();
                }}
                shadowless
            >
                Chốt đặt hẹn
            </Button>

            <Button
                onPress={() => {
                    renderAlertRejectBooking();
                }}
                shadowless
                color={NowTheme.COLORS.DEFAULT}
            >
                Huỷ đặt hẹn
            </Button>
        </Block>
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
                navigation.navigate(ScreenName.BOOKING_LIST);
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

    const renderConfirmPaymentButton = () => (
        <Block
            row
            center
            space="between"
        >
            <Button
                onPress={() => {
                    onCustomerConfirmPayment(bookingId);
                }}
                shadowless
            >
                Thanh toán
            </Button>

            <Button
                onPress={() => {
                    renderAlertForCustomer();
                }}
                shadowless
                color={NowTheme.COLORS.DEFAULT}
            >
                Huỷ bỏ
            </Button>
        </Block>
    );

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
                                from: ScreenName.BOOKING_DETAIL
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

    const renderAlertRejectBooking = () => (
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

    if (booking) {
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
                        >
                            <Block style={{
                                width: NowTheme.SIZES.WIDTH_BASE * 0.95,
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
                                    renderAtScreen={ScreenName.BOOKING_DETAIL}
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
                                    size={16}
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

                                {booking.status === BookingStatus.SCHEDULING
                                && booking.isConfirm
                                && (
                                    renderConfirmPaymentButton(bookingId)
                                )}

                                {booking.status === BookingStatus.FINISH_PAYMENT && booking.isConfirm && (
                                    renderCompleteBookingButton()
                                )}
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
    return null;
}

const styles = StyleSheet.create({
    title: {
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
        marginBottom: 20
    },
    subTitle: {
        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
        marginBottom: 10
    }
});
