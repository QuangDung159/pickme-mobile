import { CustomButton, CustomModal } from '@components/uiComponents';
import { Theme, ScreenName } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import { Picker } from '@react-native-picker/picker';
import { setPersonTabActiveIndex, setShowLoaderStore } from '@redux/Actions';
import { BookingServices } from '@services/index';
import React, { useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

const {
    FONT: {
        TEXT_REGULAR,
    }, SIZES,
    COLORS
} = Theme;

export default function ReasonCancelBookingModal({
    modalReasonVisible,
    setModalReasonVisible,
    bookingId,
    navigation,
}) {
    const reasonDropdownArr = [
        { label: 'Bận đột xuất', value: 0 },
        { label: 'Sai thông tin', value: 1 },
        { label: 'Lý do khác', value: 2 }
    ];

    const [reason, setReason] = useState(reasonDropdownArr[0]);
    const dispatch = useDispatch();

    const onChangeReason = (reasonValueInput) => {
        const reasonInput = reasonDropdownArr.find((item) => item.value === reasonValueInput);
        if (reasonInput) {
            setReason(reasonInput);
        }
    };

    const renderReasonDropdown = () => (
        <View
            style={{
                width: SIZES.WIDTH_BASE * 0.8,
                marginTop: Platform.OS === 'ios' ? -20 : -10,
                marginBottom: Platform.OS === 'ios' || 10
            }}
        >
            <Picker
                selectedValue={reason.value}
                onValueChange={(itemValue) => onChangeReason(itemValue)}
                fontFamily={TEXT_REGULAR}
                itemStyle={{
                    fontSize: SIZES.FONT_H2,
                    color: COLORS.DEFAULT,
                    fontFamily: TEXT_REGULAR
                }}
                mode="dropdown"
                dropdownIconColor={COLORS.ACTIVE}
                style={{
                    fontSize: SIZES.FONT_H2,
                    color: COLORS.ACTIVE
                }}
            >
                {reasonDropdownArr.map((item) => (
                    <Picker.Item value={item.value} label={item.label} key={item.value} />
                ))}
            </Picker>
        </View>
    );

    const sendRequestToCancelBooking = async () => {
        dispatch(setShowLoaderStore(true));
        const result = await BookingServices.submitCancelBookingAsync(bookingId, {
            rejectReason: reason.label
        });
        const { data } = result;

        if (data) {
            navigation.navigate(ScreenName.PERSONAL);
            dispatch(setPersonTabActiveIndex(2));
            ToastHelpers.renderToast(data.message, 'success');
        }
        dispatch(setShowLoaderStore(false));
    };

    const renderReasonCancelBookingModal = () => (
        <CustomModal
            modalVisible={modalReasonVisible}
            renderContent={() => (
                <>
                    <Text
                        style={{
                            fontFamily: TEXT_REGULAR,
                            marginVertical: 10,
                            fontSize: SIZES.FONT_H2,
                            color: COLORS.DEFAULT
                        }}
                    >
                        Vui lòng chọn lý do
                    </Text>
                    {renderReasonDropdown()}
                    <View
                        style={{
                            width: SIZES.WIDTH_BASE * 0.8,
                            marginBottom: 10,
                            alignSelf: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >
                        <CustomButton
                            onPress={() => {
                                setModalReasonVisible(false);
                            }}
                            type="default"
                            label="Quay lại"
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.39
                            }}
                        />
                        <CustomButton
                            onPress={() => {
                                sendRequestToCancelBooking();
                                setModalReasonVisible(false);
                            }}
                            type="active"
                            label="Xác nhận huỷ"
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.39
                            }}
                        />
                    </View>
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
