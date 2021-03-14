import { Block, Text } from 'galio-framework';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { IconFamily, NowTheme, ScreenName } from '../../constants';
import { ToastHelpers } from '../../helpers';
import { IconCustom } from '../uiComponents';

export default function CardBooking({ booking, renderAtScreen, navigation }) {
    const convertMinutesToStringHours = (minutes) => moment.utc()
        .startOf('day')
        .add(minutes, 'minutes')
        .format('HH:mm');

    try {
        const {
            startAt,
            endAt,
            location,
            partner,
            totalAmount,
            status,
            date,
            idReadAble
        } = booking;

        if (!booking) {
            console.log('booking', booking);
            return null;
        }

        const startStr = convertMinutesToStringHours(startAt);
        const endStr = convertMinutesToStringHours(endAt);
        const { fullName } = partner;

        return (
            <Block
                middle
                style={{
                    backgroundColor: NowTheme.COLORS.BASE,
                    marginBottom: 10
                }}
            >
                <Block
                    space="between"
                    style={{
                        width: NowTheme.SIZES.WIDTH_BASE * 0.95
                    }}
                >
                    <Block
                        row
                        space="between"
                    >
                        <Block>
                            <Text
                                size={NowTheme.SIZES.FONT_INFO}
                                style={styles.cardTitle}
                                color={NowTheme.COLORS.ACTIVE}
                            >
                                <>{`${fullName}`}</>
                            </Text>
                            <Text
                                size={NowTheme.SIZES.FONT_INFO}
                                style={styles.cardSubTitle}
                                color={NowTheme.COLORS.ACTIVE}
                            >
                                <>{`Mã đơn hẹn: #${idReadAble}`}</>
                            </Text>
                        </Block>
                        {renderAtScreen === ScreenName.BOOKING_DETAIL
                            && status === 'Scheduling'
                            && (
                                <Block
                                    middle
                                >
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate(
                                            ScreenName.CREATE_BOOKING,
                                            {
                                                bookingToEdit: booking,
                                                partner,
                                                fullName,
                                                from: ScreenName.BOOKING_DETAIL
                                            }
                                        )}
                                    >
                                        <IconCustom
                                            name="pencil"
                                            family={IconFamily.FONT_AWESOME}
                                            size={NowTheme.SIZES.ICON_20}
                                            color={NowTheme.COLORS.DEFAULT}
                                        />
                                    </TouchableOpacity>
                                </Block>
                            )}
                    </Block>
                    <Block>
                        <Block
                            space="between"
                        >
                            <Text
                                style={styles.subInfoCard}
                                size={NowTheme.SIZES.FONT_INFO}
                                color={NowTheme.COLORS.ACTIVE}
                            >
                                {`Ngày: ${moment(date).format('DD-MM-YYYY')}`}
                            </Text>
                            <Text
                                style={styles.subInfoCard}
                                size={NowTheme.SIZES.FONT_INFO}
                                color={NowTheme.COLORS.ACTIVE}
                            >
                                {`Từ ${startStr} đến ${endStr}`}
                            </Text>
                        </Block>
                        <Text
                            style={styles.subInfoCard}
                            size={NowTheme.SIZES.FONT_INFO}
                            color={NowTheme.COLORS.DEFAULT}
                        >
                            {location?.address || 'N/A'}
                        </Text>
                        <Block
                            row
                            space="between"
                        >
                            <Text
                                style={styles.subInfoCard}
                                size={NowTheme.SIZES.FONT_INFO}
                                color={NowTheme.COLORS.DEFAULT}
                            >
                                {`Trạng thái: ${status}`}
                            </Text>
                            <Block
                                row
                            >
                                <Text
                                    style={{
                                        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                                        marginRight: 5
                                    }}
                                    size={NowTheme.SIZES.FONT_INFO}
                                    color={NowTheme.COLORS.ACTIVE}
                                >
                                    {totalAmount}
                                </Text>
                                <IconCustom
                                    name="diamond"
                                    family={IconFamily.SIMPLE_LINE_ICONS}
                                    size={16}
                                    color={NowTheme.COLORS.ACTIVE}
                                />
                            </Block>
                        </Block>
                    </Block>
                </Block>
            </Block>
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
    booking: PropTypes.object.isRequired,
    renderAtScreen: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
    cardTitle: {
        paddingTop: 7,
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
    },
    subInfoCard: {
        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
        marginBottom: 15
    },
    cardSubTitle: {
        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
        fontSize: 14,
        paddingBottom: 15,
        color: NowTheme.COLORS.ICON_INPUT
    }
});
