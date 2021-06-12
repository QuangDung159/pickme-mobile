import { Picker } from '@react-native-picker/picker';
import { Block } from 'galio-framework';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CustomButton, CustomModal } from '../../components/uiComponents';
import { NowTheme, Rx, ScreenName } from '../../constants';
import { ToastHelpers } from '../../helpers';
import { setListBookingStore, setPersonTabActiveIndex, setShowLoaderStore } from '../../redux/Actions';
import { rxUtil } from '../../utils';

export default function ReasonCancelBookingModal({
    modalReasonVisible,
    setModalReasonVisible,
    bookingId,
    navigation
}) {
    const reasonDropdownArr = [
        { label: 'Bận đột xuất', value: 0 },
        { label: 'Sai thông tin', value: 1 },
        { label: 'Lý do khác', value: 2 }
    ];

    const [reason, setReason] = useState(reasonDropdownArr[0]);

    const token = useSelector((state) => state.userReducer.token);

    const dispatch = useDispatch();

    const fetchListBooking = () => {
        const pagingStr = '?pageIndex=1&pageSize=100';

        rxUtil(
            `${Rx.BOOKING.GET_MY_BOOKING_AS_CUSTOMER}${pagingStr}`,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                dispatch(setListBookingStore(res.data.data));
                dispatch(setShowLoaderStore(false));
            },
            (res) => {
                dispatch(setShowLoaderStore(false));
                ToastHelpers.renderToast(res.data.message, 'error');
            },
            (res) => {
                dispatch(setShowLoaderStore(false));
                ToastHelpers.renderToast(res.data.message, 'error');
            }
        );
    };

    const onChangeReason = (reasonValueInput) => {
        const reasonInput = reasonDropdownArr.find((item) => item.value === reasonValueInput);
        if (reasonInput) {
            setReason(reasonInput);
        }
    };

    const renderReasonDropdown = () => (
        <Picker
            selectedValue={reason.value}
            onValueChange={(itemValue) => onChangeReason(itemValue)}
            fontFamily={NowTheme.FONT.MONTSERRAT_REGULAR}
            style={{
                width: NowTheme.SIZES.WIDTH_BASE * 0.8
            }}
        >
            {reasonDropdownArr.map((item) => (
                <Picker.Item value={item.value} label={item.label} key={item.value} />
            ))}
        </Picker>
    );

    const sendRequestToCancelBooking = () => {
        dispatch(setShowLoaderStore(true));
        rxUtil(
            `${Rx.BOOKING.CANCEL_BOOKING}/${bookingId}`,
            'POST',
            {
                rejectReason: reason.label
            },
            {
                Authorization: token
            },
            (res) => {
                navigation.navigate(ScreenName.PERSONAL);
                dispatch(setPersonTabActiveIndex(2));
                ToastHelpers.renderToast(res.data.message, 'success');
                fetchListBooking();
            },
            (res) => {
                dispatch(setShowLoaderStore(false));
                ToastHelpers.renderToast(res.data.message, 'error');
                ToastHelpers.renderToast();
            },
            (res) => {
                dispatch(setShowLoaderStore(false));
                ToastHelpers.renderToast(res.data.message, 'error');
            }
        );
    };

    const renderReasonCancelBookingModal = () => (
        <CustomModal
            modalVisible={modalReasonVisible}
            renderContent={() => (
                <>
                    <Text
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                            marginVertical: 10,
                            fontSize: NowTheme.SIZES.FONT_H2
                        }}
                    >
                        Vui lòng chọn lý do
                    </Text>
                    {renderReasonDropdown()}
                    <Block
                        middle
                        row
                        style={{
                            width: NowTheme.SIZES.WIDTH_BASE * 0.8,
                            marginBottom: 10
                        }}
                        space="between"
                    >
                        <CustomButton
                            onPress={() => {
                                sendRequestToCancelBooking();
                                setModalReasonVisible(false);
                            }}
                            type="default"
                            label="Xác nhận huỷ"
                            buttonStyle={{
                                width: NowTheme.SIZES.WIDTH_BASE * 0.39
                            }}
                        />
                        <CustomButton
                            onPress={() => {
                                setModalReasonVisible(false);
                            }}
                            type="active"
                            label="Cân nhắc lại"
                            buttonStyle={{
                                width: NowTheme.SIZES.WIDTH_BASE * 0.39
                            }}
                        />
                    </Block>
                </>
            )}
        />
    );

    try {
        return (
            <View>
                {renderReasonCancelBookingModal()}
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
