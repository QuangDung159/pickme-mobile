import { Block, Text } from 'galio-framework';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { IndicatorVerticalLine, Line, StepIndicator } from '../components/uiComponents';
import { BookingStatus, NowTheme } from '../constants';

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
        <Block style={{
            marginBottom: 30,
        }}
        >
            <Text style={{
                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
            }}
            >
                SƠ ĐỒ ĐẶT HẸN
            </Text>
            <Line
                borderWidth={0.5}
                borderColor={NowTheme.COLORS.ACTIVE}
                style={{
                    marginVertical: 10
                }}
            />

            {status !== BookingStatus.CANCEL ? (
                <Block>
                    {stepArr.map((item, index) => (
                        <Block key={item.buttonText}>
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
                        </Block>
                    ))}
                </Block>
            ) : (
                <Block
                    style={{
                        alignItems: 'center',
                        marginVertical: 15
                    }}
                >
                    <Text
                        color={NowTheme.COLORS.SWITCH_OFF}
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        }}
                        size={NowTheme.SIZES.FONT_H2}
                    >
                        Xin lỗi! Đơn hẹn đã bị huỷ
                    </Text>
                </Block>
            )}
        </Block>
    );
}

BookingProgressFlow.propTypes = {
    booking: PropTypes.object.isRequired
};
