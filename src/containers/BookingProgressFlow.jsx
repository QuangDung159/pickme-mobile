/* eslint-disable no-nested-ternary */
import { IndicatorVerticalLine, StepIndicator } from '@components/uiComponents';
import { BookingStatus, Theme } from '@constants/index';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';

const {
    FONT: {
        TEXT_REGULAR
    },
    SIZES,
    COLORS
} = Theme;

export default function BookingProgressFlow() {
    const currentBookingRedux = useSelector((state) => state.bookingReducer.currentBookingRedux);
    const {
        status,
        partnerId,
        customerId,
        canceledBy,
        canceledReason,
    } = currentBookingRedux;

    useEffect(() => {
        handleActiveStepByStatus();
    }, [currentBookingRedux]);

    const [stepArr, setStepArr] = useState([
        {
            type: 'prev',
            content: 'Đơn hẹn được tạo',
            buttonText: '1'
        },
        {
            type: 'current',
            content: ' Chờ Host xác nhận',
            buttonText: '2'
        },
        {
            type: 'next',
            content: 'Thanh toán',
            buttonText: '3'
        },
        {
            type: 'next',
            content: 'Cuộc hẹn bắt đầu',
            buttonText: '4'
        },
        {
            type: 'next',
            content: 'Hoàn tất',
            buttonText: '5'
        },
    ]);

    const handleActiveStepByStatus = () => {
        switch (status) {
            case BookingStatus.PAID: {
                setStepArr(
                    [
                        {
                            type: 'prev',
                            content: 'Đơn hẹn được tạo',
                            buttonText: '1'
                        },
                        {
                            type: 'prev',
                            content: 'Host xác nhận',
                            buttonText: '2'
                        },
                        {
                            type: 'prev',
                            content: 'Thanh toán thành công',
                            buttonText: '3'
                        },
                        {
                            type: 'current',
                            content: 'Cuộc hẹn bắt đầu',
                            buttonText: '4'
                        },
                        {
                            type: 'next',
                            content: 'Hoàn tất',
                            buttonText: '5'
                        }
                    ]
                );
                break;
            }
            case BookingStatus.COMPLETED: {
                setStepArr(
                    [
                        {
                            type: 'prev',
                            content: 'Đơn hẹn được tạo',
                            buttonText: '1'
                        },
                        {
                            type: 'prev',
                            content: 'Host xác nhận',
                            buttonText: '2'
                        },
                        {
                            type: 'prev',
                            content: 'Thanh toán thành công.',
                            buttonText: '3'
                        },
                        {
                            type: 'prev',
                            content: 'Cuộc hẹn bắt đầu',
                            buttonText: '4'
                        },
                        {
                            type: 'prev',
                            content: 'Hoàn tất',
                            buttonText: '5'
                        }
                    ]
                );
                break;
            }
            case BookingStatus.IS_CONFIRMED: {
                setStepArr(
                    [
                        {
                            type: 'prev',
                            content: 'Đơn hẹn được tạo',
                            buttonText: '1'
                        },
                        {
                            type: 'prev',
                            content: 'Host xác nhận',
                            buttonText: '2'
                        },
                        {
                            type: 'current',
                            content: 'Chờ thanh toán',
                            buttonText: '3'
                        },
                        {
                            type: 'next',
                            content: 'Cuộc hẹn bắt đầu',
                            buttonText: '4'
                        },
                        {
                            type: 'next',
                            content: 'Hoàn tất',
                            buttonText: '5'
                        }
                    ]
                );
                break;
            }
            default: {
                break;
            }
        }
    };

    return (
        <View
            style={{
                paddingVertical: 20,
            }}
        >
            {status !== BookingStatus.CANCEL ? (
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.9,
                        alignSelf: 'center'
                    }}
                >
                    {stepArr.map((item, index) => (
                        <View key={item.buttonText}>
                            <StepIndicator
                                type={item.type}
                                buttonText={item.buttonText}
                                content={item.content}
                            />
                            {index !== stepArr.length - 1
                            && (
                                <IndicatorVerticalLine
                                    active={item.type === 'prev'}
                                />
                            )}
                        </View>
                    ))}
                </View>
            ) : (
                <View
                    style={{
                        alignItems: 'center',
                        paddingVertical: 20,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: TEXT_REGULAR,
                            color: COLORS.DEFAULT,
                            fontSize: SIZES.FONT_H3
                        }}
                    >
                        {`Đơn hẹn đã bị huỷ bởi ${canceledBy === partnerId
                            ? 'Host'
                            : canceledBy === customerId
                                ? 'khách'
                                : 'hệ thống'}`}
                        {`\nLý do: ${canceledReason}`}
                    </Text>
                </View>
            )}
        </View>
    );
}
