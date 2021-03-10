import { Block, Text } from 'galio-framework';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { useSelector } from 'react-redux';
import { IconFamily, NowTheme, ScreenName } from '../../constants';
import { ToastHelpers } from '../../helpers';
import { IconCustom } from '../uiComponents';

export default function CardBooking({ booking, fromScreen, navigation }) {
    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const convertMinutesToStringHours = (minutes) => moment.utc()
        .startOf('day')
        .add(minutes, 'minutes')
        .format('HH:mm');

    try {
        const {
            startAt,
            endAt,
            location,
            customer,
            partner,
            totalAmount,
            status,
            date
        } = booking;

        const startStr = convertMinutesToStringHours(startAt);
        const endStr = convertMinutesToStringHours(endAt);
        const fullName = currentUser.userType === 'Partner' ? customer.fullName : partner.fullName;

        return (
            <Block
                style={{
                    backgroundColor: NowTheme.COLORS.BASE,
                    marginBottom: 10
                }}
            >
                <Block
                    space="between"
                    style={{
                        marginHorizontal: 10,
                    }}
                >
                    <Block
                        row
                        space="between"
                    >
                        <Text
                            size={NowTheme.SIZES.FONT_INFO}
                            style={styles.cardTitle}
                            color={NowTheme.COLORS.ACTIVE}
                        >
                            {/* check role */}
                            <>{fullName}</>
                        </Text>
                        {currentUser.userType === 'Customer'
                            && fromScreen !== ScreenName.BOOKING_LIST
                            && status === 'Scheduling' && (
                            <Block
                                middle
                            >
                                <TouchableOpacity
                                    onPress={() => navigation.navigate(
                                        ScreenName.BOOKING_CONFIRM,
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
                    <Block style={styles.subInfoItemContainer}>
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
    fromScreen: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
    cardTitle: {
        paddingTop: 7,
        paddingBottom: 15,
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
    },
    subInfoCard: {
        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
        marginBottom: 15
    },
    subInfoItemContainer: {
        marginBottom: 10,
    }
});
