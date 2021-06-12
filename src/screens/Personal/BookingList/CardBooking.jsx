import { Block, Text } from 'galio-framework';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {
    StyleSheet
} from 'react-native';
import { IconCustom } from '../../../components/uiComponents';
import { IconFamily, NowTheme } from '../../../constants';
import { ToastHelpers } from '../../../helpers';

const { FONT, SIZES, COLORS } = NowTheme;

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
            <Block
                middle
                style={{
                    backgroundColor: COLORS.BASE,
                    marginBottom: 10
                }}
            >
                <Block
                    space="between"
                    style={{
                        width: SIZES.WIDTH_BASE * 0.9
                    }}
                >
                    <Block
                        row
                        space="between"
                    >
                        <Block>
                            <Text
                                size={SIZES.FONT_H2}
                                style={styles.cardTitle}
                                color={COLORS.ACTIVE}
                            >
                                <>{`${fullName}`}</>
                            </Text>
                            <Text
                                size={SIZES.FONT_H4}
                                style={styles.cardSubTitle}
                                color={COLORS.ACTIVE}
                            >
                                <>{`Mã đơn hẹn: #${idReadAble}`}</>
                            </Text>
                        </Block>
                    </Block>
                    <Block>
                        <Block
                            space="between"
                        >
                            <Text
                                style={styles.subInfoCard}
                                size={SIZES.FONT_H2}
                                color={COLORS.ACTIVE}
                            >
                                {`Ngày: ${moment(date).format('DD-MM-YYYY')}`}
                            </Text>
                            <Text
                                style={styles.subInfoCard}
                                size={SIZES.FONT_H2}
                                color={COLORS.ACTIVE}
                            >
                                {`Từ ${startStr} đến ${endStr}`}
                            </Text>
                        </Block>
                        <Text
                            style={styles.subInfoCard}
                            size={SIZES.FONT_H3}
                            color={COLORS.DEFAULT}
                        >
                            {address || 'N/A'}
                        </Text>
                        <Block
                            row
                            space="between"
                        >
                            <Text
                                style={styles.subInfoCard}
                                size={SIZES.FONT_H3}
                                color={COLORS.DEFAULT}
                            >
                                {`Trạng thái: ${statusValue}`}
                            </Text>
                            <Block
                                row
                            >
                                <Text
                                    style={{
                                        fontFamily: FONT.MONTSERRAT_BOLD,
                                        marginRight: 5
                                    }}
                                    size={SIZES.FONT_H2}
                                    color={COLORS.ACTIVE}
                                >
                                    {totalAmount}
                                </Text>
                                <IconCustom
                                    name="diamond"
                                    family={IconFamily.SIMPLE_LINE_ICONS}
                                    size={16}
                                    color={COLORS.ACTIVE}
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
    booking: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    cardTitle: {
        paddingTop: 7,
        fontFamily: FONT.MONTSERRAT_BOLD
    },
    subInfoCard: {
        fontFamily: FONT.MONTSERRAT_REGULAR,
        marginBottom: 10
    },
    cardSubTitle: {
        fontFamily: FONT.MONTSERRAT_REGULAR,
        paddingBottom: 15,
        color: COLORS.ICON_INPUT
    }
});
