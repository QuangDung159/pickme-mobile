import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {
    StyleSheet, Text, View
} from 'react-native';
import { Theme } from '@constants/index';
import { CommonHelpers, ToastHelpers } from '@helpers/index';
import { useSelector } from 'react-redux';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function CardBooking({ booking }) {
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const convertMinutesToStringHours = (minutes) => moment.utc()
        .startOf('day')
        .add(minutes, 'minutes')
        .format('HH:mm');

    try {
        const {
            startAt,
            endAt,
            partnerName,
            totalAmount,
            status,
            date,
            idReadAble,
            address,
            customerId,
            customerName
        } = booking;

        if (!booking) {
            return null;
        }

        const startStr = convertMinutesToStringHours(startAt);
        const endStr = convertMinutesToStringHours(endAt);

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
                <Text
                    style={
                        [
                            styles.cardTitle,
                            {
                                fontSize: SIZES.FONT_H5,
                                color: COLORS.DEFAULT,
                                fontFamily: TEXT_REGULAR
                            }
                        ]
                    }
                >
                    {`${customerId === currentUser.id ? 'Host' : 'Khách hàng'}`}
                </Text>
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
                        {`${customerId === currentUser.id ? partnerName : customerName}`}
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
                        {`Trạng thái: ${status}`}
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
