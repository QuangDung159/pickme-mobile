import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { IndicatorVerticalLine, Line, StepIndicator } from '../components/uiComponents';
import { BookingStatus, NowTheme } from '../constants';

const {
    FONT: {
        MONTSERRAT_REGULAR,
    },
    SIZES,
    COLORS
} = NowTheme;

export default function BookingProgressFlow({
    booking
}) {
    const {
        partner: {
            fullName
        },
        status,
        isConfirm
    } = booking;

    const [stepArr, setStepArr] = useState([
        {
            type: 'prev',
            content: 'Đơn hẹn được tạo',
            buttonText: '1'
        },
        {
            type: 'current',
            content: `Chờ xác nhận từ ${fullName}`,
            buttonText: '2'
        },
        {
            type: 'next',
            content: 'Thanh toán',
            buttonText: '3'
        },
        {
            type: 'next',
            content: 'Cuộc hẹn sắp diễn ra',
            buttonText: '4'
        },
        {
            type: 'next',
            content: 'Hoàn tất',
            buttonText: '5'
        },
    ]);

    useEffect(
        () => {
            handleActiveStepByStatus();
        }, []
    );

    const handleActiveStepByStatus = () => {
        switch (status) {
            case BookingStatus.FINISH_PAYMENT: {
                setStepArr(
                    [
                        {
                            type: 'prev',
                            content: 'Đơn hẹn được tạo',
                            buttonText: '1'
                        },
                        {
                            type: 'prev',
                            content: `Chờ xác nhận từ ${fullName}`,
                            buttonText: '2'
                        },
                        {
                            type: 'prev',
                            content: 'Thanh toán',
                            buttonText: '3'
                        },
                        {
                            type: 'current',
                            content: 'Cuộc hẹn sắp diễn ra',
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
                            content: `Chờ xác nhận từ ${fullName}`,
                            buttonText: '2'
                        },
                        {
                            type: 'prev',
                            content: 'Thanh toán',
                            buttonText: '3'
                        },
                        {
                            type: 'prev',
                            content: 'Cuộc hẹn sắp diễn ra',
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
            case BookingStatus.SCHEDULING: {
                if (isConfirm) {
                    setStepArr(
                        [
                            {
                                type: 'prev',
                                content: 'Đơn hẹn được tạo',
                                buttonText: '1'
                            },
                            {
                                type: 'prev',
                                content: `Chờ xác nhận từ ${fullName}`,
                                buttonText: '2'
                            },
                            {
                                type: 'current',
                                content: 'Thanh toán',
                                buttonText: '3'
                            },
                            {
                                type: 'next',
                                content: 'Cuộc hẹn sắp diễn ra',
                                buttonText: '4'
                            },
                            {
                                type: 'next',
                                content: 'Hoàn tất',
                                buttonText: '5'
                            }
                        ]
                    );
                }
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
                marginBottom: 20,
            }}
        >
            <Text
                style={{
                    fontFamily: MONTSERRAT_REGULAR,
                }}
            >
                SƠ ĐỒ ĐẶT HẸN
            </Text>
            <Line
                borderWidth={0.5}
                borderColor={COLORS.ACTIVE}
                style={{
                    marginVertical: 10
                }}
            />

            {status !== BookingStatus.CANCEL ? (
                <View>
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
                        marginVertical: 15
                    }}
                >
                    <Text
                        style={{
                            fontFamily: MONTSERRAT_REGULAR,
                            color: COLORS.SWITCH_OFF,
                            fontSize: SIZES.FONT_H2
                        }}
                    >
                        Xin lỗi! Đơn hẹn đã bị huỷ
                    </Text>
                </View>
            )}
        </View>
    );
}

BookingProgressFlow.propTypes = {
    booking: PropTypes.object.isRequired
};
