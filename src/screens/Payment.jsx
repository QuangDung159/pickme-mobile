import {
    Block, Button, Text
} from 'galio-framework';
import React from 'react';
import {
    ScrollView,
    StyleSheet, TouchableWithoutFeedback
} from 'react-native';
import { IconCustom, Line } from '../components/uiComponents';
import { IconFamily, NowTheme, ScreenName } from '../constants';
import { ToastHelpers } from '../helpers';

export default function Payment({ navigation }) {
    const renderBookingInfoItem = (title, value) => (
        <Block
            row
            style={{
                marginBottom: 20
            }}
        >
            <Block
                flex
                style={{
                    justifyContent: 'center',
                    flex: 4
                }}
            >
                <Text
                    color={NowTheme.COLORS.DEFAULT}
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                    }}
                    size={16}
                >
                    {title}
                </Text>
            </Block>
            <Block
                style={{
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    flex: 6
                }}
            >
                <Text
                    style={styles.datetime}
                    color={NowTheme.COLORS.ACTIVE}
                    size={16}
                >
                    {value}
                </Text>
            </Block>
        </Block>
    );

    try {
        return (
            <ScrollView
                style={{
                    backgroundColor: NowTheme.COLORS.BLOCK,
                }}
                showsVerticalScrollIndicator={false}
            >
                <Block
                    center
                    style={{
                        marginTop: 10
                    }}
                >
                    <Block
                        style={styles.container}
                    >
                        <Block
                            style={styles.contentContainer}
                        >
                            <Block
                                row
                                style={{
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Text style={{
                                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                                }}
                                >
                                    RƯƠNG KIM CƯƠNG
                                </Text>
                                <TouchableWithoutFeedback onPress={() => {
                                    navigation.navigate(ScreenName.CASH_IN);
                                }}
                                >
                                    <Text color={NowTheme.COLORS.FACEBOOK}>
                                        Nạp thêm
                                    </Text>
                                </TouchableWithoutFeedback>
                            </Block>
                            <Line
                                borderWidth={0.5}
                                borderColor={NowTheme.COLORS.ACTIVE}
                                style={{
                                    marginVertical: 10
                                }}
                            />

                            <Block
                                middle
                            >
                                <Text
                                    color={NowTheme.COLORS.ACTIVE}
                                    style={{
                                        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
                                    }}
                                    size={30}
                                >
                                    1320
                                    {' '}
                                    <IconCustom
                                        name="diamond"
                                        family={IconFamily.SIMPLE_LINE_ICONS}
                                        size={20}
                                        color={NowTheme.COLORS.ACTIVE}
                                    />
                                </Text>
                            </Block>
                        </Block>

                    </Block>
                </Block>

                <Block
                    center
                    style={{
                        marginTop: 10
                    }}
                >
                    <Block
                        style={styles.container}
                    >
                        <Block
                            style={styles.contentContainer}
                        >
                            <Text style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                            }}
                            >
                                CHI TIẾT GIAO DỊCH
                            </Text>
                            <Line
                                borderWidth={0.5}
                                borderColor={NowTheme.COLORS.ACTIVE}
                                style={{
                                    marginVertical: 10
                                }}
                            />
                            {renderBookingInfoItem('Dịch vụ', 'Thuê người hẹn hò')}
                            {renderBookingInfoItem('Người thực hiện', 'Khả Ngân')}
                            {renderBookingInfoItem('Bắt đầu', '15/12/20 17:30')}
                            {renderBookingInfoItem('Kết thúc', '15/12/20 18:30')}
                            {renderBookingInfoItem('Người thực hiện', 'The coffee house 3/2, quận 10, TPHCM')}
                            {renderBookingInfoItem('Người thực hiện', 'Khả Ngân')}

                            <Block
                                row
                                style={{
                                    marginBottom: 20
                                }}
                            >
                                <Block
                                    flex
                                    style={{
                                        justifyContent: 'center',
                                        flex: 5
                                    }}
                                >
                                    <Text
                                        color={NowTheme.COLORS.DEFAULT}
                                        style={{
                                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                                        }}
                                        size={16}
                                    >
                                        Kim cương/giờ
                                    </Text>
                                </Block>
                                <Block
                                    style={{
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        flex: 5
                                    }}
                                >
                                    <Text
                                        color={NowTheme.COLORS.ACTIVE}
                                        style={{
                                            fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
                                        }}
                                        size={16}
                                    >
                                        200
                                        {' '}
                                        <IconCustom
                                            name="diamond"
                                            family={IconFamily.SIMPLE_LINE_ICONS}
                                            size={NowTheme.SIZES.FONT_H4}
                                            color={NowTheme.COLORS.ACTIVE}
                                        />
                                    </Text>
                                </Block>
                            </Block>
                        </Block>
                    </Block>
                </Block>
                <Block
                    center
                    style={{
                        marginVertical: 10
                    }}
                >
                    <Block
                        style={styles.container}
                    >
                        <Block
                            style={styles.contentContainer}
                        >
                            <Text style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                            }}
                            >
                                TỔNG KIM CƯƠNG
                            </Text>
                            <Line
                                borderWidth={0.5}
                                borderColor={NowTheme.COLORS.ACTIVE}
                                style={{
                                    marginVertical: 10
                                }}
                            />
                            <Block>
                                <Block
                                    flex
                                    center
                                >
                                    <Text
                                        color={NowTheme.COLORS.ACTIVE}
                                        style={{
                                            fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
                                        }}
                                        size={30}
                                    >
                                        1320
                                        {' '}
                                        <IconCustom
                                            name="diamond"
                                            family={IconFamily.SIMPLE_LINE_ICONS}
                                            size={20}
                                            color={NowTheme.COLORS.ACTIVE}
                                        />
                                    </Text>
                                </Block>
                                <Block
                                    center
                                >
                                    <Button
                                        style={[styles.button, {
                                            marginTop: 10
                                        }]}
                                        shadowless
                                    >
                                        Xác nhận
                                    </Button>
                                </Block>
                            </Block>
                        </Block>
                    </Block>
                </Block>
            </ScrollView>
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
    container: {
        backgroundColor: NowTheme.COLORS.BASE,
        width: NowTheme.SIZES.WIDTH_BASE,
        borderRadius: 5,
        paddingBottom: 10
    },
    contentContainer: {
        marginHorizontal: 10,
        marginTop: 10
    },
    button: {
        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
    }
});
