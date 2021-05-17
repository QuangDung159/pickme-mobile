import { Block, Button, Text } from 'galio-framework';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NowTheme } from '../../constants';
import { Line } from '../uiComponents';

const arrDOW = [
    'C.Nhật',
    'T.Hai',
    'T.Ba',
    'T.Tư',
    'T.Năm',
    'T.Sáu',
    'T.Bảy'
];
const currentDate = moment().format('DD-MM-YYYY');

export default function CustomCalendar({ selectedDate, onChangeDate }) {
    const [selectedDateState, setSelectedDateState] = useState(moment().format('DD-MM-YYYY'));

    useEffect(
        () => {
            if (selectedDate) {
                setSelectedDateState(selectedDate);
            }
        }, []
    );

    const createArrDate = (startDate, numberOfDateToGen) => {
        const arrDate = [];
        for (let i = 0; i < numberOfDateToGen; i += 1) {
            arrDate.push(moment(startDate, 'DD-MM-YYYY').add(i, 'days').format('DD-MM-YYYY'));
        }
        return arrDate;
    };

    const onClickDate = (date) => {
        setSelectedDateState(date);
        onChangeDate(date);
    };

    const createDynamicArrDOW = (currentDowIndex) => {
        const currentArr = [...arrDOW];
        const frontArr = currentArr.slice(currentDowIndex, 8);
        const backArr = currentArr.slice(0, currentDowIndex);

        return frontArr.concat(backArr);
    };

    const arrDateLine1 = createArrDate(moment().format('DD-MM-YYYY'), 7);
    const arrDateLine2 = createArrDate(moment().add(7, 'days').format('DD-MM-YYYY'), 7);

    const weekendStyle = {
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
        color: NowTheme.COLORS.ACTIVE
    };

    const arrDowByCurrentDate = createDynamicArrDOW(
        moment(currentDate, 'DD-MM-YYYY').isoWeekday()
    );

    return (
        <Block
            style={{
                height: NowTheme.SIZES.HEIGHT_BASE * 0.18
            }}
        >
            {/* render header dow */}
            <Block
                row
            >
                {arrDowByCurrentDate.map((item) => (
                    <Block
                        middle
                        flex
                        key={item}
                    >
                        <Text
                            size={13}
                            style={[
                                {
                                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                },
                                (item === 'T.Bảy' || item === 'C.Nhật') && weekendStyle,
                            ]}
                        >
                            {item}
                        </Text>
                    </Block>
                ))}
            </Block>
            <Line
                borderWidth={0.5}
                borderColor={NowTheme.COLORS.BLOCK}
                style={{
                    marginTop: 10
                }}
            />
            {/* render date */}
            <Block>
                <Block
                    row
                >
                    {arrDateLine1.map((item) => {
                        let buttonColor = NowTheme.COLORS.BASE;
                        if (item === selectedDateState) {
                            buttonColor = NowTheme.COLORS.SELECTED_DATE;
                        }

                        const dateTextStyle = {
                            color: currentDate === item ? NowTheme.COLORS.ACTIVE : NowTheme.COLORS.TEXT,
                            fontFamily: currentDate === item
                                ? NowTheme.FONT.MONTSERRAT_BOLD
                                : NowTheme.FONT.MONTSERRAT_REGULAR
                        };

                        return (
                            <Block
                                flex
                                middle
                            >
                                <Button
                                    onPress={() => { onClickDate(item); }}
                                    round
                                    color={buttonColor}
                                    shadowless
                                    textStyle={dateTextStyle}
                                    style={{
                                        width: 30,
                                        height: 30,
                                    }}
                                >
                                    {item.substring(0, 2)}
                                </Button>
                            </Block>
                        );
                    })}
                </Block>
            </Block>

            <Block>
                <Block
                    row
                >
                    {arrDateLine2.map((item) => {
                        let buttonColor = NowTheme.COLORS.BASE;
                        if (item === selectedDateState) {
                            buttonColor = NowTheme.COLORS.SELECTED_DATE;
                        }

                        const dateTextStyle = {
                            color: currentDate === item ? NowTheme.COLORS.ACTIVE : NowTheme.COLORS.TEXT,
                            fontFamily: currentDate === item
                                ? NowTheme.FONT.MONTSERRAT_BOLD
                                : NowTheme.FONT.MONTSERRAT_REGULAR
                        };

                        return (
                            <Block
                                flex
                                middle
                            >
                                <Button
                                    onPress={() => { onClickDate(item); }}
                                    round
                                    color={buttonColor}
                                    shadowless
                                    textStyle={dateTextStyle}
                                    style={{
                                        width: 30,
                                        height: 30,
                                    }}
                                >
                                    {item.substring(0, 2)}
                                </Button>
                            </Block>
                        );
                    })}
                </Block>
            </Block>
        </Block>
    );
}

CustomCalendar.propTypes = {
    onChangeDate: PropTypes.func.isRequired
};
