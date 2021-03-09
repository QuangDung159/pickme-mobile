import { Block, Text } from 'galio-framework';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { IndicatorVerticalLine, Line, StepIndicator } from '../components/uiComponents';
import { NowTheme, BookingStatus } from '../constants';

export default function BookingProgressFlow({
    status, partner
}) {
    const { fullName } = partner;

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
            marginHorizontal: 10,
            marginTop: 20
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
                    content="Chờ thanh toán"
                />

                <IndicatorVerticalLine active={false} />

                <StepIndicator
                    type="next"
                    buttonText="4"
                    content="Thanh toán thành công"
                />

                <IndicatorVerticalLine active={false} />

                <StepIndicator
                    type="next"
                    buttonText="5"
                    content="Hoàn tất cuộc hẹn"
                />

                <IndicatorVerticalLine active={false} />

                <StepIndicator
                    type="next"
                    buttonText="6"
                    content="Đơn hẹn bị huỷ"
                />

            </Block>
        </Block>
    );
}

BookingProgressFlow.propTypes = {
    status: PropTypes.oneOf([
        BookingStatus.SCHEDULING,
        BookingStatus.FINISH_PAYMENT
    ]).isRequired,
    partner: PropTypes.object.isRequired
};
