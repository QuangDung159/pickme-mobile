import { Block, Text } from 'galio-framework';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Line, Button } from '../components/uiComponents';
import { NowTheme } from '../constants';

export default function BookingProgressFlow() {
    return (
        <Block style={{
            marginHorizontal: 10
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
                <Block row>
                    <Button
                        round
                        shadowless
                        style={styles.stepIndicator}
                        fontFamily={NowTheme.FONT.MONTSERRAT_BOLD}
                        fontColor={NowTheme.COLORS.BASE}
                        color={NowTheme.COLORS.ACTIVE}
                        fontSize={16}
                    >
                        1
                    </Button>

                    <Block
                        middle
                        style={{
                            marginLeft: 10
                        }}
                    >
                        <Text
                            color={NowTheme.COLORS.DEFAULT}
                            size={16}
                            fontFamily={NowTheme.FONT.MONTSERRAT_REGULAR}
                            numberOfLines={2}
                        >
                            Đơn hẹn được xác nhận bởi Khả Ngân
                        </Text>
                    </Block>
                </Block>
            </Block>
        </Block>
    );
}

const styles = StyleSheet.create({
    stepIndicator: {
        width: NowTheme.SIZES.BASE * 3,
        height: NowTheme.SIZES.BASE * 3,
        borderRadius: NowTheme.SIZES.BASE * 1.5,
        justifyContent: 'center',
        marginHorizontal: 5
    },
});
