import { CustomText } from '@components/uiComponents';
import { Theme } from '@constants/index';
import { mappingStatusText } from '@helpers/CommonHelpers';
import { CommonHelpers, ToastHelpers } from '@helpers/index';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {
    StyleSheet, View
} from 'react-native';
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
                    marginTop: 10,
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
                    }}
                >
                    <CustomText
                        style={
                            [
                                styles.cardTitle,
                                {
                                    fontSize: SIZES.FONT_H5,
                                    color: COLORS.DEFAULT,
                                    fontFamily: TEXT_REGULAR,
                                    marginBottom: 0
                                }
                            ]
                        }
                        text={`${customerId === currentUser.id ? 'Host' : 'Khách hàng'}`}
                    />
                    <CustomText
                        style={
                            [
                                styles.subInfoCard,
                                {
                                    fontSize: SIZES.FONT_H5,
                                    color: COLORS.DEFAULT,
                                    marginBottom: 0,
                                }
                            ]
                        }
                        text={`Mã đơn: #${idReadAble}`}
                    />
                </View>

                <CustomText
                    style={
                        [
                            styles.cardTitle,
                            {
                                fontSize: SIZES.FONT_H2,
                                color: COLORS.ACTIVE,
                            }
                        ]
                    }
                    text={`${customerId === currentUser.id ? partnerName : customerName}`}
                />

                <View
                    style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                    }}
                >
                    <CustomText
                        style={
                            [
                                styles.subInfoCard,
                                {
                                    fontSize: SIZES.FONT_H2,
                                    color: COLORS.ACTIVE,
                                }
                            ]
                        }
                        text={`Ngày: ${moment(date).format('DD-MM-YYYY')}`}
                    />
                    <CustomText
                        style={
                            [
                                styles.subInfoCard,
                                {
                                    fontSize: SIZES.FONT_H2,
                                    color: COLORS.ACTIVE,
                                }
                            ]
                        }
                        text={`${startStr} - ${endStr}`}
                    />
                </View>

                <CustomText
                    style={
                        [
                            styles.subInfoCard,
                            {
                                fontSize: SIZES.FONT_H3,
                                color: COLORS.DEFAULT,
                            }
                        ]
                    }
                    text={`Tại: ${address || 'N/A'}`}
                />

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <CustomText
                        style={
                            [
                                styles.subInfoCard,
                                {
                                    fontSize: SIZES.FONT_H3,
                                    color: COLORS.DEFAULT,
                                }
                            ]
                        }
                        text={`Trạng thái: ${mappingStatusText(status)}`}
                    />
                </View>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10
                    }}
                >
                    <CustomText
                        style={{
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H1,
                            color: COLORS.ACTIVE
                        }}
                        text={CommonHelpers.generateMoneyStr(totalAmount)}
                    />
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
    },
});
