import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {
    StyleSheet, Text, View
} from 'react-native';
import { Theme } from '@constants/index';
import { CommonHelpers, ToastHelpers } from '@helpers/index';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

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
                    marginVertical: 20,
                    alignSelf: 'center',
                    width: SIZES.WIDTH_BASE * 0.9,
                    borderBottomColor: COLORS.ACTIVE,
                    borderBottomWidth: 0.5
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        width: SIZES.WIDTH_BASE * 0.9,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 15
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
                                    marginBottom: 0,
                                }
                            ]
                        }
                    >
                        {`Mã đơn: #${idReadAble}`}
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
                        {`${startStr} - ${endStr}`}
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
                    Tại:
                    {' '}
                    {address || 'N/A'}
                </Text>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: 15
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
                            flexDirection: 'row',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: TEXT_BOLD,
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
        fontFamily: TEXT_BOLD,
    },
    subInfoCard: {
        fontFamily: TEXT_REGULAR,
        marginBottom: 10
    },
});
