import { Picker } from '@react-native-picker/picker';
import { Block } from 'galio-framework';
import React from 'react';
import {
    Modal, StyleSheet, Text, View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { CustomButton } from '../../components/uiComponents';
import { NowTheme, Rx, ScreenName } from '../../constants';
import { ToastHelpers } from '../../helpers';
import { setListBookingStore, setPersonTabActiveIndex, setShowLoaderStore } from '../../redux/Actions';
import { rxUtil } from '../../utils';

export default function ReasonCancelBookingModal({
    modalReasonVisible,
    reason,
    onChangeReason,
    setModalReasonVisible,
    bookingId,
    navigation
}) {
    const reasonDropdownArr = [
        { label: 'Bận đột xuất', value: 0 },
        { label: 'Lý do khác', value: 1 }
    ];

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

    const renderReasonDropdown = () => (
        <Picker
            selectedValue={reason.value}
            onValueChange={(itemValue) => onChangeReason(itemValue)}
            fontFamily={NowTheme.FONT.MONTSERRAT_REGULAR}
            style={{
                width: NowTheme.SIZES.WIDTH_BASE * 0.84
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
        <Modal
            animationType="slide"
            transparent
            visible={modalReasonVisible}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
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
                                width: NowTheme.SIZES.WIDTH_BASE * 0.84
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
                                    width: NowTheme.SIZES.WIDTH_BASE * 0.41
                                }}
                            />
                            <CustomButton
                                onPress={() => {
                                    setModalReasonVisible(false);
                                }}
                                type="active"
                                label="Cân nhắc lại"
                                buttonStyle={{
                                    width: NowTheme.SIZES.WIDTH_BASE * 0.41
                                }}
                            />
                        </Block>
                    </View>
                </View>
            </ScrollView>
        </Modal>
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

const styles = StyleSheet.create({
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: NowTheme.SIZES.HEIGHT_BASE * 0.3
    },
    modalView: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
});
