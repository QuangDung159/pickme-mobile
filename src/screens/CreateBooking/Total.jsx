/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import {
    CustomButton, CustomText, IconCustom, NoteText
} from '@components/uiComponents';
import IconFamily from '@constants/IconFamily';
import ScreenName from '@constants/ScreenName';
import Theme from '@constants/Theme';
import CommonHelpers from '@helpers/CommonHelpers';
import ToastHelpers from '@helpers/ToastHelpers';
import ValidationHelpers from '@helpers/ValidationHelpers';
import { setListBookingStore, setPersonTabActiveIndex } from '@redux/Actions';
import BookingServices from '@services/BookingServices';
import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const {
    FONT: {
        TEXT_BOLD,
        TEXT_REGULAR
    },
    SIZES,
    COLORS
} = Theme;

export default function Total({
    total,
    route,
    navigation,
    selectedDate,
    startTimeStr,
    endTimeStr,
    booking,
    setIsShowSpinner
}) {
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const dispatch = useDispatch();

    const calculateTotalAmount = (start, end) => {
        if (total !== 0) return total;
        const { estimatePricing } = route.params.partner;
        const unitPrice = estimatePricing;

        const startMinutesNumber = convertStringHoursToMinutes(start) || 0;
        const endMinutesNumber = convertStringHoursToMinutes(end) || 0;
        if (startMinutesNumber < endMinutesNumber) {
            return (endMinutesNumber - startMinutesNumber) * unitPrice;
        }
        return 0;
    };

    const convertStringHoursToMinutes = (hoursStr) => {
        const deltaTime = hoursStr.split(':');
        const hours = deltaTime[0];
        const minutes = deltaTime[1];
        return hours * 60 + +minutes;
    };

    const getListBooking = async () => {
        const res = await BookingServices.fetchListBookingAsync();

        if (res.data) {
            dispatch(setListBookingStore(res.data.data));
        }
    };

    const validate = () => {
        const validationArr = [
            {
                fieldName: 'Địa điểm',
                input: booking.address,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 255,
                    },
                }
            }
        ];

        return ValidationHelpers.validate(validationArr);
    };

    const onSubmitBooking = async () => {
        // if (!currentUser.isCustomerVerified) {
        //     ToastHelpers.renderToast('Tài khoản của bạn chưa được xác thực');
        //     return;
        // }

        if (!validate()) return;

        const {
            params: {
                partner
            }
        } = route;

        const dateString = `${moment(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD')}T00:00:00`;
        const startString = convertStringHoursToMinutes(startTimeStr);
        const endString = convertStringHoursToMinutes(endTimeStr);

        if (startString > 1200) {
            ToastHelpers.renderToast('Vui lòng không bắt đầu sau 20h');
            return;
        }

        const bookingToSubmit = {
            StartAt: startString,
            EndAt: endString,
            Date: dateString,
            Address: booking.address || 'N/a',
            Longtitude: booking.longtitude || 0,
            Latitude: booking.latitude || 0,
            Description: 'Không có mô tả',
            Noted: booking.noted || 'Không có ghi chú',
            totalAmount: total !== 0 ? total : calculateTotalAmount(startTimeStr, endTimeStr),
            IsOnline: false
        };

        // console.log('bookingToSubmit :>> ', bookingToSubmit);
        // return;

        setIsShowSpinner(true);
        const result = await BookingServices.submitScheduleBookingAsync(partner.id, bookingToSubmit);
        const { data } = result;

        if (data) {
            ToastHelpers.renderToast(data.message, 'success');
            getListBooking();
            dispatch(setPersonTabActiveIndex(2));
            navigation.reset({
                index: 0,
                routes: [{ name: ScreenName.PERSONAL }],
            });
        }
        setIsShowSpinner(false);
    };

    const renderButtonPanel = () => (
        <CustomButton
            onPress={() => onSubmitBooking()}
            type="active"
            label="Gửi yêu cầu"
            buttonStyle={{
                width: SIZES.WIDTH_MAIN,
                marginVertical: 15
            }}
        />
    );

    const renderTotal = () => (
        <View>
            <View
                style={{
                    alignSelf: 'center',
                    width: SIZES.WIDTH_MAIN,
                }}
            >
                <CustomText
                    style={{
                        color: COLORS.ACTIVE,
                        fontSize: SIZES.FONT_H1,
                        fontFamily: TEXT_BOLD,
                        textAlign: 'center'
                    }}
                    text={`Tổng chi phí: ${CommonHelpers.formatCurrency(calculateTotalAmount(startTimeStr, endTimeStr))}`}
                />
                {renderButtonPanel()}
            </View>

        </View>
    );

    return (
        <>
            {renderTotal()}
        </>
    );
}
