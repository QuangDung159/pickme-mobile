import { CustomButton, Line } from '@components/uiComponents';
import { Theme } from '@constants/index';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

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
const {
    FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
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
        fontFamily: MONTSERRAT_BOLD,
        color: COLORS.ACTIVE
    };

    const arrDowByCurrentDate = createDynamicArrDOW(
        moment(currentDate, 'DD-MM-YYYY').isoWeekday()
    );

    return (
        <View
            style={{
                height: SIZES.HEIGHT_BASE * 0.1,
                marginBottom: 10
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
                                        fontFamily: MONTSERRAT_REGULAR,
                                        fontSize: SIZES.FONT_H4,
                                        color: COLORS.DEFAULT
                                    },
                                    (item === 'T.Bảy' || item === 'C.Nhật') && weekendStyle,
                                ]
                            }
                        >
                            {item}
                        </Text>
                    </View>
                ))}
            </View>
            <Line
                borderWidth={0.5}
                borderColor={COLORS.DEFAULT}
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
                    let buttonColor = COLORS.TRANSPARENT;
                    if (item === selectedDateState) {
                        buttonColor = COLORS.BASE;
                    }

                    const dateTextStyle = {
                        color: currentDate === item || item === selectedDateState ? COLORS.ACTIVE : COLORS.DEFAULT,
                        fontFamily: currentDate === item
                            ? MONTSERRAT_BOLD
                            : MONTSERRAT_REGULAR
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
                            ? MONTSERRAT_BOLD
                            : MONTSERRAT_REGULAR
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
