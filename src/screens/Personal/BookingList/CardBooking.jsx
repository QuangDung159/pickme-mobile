import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {
    StyleSheet, Text, View
} from 'react-native';
import { NowTheme } from '../../../constants';
import { CommonHelpers, ToastHelpers } from '../../../helpers';

const {
    FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = NowTheme;

export default function CardBooking({ booking }) {
    const convertMinutesToStringHours = (minutes) => moment.utc()
        .startOf('day')
        .add(minutes, 'minutes')
        .format('HH:mm');

    try {
        const {
            startAt,
            endAt,
            partner,
            totalAmount,
            statusValue,
            date,
            idReadAble,
            address
        } = booking;

        if (!booking) {
            return null;
        }

        const startStr = convertMinutesToStringHours(startAt);
        const endStr = convertMinutesToStringHours(endAt);
        const { fullName } = partner;

        return (
            <View
                style={{
                    backgroundColor: COLORS.BASE,
                    marginVertical: 10,
                    alignSelf: 'center',
                    width: SIZES.WIDTH_BASE * 0.9,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        width: SIZES.WIDTH_BASE * 0.9,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 10,
                    }}
                >
                    <Text
                        style={
                            [
                                styles.cardTitle,
                                {
                                    fontSize: SIZES.FONT_H2,
                                    color: COLORS.ACTIVE,
                                }
                            ]
                        }
                    >
                        {`${fullName}`}
                    </Text>
                    <Text
                        style={
                            [
                                styles.subInfoCard,
                                {
                                    fontSize: SIZES.FONT_H4,
                                    color: COLORS.DEFAULT,
                                }
                            ]
                        }
                    >
                        {`Mã đơn hẹn: #${idReadAble}`}
                    </Text>
                </View>

                <View
                    style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                    }}
                >
                    <Text
                        style={
                            [
                                styles.subInfoCard,
                                {
                                    fontSize: SIZES.FONT_H2,
                                    color: COLORS.ACTIVE,
                                }
                            ]
                        }
                    >
                        {`Ngày: ${moment(date).format('DD-MM-YYYY')}`}
                    </Text>
                    <Text
                        style={
                            [
                                styles.subInfoCard,
                                {
                                    fontSize: SIZES.FONT_H2,
                                    color: COLORS.ACTIVE,
                                }
                            ]
                        }
                    >
                        {`Từ ${startStr} đến ${endStr}`}
                    </Text>
                </View>

                <Text
                    style={
                        [
                            styles.subInfoCard,
                            {
                                fontSize: SIZES.FONT_H3,
                                color: COLORS.DEFAULT,
                            }
                        ]
                    }
                >
                    {address || 'N/A'}
                </Text>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    <Text
                        style={
                            [
                                styles.subInfoCard,
                                {
                                    fontSize: SIZES.FONT_H3,
                                    color: COLORS.DEFAULT,
                                }
                            ]
                        }
                    >
                        {`Trạng thái: ${statusValue}`}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row'
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: MONTSERRAT_BOLD,
                                marginRight: 5,
                                fontSize: SIZES.FONT_H2,
                                color: COLORS.ACTIVE
                            }}
                        >
                            {CommonHelpers.generateMoneyStr(totalAmount)}
                        </Text>
                    </View>
                </View>
            </View>
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

CardBooking.propTypes = {
    booking: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    cardTitle: {
        fontFamily: MONTSERRAT_BOLD,
        marginBottom: 10
    },
    subInfoCard: {
        fontFamily: MONTSERRAT_REGULAR,
        marginBottom: 10
    },
    cardSubTitle: {
        fontFamily: MONTSERRAT_REGULAR,
        paddingBottom: 15,
        color: COLORS.ICON_INPUT
    }
});
