import { CustomButton, Line } from '@components/uiComponents';
import { Theme } from '@constants/index';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const arrDOW = [
    'CN',
    'T2',
    'T3',
    'T4',
    'T5',
    'T6',
    'T7'
];
const currentDate = moment().format('DD-MM-YYYY');
const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

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
    // const arrDateLine2 = createArrDate(moment().add(7, 'days').format('DD-MM-YYYY'), 7);

    const weekendStyle = {
        color: COLORS.ACTIVE
    };

    const arrDowByCurrentDate = createDynamicArrDOW(
        moment(currentDate, 'DD-MM-YYYY').isoWeekday()
    );

    return (
        <View
            style={{
                height: SIZES.HEIGHT_BASE * 0.08,
            }}
        >
            <View
                style={{
                    flexDirection: 'row'
                }}
            >
                {arrDowByCurrentDate.map((item) => (
                    <View
                        style={{
                            alignSelf: 'center',
                            alignItems: 'center',
                            flex: 1
                        }}
                        key={item}
                    >
                        <Text
                            style={
                                [
                                    {
                                        fontFamily: TEXT_BOLD,
                                        fontSize: SIZES.FONT_H3,
                                        color: COLORS.DEFAULT
                                    },
                                    (item === 'T7' || item === 'CN') && weekendStyle,
                                ]
                            }
                        >
                            {item}
                        </Text>
                    </View>
                ))}
            </View>
            <Line
                borderColor={COLORS.DEFAULT}
                style={{
                    marginVertical: 5
                }}
            />
            {/* render date */}
            <View
                style={{
                    flexDirection: 'row'
                }}
            >
                {arrDateLine1.map((item) => {
                    let borderWidth = 0;
                    let borderColor = '';
                    if (item === selectedDateState) {
                        borderWidth = 1;
                        borderColor = COLORS.ACTIVE;
                    }

                    const dateTextStyle = {
                        color: currentDate === item || item === selectedDateState ? COLORS.ACTIVE : COLORS.DEFAULT,
                        fontFamily: currentDate === item
                            ? TEXT_BOLD
                            : TEXT_REGULAR
                    };

                    return (
                        <View
                            style={{
                                alignSelf: 'center',
                                alignItems: 'center',
                                flex: 1
                            }}
                            key={item.toString()}
                        >
                            <CustomButton
                                onPress={() => { onClickDate(item); }}
                                buttonStyle={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    borderColor,
                                    borderWidth
                                }}
                                labelStyle={dateTextStyle}
                                label={item.substring(0, 2)}
                            />
                        </View>
                    );
                })}
            </View>

            {/* <View
                style={{
                    flexDirection: 'row',
                    marginTop: 5
                }}
            >
                {arrDateLine2.map((item) => {
                    let buttonColor = COLORS.BASE;
                    if (item === selectedDateState) {
                        buttonColor = COLORS.SELECTED_DATE;
                    }

                    const dateTextStyle = {
                        color: currentDate === item ? COLORS.ACTIVE : COLORS.TEXT,
                        fontFamily: currentDate === item
                            ? TEXT_BOLD
                            : TEXT_REGULAR
                    };

                    return (
                        <View
                            style={{
                                alignSelf: 'center',
                                alignItems: 'center',
                                flex: 1
                            }}
                            key={item.toString()}
                        >
                            <CustomButton
                                onPress={() => { onClickDate(item); }}
                                buttonStyle={{
                                    width: 34,
                                    height: 34,
                                    backgroundColor: buttonColor,
                                    borderRadius: 17,
                                    borderWidth: 0
                                }}
                                labelStyle={dateTextStyle}
                                label={item.substring(0, 2)}
                            />
                        </View>
                    );
                })}
            </View> */}
        </View>
    );
}

CustomCalendar.propTypes = {
    onChangeDate: PropTypes.func.isRequired
};
