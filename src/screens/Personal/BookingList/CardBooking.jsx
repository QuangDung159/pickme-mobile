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
                    backgroundColor: NowTheme.COLORS.BASE,
                    marginBottom: 10
                }}
            >
                <Block
                    space="between"
                    style={{
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9
                    }}
                >
                    <Block
                        row
                        space="between"
                    >
                        <Block>
                            <Text
                                size={NowTheme.SIZES.FONT_H2}
                                style={styles.cardTitle}
                                color={NowTheme.COLORS.ACTIVE}
                            >
                                <>{`${fullName}`}</>
                            </Text>
                            <Text
                                size={NowTheme.SIZES.FONT_H5}
                                style={styles.cardSubTitle}
                                color={NowTheme.COLORS.ACTIVE}
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
                                size={NowTheme.SIZES.FONT_H3}
                                color={NowTheme.COLORS.ACTIVE}
                            >
                                {`Ngày: ${moment(date).format('DD-MM-YYYY')}`}
                            </Text>
                            <Text
                                style={styles.subInfoCard}
                                size={NowTheme.SIZES.FONT_H3}
                                color={NowTheme.COLORS.ACTIVE}
                            >
                                {`Từ ${startStr} đến ${endStr}`}
                            </Text>
                        </Block>
                        <Text
                            style={styles.subInfoCard}
                            size={NowTheme.SIZES.FONT_H3}
                            color={NowTheme.COLORS.DEFAULT}
                        >
                            {address || 'N/A'}
                        </Text>
                        <Block
                            row
                            space="between"
                        >
                            <Text
                                style={styles.subInfoCard}
                                size={NowTheme.SIZES.FONT_H3}
                                color={NowTheme.COLORS.DEFAULT}
                            >
                                {`Trạng thái: ${statusValue}`}
                            </Text>
                            <Block
                                row
                            >
                                <Text
                                    style={{
                                        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                                        marginRight: 5
                                    }}
                                    size={NowTheme.SIZES.FONT_H2}
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
    booking: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    cardTitle: {
        paddingTop: 7,
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
    },
    subInfoCard: {
        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
        marginBottom: 10
    },
    cardSubTitle: {
        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
        paddingBottom: 15,
        color: NowTheme.COLORS.ICON_INPUT
    }
});
