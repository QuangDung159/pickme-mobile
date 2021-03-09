import { Block, Text } from 'galio-framework';
import React from 'react';
import { StyleSheet } from 'react-native';
import { IndicatorVerticalLine, Line, StepIndicator } from '../components/uiComponents';
import { NowTheme } from '../constants';

export default function BookingProgressFlow() {
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
                    content="Khả Ngân từ chối cuộc hẹn"
                />

                <IndicatorVerticalLine />

                <StepIndicator
                    type="current"
                    buttonText="1"
                    content="Khả Ngân từ chối cuộc hẹn"
                />

                <IndicatorVerticalLine active={false} />

                <StepIndicator
                    type="next"
                    buttonText="1"
                    content="Khả Ngân từ chối cuộc hẹn"
                />

                <IndicatorVerticalLine active={false} />
            </Block>
        </Block>
    );
}

const styles = StyleSheet.create({
    stepIndicatorContainer: {
        width: 60,
    }
});
