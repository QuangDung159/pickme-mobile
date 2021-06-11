import { Block, Text } from 'galio-framework';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { NowTheme } from '../../constants';
import { CustomButton, Line } from '../uiComponents';

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
                height: NowTheme.SIZES.HEIGHT_BASE * 0.13,
            }}
        >
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
                    marginVertical: 10
                }}
            />
            {/* render date */}
            <View
                style={{
                    flexDirection: 'row'
                }}
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
                            key={item.toString()}
                        >
                            <CustomButton
                                onPress={() => { onClickDate(item); }}
                                buttonStyle={{
                                    width: 30,
                                    height: 30,
                                    backgroundColor: buttonColor,
                                    borderRadius: 15,
                                    borderWidth: 0
                                }}
                                labelStyle={dateTextStyle}
                                label={item.substring(0, 2)}
                            />
                        </Block>
                    );
                })}
            </View>

            <View
                style={{
                    flexDirection: 'row'
                }}
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
                            key={item.toString()}
                        >
                            <CustomButton
                                onPress={() => { onClickDate(item); }}
                                buttonStyle={{
                                    width: 30,
                                    height: 30,
                                    backgroundColor: buttonColor,
                                    borderRadius: 15,
                                    borderWidth: 0
                                }}
                                labelStyle={dateTextStyle}
                                label={item.substring(0, 2)}
                            />
                        </Block>
                    );
                })}
            </View>
        </Block>
    );
}

CustomCalendar.propTypes = {
    onChangeDate: PropTypes.func.isRequired
};
