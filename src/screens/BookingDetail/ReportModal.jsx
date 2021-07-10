import { CustomButton, CustomInput, CustomModal } from '@components/uiComponents';
import NowTheme from '@constants/NowTheme';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

const {
    FONT: {
        MONTSERRAT_REGULAR,
    },
    SIZES,
    COLORS
} = NowTheme;

export default function ReportModal({ modalReportVisible, setModalReportVisible }) {
    const [reportDesc, setReportDesc] = useState();

    const sendReport = async () => {
        // send report
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
                            fontFamily: MONTSERRAT_REGULAR,
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
                            alignSelf: 'center'
                        }}
                    >
                        <CustomButton
                            onPress={() => {
                                sendReport();
                                setModalReportVisible(false);
                            }}
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.8
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
