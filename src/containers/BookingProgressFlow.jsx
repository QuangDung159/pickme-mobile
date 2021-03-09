import { Block, Text } from 'galio-framework';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Line, Button } from '../components/uiComponents';
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
                <Block row>
                    <Block
                        style={styles.stepIndicatorContainer}
                    >
                        <Button
                            round
                            shadowless
                            style={styles.stepIndicatorPrev}
                            fontFamily={NowTheme.FONT.MONTSERRAT_BOLD}
                            fontSize={20}
                            fontColor={NowTheme.COLORS.BASE}
                        >
                            1
                        </Button>
                    </Block>

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

                <Block
                    middle
                    style={styles.stepIndicatorContainer}
                >
                    <Block
                        style={{
                            height: 30,
                            borderLeftWidth: 5,
                            borderColor: NowTheme.COLORS.ACTIVE,
                            justifyContent: 'center'
                        }}
                    />
                </Block>

                <Block row>
                    <Block
                        style={styles.stepIndicatorContainer}
                    >
                        <Button
                            round
                            shadowless
                            style={styles.stepIndicatorCurrent}
                            fontFamily={NowTheme.FONT.MONTSERRAT_BOLD}
                            fontSize={20}
                            fontColor={NowTheme.COLORS.ACTIVE}
                        >
                            1
                        </Button>
                    </Block>

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

                <Block
                    middle
                    style={styles.stepIndicatorContainer}
                >
                    <Block
                        style={{
                            height: 30,
                            borderLeftWidth: 5,
                            borderColor: NowTheme.COLORS.ACTIVE,
                            justifyContent: 'center'
                        }}
                    />
                </Block>

                <Block row>
                    <Block
                        style={styles.stepIndicatorContainer}
                    >
                        <Button
                            round
                            shadowless
                            style={styles.stepIndicatorNext}
                            fontFamily={NowTheme.FONT.MONTSERRAT_BOLD}
                            fontSize={20}
                            fontColor={NowTheme.COLORS.BASE}
                        >
                            1
                        </Button>
                    </Block>

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
        marginHorizontal: 5,
    },
    stepIndicatorCurrent: {
        width: NowTheme.SIZES.BASE * 3,
        height: NowTheme.SIZES.BASE * 3,
        borderRadius: NowTheme.SIZES.BASE * 1.5,
        justifyContent: 'center',
        marginHorizontal: 5,
        backgroundColor: NowTheme.COLORS.BASE,
        borderColor: NowTheme.COLORS.ACTIVE,
        borderWidth: 5,
    },
    stepIndicatorNext: {
        width: NowTheme.SIZES.BASE * 3,
        height: NowTheme.SIZES.BASE * 3,
        borderRadius: NowTheme.SIZES.BASE * 1.5,
        justifyContent: 'center',
        marginHorizontal: 5,
        backgroundColor: NowTheme.COLORS.BLOCK,
    },
    stepIndicatorPrev: {
        width: NowTheme.SIZES.BASE * 3,
        height: NowTheme.SIZES.BASE * 3,
        borderRadius: NowTheme.SIZES.BASE * 1.5,
        justifyContent: 'center',
        marginHorizontal: 5,
        backgroundColor: NowTheme.COLORS.ACTIVE,
    },
    stepIndicatorContainer: {
        width: 60,
    }
});
