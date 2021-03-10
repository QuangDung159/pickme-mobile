import { Block, Text } from 'galio-framework';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { IndicatorVerticalLine, Line, StepIndicator } from '../components/uiComponents';
import { BookingStatus, NowTheme } from '../constants';

export default function BookingProgressFlow({
    booking
}) {
    const {
        partner: {
            fullName
        },
        status
    } = booking;

    useEffect(
        () => {
            handleAcctiveStepByStatus();
        }, []
    );

    const handleAcctiveStepByStatus = () => {
        console.log('status', status);
    };

    return (
        <Block style={{
            marginBottom: 20
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
                    marginTop: 10,
                    marginBottom: 20
                }}
            />

            {status !== BookingStatus.CANCEL ? (
                <Block>
                    {/* progress item */}
                    <StepIndicator
                        type="prev"
                        buttonText="1"
                        content="Đơn hẹn được tạo"
                    />

                    <IndicatorVerticalLine />

                    <StepIndicator
                        type="current"
                        buttonText="2"
                        content={`Chờ xác nhận từ ${fullName}`}
                    />

                    <IndicatorVerticalLine active={false} />

                    <StepIndicator
                        type="next"
                        buttonText="3"
                        content="Thanh toán"
                    />

                    <IndicatorVerticalLine active={false} />

                    <StepIndicator
                        type="next"
                        buttonText="4"
                        content="Cuộc hẹn sắp diễn ra"
                    />

                    <IndicatorVerticalLine active={false} />

                    <StepIndicator
                        type="next"
                        buttonText="5"
                        content="Hoàn tất cuộc hẹn"
                    />

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
                        size={NowTheme.SIZES.FONT_INFO}
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
