import { CustomButton, CustomInput, CustomModal } from '@components/uiComponents';
import Theme from '@constants/Theme';
import ToastHelpers from '@helpers/ToastHelpers';
import { setShowLoaderStore } from '@redux/Actions';
import UserServices from '@services/UserServices';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

const {
    FONT: {
        TEXT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;

export default function ReportModal({ modalReportVisible, setModalReportVisible, partner }) {
    const [reportDesc, setReportDesc] = useState();

    const dispatch = useDispatch();

    const sendReport = async () => {
        if (!reportDesc) {
            ToastHelpers.renderToast('Nội dung không được bỏ trống');
            return;
        }

        dispatch(setShowLoaderStore(true));
        const result = await UserServices.submitReportUserAsync({ description: reportDesc }, partner.id);
        const { data } = result;

        if (data) {
            ToastHelpers.renderToast(data.message, 'success');
            setModalReportVisible(false);
        }
        dispatch(setShowLoaderStore(false));
    };

    const onChangeReport = (reportInput) => {
        setReportDesc(reportInput);
    };

    const renderReportModal = () => (
        <CustomModal
            modalVisible={modalReportVisible}
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
                        Vui lòng nhập ý kiến
                    </Text>

                    <CustomInput
                        multiline
                        onChangeText={(reportInput) => onChangeReport(reportInput)}
                        value={reportDesc}
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.8
                        }}
                        inputStyle={{
                            height: 80
                        }}
                        placeholder="Nhập mô tả..."
                    />
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
                                setModalReportVisible(false);
                            }}
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.39
                            }}
                            type="default"
                            label="Huỷ"
                        />
                        <CustomButton
                            onPress={() => {
                                sendReport();
                            }}
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.39
                            }}
                            type="active"
                            label="Gửi báo cáo"
                        />
                    </View>
                </>
            )}
        />
    );

    return (
        <>
            {renderReportModal()}
        </>
    );
}
