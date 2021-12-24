import { CustomButton, CustomInput, CustomModal } from '@components/uiComponents';
import { Theme } from '@constants/index';
import { ToastHelpers, ValidationHelpers } from '@helpers/index';
import { setShowLoaderStore } from '@redux/Actions';
import { BookingServices } from '@services/index';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

const {
    FONT: {
        TEXT_BOLD
    }, SIZES,
} = Theme;

export default function ReasonCancelBookingModal({
    modalReasonVisible,
    setModalReasonVisible,
    bookingId,
    onSubmitReason
}) {
    const [reason, setReason] = useState();
    const dispatch = useDispatch();

    const renderReasonInput = () => (
        <CustomInput
            value={reason}
            inputStyle={{
                width: SIZES.WIDTH_BASE * 0.8,
                textAlign: 'center',
                fontFamily: TEXT_BOLD
            }}
            onChangeText={(input) => setReason(input)}
            containerStyle={{
                marginVertical: 20,
                width: SIZES.WIDTH_BASE * 0.9,
                alignItems: 'center'
            }}
            autocapitalize
            placeholder="Nhập lý do huỷ..."
        />
    );

    const sendRequestToCancelBooking = async () => {
        if (!validate()) {
            return;
        }

        setModalReasonVisible(false);
        dispatch(setShowLoaderStore(true));
        const result = await BookingServices.submitCancelBookingAsync(bookingId, {
            rejectReason: reason
        });

        const { data } = result;
        if (data) {
            onSubmitReason();
            ToastHelpers.renderToast(data.message, 'success');
        }
        dispatch(setShowLoaderStore(false));
    };

    const validate = () => {
        const validationArr = [
            {
                fieldName: 'Lý do huỷ',
                input: reason,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 300,
                    },
                    minLength: {
                        value: 5,
                    },
                }
            },
        ];

        return ValidationHelpers.validate(validationArr);
    };

    const renderReasonCancelBookingModal = () => (
        <CustomModal
            modalVisible={modalReasonVisible}
            renderContent={() => (
                <>
                    {renderReasonInput()}
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
                            label="Đóng"
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.39
                            }}
                        />
                        <CustomButton
                            onPress={() => {
                                sendRequestToCancelBooking();
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
