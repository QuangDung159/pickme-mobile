import { CustomButton, CustomInput, CustomModal } from '@components/uiComponents';
import Gender from '@constants/Gender';
import Theme from '@constants/Theme';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

const {
    FONT: {
        TEXT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;

export default function FilterModal({ modalFilterVisible, setModalFilterVisible }) {
    const [filterObj, setFilterObj] = useState({
        ageFrom: 20,
        ageTo: 25,
        feeFrom: 1250,
        feeTo: 2000,
        rating: 4.5,
        from: 'Hồ Chí Minh',
        gender: Gender.FEMALE
    });

    const renderFilterModal = () => (
        <CustomModal
            modalVisible={modalFilterVisible}
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
                        Bộ lọc
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
                            placeholder="Độ tuổi:"
                            value={filterObj.ageFrom}
                            onChangeText={(input) => setFilterObj({ ...filterObj, ageFrom: +input })}
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
                                setModalFilterVisible(false);
                            }}
                            type="default"
                            label="Huỷ"
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.39
                            }}
                        />
                        <CustomButton
                            onPress={() => {
                                setModalFilterVisible(false);
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
        <>{renderFilterModal()}</>
    );
}
