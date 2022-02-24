import { CustomButton, CustomInput, CustomModal } from '@components/uiComponents';
import Theme from '@constants/Theme';
import ToastHelpers from '@helpers/ToastHelpers';
import UserServices from '@services/UserServices';
import React, { useState } from 'react';
import { View, Text } from 'react-native';

const {
    FONT: {
        TEXT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;

export default function ModalReport({
    modalReasonVisible, setModalReasonVisible, setIsShowSpinner, userId
}) {
    const [reason, setReason] = useState('');

    const reportUser = async () => {
        setIsShowSpinner(true);
        const result = await UserServices.submitReportUserAsync({
            reason,
            images: []
        }, userId);

        const { data } = result;
        if (data) {
            ToastHelpers.renderToast(data.message, 'success');
        }

        setIsShowSpinner(false);
    };

    const renderReportModal = () => (
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
                        Vui lòng nhập mô tả ngắn gọn
                    </Text>
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
                        <CustomInput
                            multiline
                            placeholder="Nhập mô tả"
                            value={reason}
                            onChangeText={(input) => setReason(input)}
                            inputStyle={{
                                height: 60,
                                width: SIZES.WIDTH_BASE * 0.8,
                            }}
                            containerStyle={{
                                marginVertical: 10,
                            }}
                        />
                    </View>

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
                            label="Huỷ"
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.39
                            }}
                        />
                        <CustomButton
                            onPress={() => {
                                reportUser();
                                setModalReasonVisible(false);
                            }}
                            type="active"
                            label="Xác nhận"
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.39
                            }}
                        />
                    </View>
                </>
            )}
        />
    );

    return (
        <View>
            {renderReportModal()}
        </View>
    );
}
