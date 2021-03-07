import { Block, Button, Text } from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { CardBooking } from '../components/bussinessComponents';
import { CenterLoader, Line } from '../components/uiComponents';
import { NowTheme, Rx, ScreenName } from '../constants';
import { ToastHelpers } from '../helpers';
import { rxUtil } from '../utils';

export default function BookingDetail({
    route: {
        params: {
            from,
            booking: {
                id,
                status,
                isConfirm
            },
            booking
        }
    },
    navigation
}) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);

    const token = useSelector((state) => state.userReducer.token);

    useEffect(
        () => {
            const eventTriggerGetBookingDetail = navigation.addListener('focus', () => {
                if (from === ScreenName.BOOKING_CONFIRM) {
                // TODO: trigger call api get booking detail
                }
            });

            return eventTriggerGetBookingDetail;
        }, []
    );

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    const onCancelBooking = () => {
        setIsShowSpinner(true);

        rxUtil(
            `${Rx.BOOKING.CANCEL_BOOKING}/${id}`,
            'POST',
            null,
            {
                Authorization: token,
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
            `${Rx.BOOKING.COMPLETE_BOOKING}/${id}`,
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

    const onPartnerConfirmBooking = (bookingId) => {
        setIsShowSpinner(true);

        rxUtil(
            `${Rx.BOOKING.PARTNER_CONFIRM_BOOKING}/${bookingId}`,
            'POST',
            null,
            {
                Authorization: token
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message || 'Success.', 'success');
                navigation.navigate(ScreenName.BOOKING_LIST);
            },
            () => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast();
            },
            (errMessage) => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast(errMessage || 'Lỗi hệ thống, vui lòng thử lại.', 'error');
            }
        );
    };

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    const renderButton = (bookingId) => (
        <Block
            row
            center
            space="between"
        >
            <Button
                onPress={() => {
                    onPartnerConfirmBooking(bookingId);
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

    const renderAlert = () => (
        Alert.alert(
            'Huỷ bỏ?',
            'Bạn có chắc là không muốn nhận đơn hẹn này?',
            [
                {
                    text: 'Cân nhắc lại',
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: 'Tôi không muốn nhận',
                    onPress: () => {
                        // send notification to customer to update booking
                        // TODO

                        navigation.navigate(ScreenName.BOOKING_LIST);
                    }
                }
            ],
            { cancelable: false }
        )
    );

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

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader size="large" />
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <Block style={{
                            width: NowTheme.SIZES.WIDTH_BASE * 0.95,
                            alignSelf: 'center',
                            marginTop: 10
                        }}
                        >
                            <CardBooking booking={booking} showEditButton />
                            <Block style={{
                                marginHorizontal: 10
                            }}
                            >
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
                            </Block>

                            {status === 'Scheduling' && !isConfirm && (
                                renderButton(id)
                            )}

                            {status === 'FinishPayment' && (
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
