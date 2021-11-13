import {
    CenterLoader, CustomButton, CustomInput
} from '@components/uiComponents';
import { Theme } from '@constants/index';
import { ToastHelpers, ValidationHelpers } from '@helpers/index';
import { setCurrentUser } from '@redux/Actions';
import { CashServices, UserServices } from '@services/index';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function CashOutForm({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [cashOutForm, setCashOutForm] = useState({
        amount: ''
    });

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const listBank = useSelector((state) => state.bankReducer.listBank);

    const dispatch = useDispatch();

    const onChangeNumberOfDiamond = (amount) => {
        setCashOutForm({ ...cashOutForm, amount });
    };

    const renderBankAccountInfoItem = (label, value) => (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10
            }}
        >
            <View
                style={{
                    width: SIZES.WIDTH_BASE * 0.4
                }}
            >
                <Text
                    style={{
                        fontFamily: TEXT_REGULAR,
                        color: COLORS.DEFAULT,
                        fontSize: SIZES.FONT_H2,
                    }}
                >
                    {`${label}:`}
                </Text>
            </View>
            <View
                style={{
                    width: SIZES.WIDTH_BASE * 0.5,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        fontFamily: TEXT_REGULAR,
                        color: COLORS.ACTIVE,
                        fontSize: SIZES.FONT_H2
                    }}
                >
                    {value}
                </Text>
            </View>
        </View>
    );

    const renderBankInfo = () => {
        const {
            bankNum, ownerName, bankId
        } = currentUser;
        if (!bankNum) {
            return (
                <>
                    <Text
                        style={{
                            color: COLORS.DEFAULT,
                            alignSelf: 'center',
                            marginVertical: 10,
                            fontFamily: TEXT_REGULAR
                        }}
                    >
                        Bạn chưa cài đặt tài khoản ngân hàng
                    </Text>
                </>
            );
        }

        const bankName = listBank.find((item) => item.id === bankId)?.name;
        return (
            <>
                {renderBankAccountInfoItem('Số tài khoản', `${bankNum.substring(0, bankNum.length - 4)}xxxx`)}
                {renderBankAccountInfoItem('Ngân hàng', bankName || 'N/a')}
                {renderBankAccountInfoItem('Chủ tài khoản', ownerName)}
            </>
        );
    };

    const renderCashOutForm = () => {
        const { amount } = cashOutForm;
        const { bankNum, bankId } = currentUser;

        let bankUrl = '';
        if (bankNum) {
            bankUrl = listBank.find((item) => item.id === bankId)?.url;
        }

        return (
            <View
                style={{
                    width: SIZES.WIDTH_BASE * 0.9,
                    alignSelf: 'center',
                    marginTop: 20
                }}
            >
                {renderBankInfo()}

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Image
                        source={
                            bankUrl
                                ? {
                                    uri: bankUrl
                                }
                                // eslint-disable-next-line global-require
                                : require('@assets/images/icon.png')
                        }
                        style={{
                            width: 48,
                            height: 48,
                            borderColor: COLORS.ACTIVE,
                            borderWidth: 1,
                            borderRadius: 5,
                        }}
                    />
                    <CustomInput
                        value={amount}
                        keyboardType="number-pad"
                        onChangeText={(input) => onChangeNumberOfDiamond(input)}
                        containerStyle={{
                            marginVertical: 10,
                            width: (SIZES.WIDTH_BASE * 0.9) - 58,
                        }}
                        inputStyle={{
                            fontFamily: TEXT_BOLD,
                            color: COLORS.ACTIVE,
                            textAlign: 'center',
                            fontSize: SIZES.FONT_H1
                        }}
                    />
                </View>
            </View>
        );
    };

    const renderPanelButton = () => (
        <View
            style={{
                width: SIZES.WIDTH_BASE * 0.9,
                paddingTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'center',
                marginBottom: 20
            }}
        >
            <CustomButton
                onPress={() => {
                    navigation.goBack();
                    setCashOutForm({});
                }}
                type="default"
                label="Huỷ bỏ"
            />
            <CustomButton
                onPress={() => onSubmit()}
                type="active"
                label="Xác nhận"
            />
        </View>
    );

    const getCurrentUser = async () => {
        const result = await UserServices.fetchCurrentUserInfoAsync();
        const { data } = result;

        if (data) {
            const userInfoMapped = await UserServices.mappingCurrentUserInfo(data.data);
            dispatch(setCurrentUser(userInfoMapped));
        }
        setIsShowSpinner(false);
    };

    const validate = () => {
        const validationArr = [
            {
                fieldName: 'Số tiền',
                input: cashOutForm.amount,
                validate: {
                    required: {
                        value: true,
                    },
                    equalGreaterThan: {
                        value: 500000
                    },
                }
            },
        ];

        if (currentUser.bankNum === '') {
            ToastHelpers.renderToast('Bạn chưa cài đặt tài khoản\nngân hàng');
            return false;
        }

        if (!ValidationHelpers.validate(validationArr)) return false;

        if (cashOutForm.amount > currentUser.walletAmount) {
            ToastHelpers.renderToast('Số dư không đủ');
            return false;
        }

        return true;
    };

    const onSubmit = async () => {
        if (validate()) {
            const preSessionCashOut = await SecureStore.getItemAsync('cashOutTimeSession');

            if (Date.now() - preSessionCashOut < 120000) { // millisecond
                ToastHelpers.renderToast('Lần rút tiền tiếp theo cần sau 2 phút.', 'error');
                return;
            }

            setIsShowSpinner(true);
            const result = await CashServices.submitCashOutRequestAsync(cashOutForm);
            const { data } = result;

            if (data) {
                ToastHelpers.renderToast(data.message || 'Success!', 'success');
                getCurrentUser();
                navigation.goBack();
                SecureStore.setItemAsync('cashOutTimeSession', `${Date.now()}`);
            } else {
                setIsShowSpinner(false);
            }
        }
    };

    return (
        <>
            {isShowSpinner ? (
                <View
                    style={{
                        marginTop: SIZES.HEIGHT_BASE * 0.3
                    }}
                >
                    <CenterLoader />
                </View>
            ) : (
                <View
                    style={{
                        backgroundColor: COLORS.BASE,
                    }}
                >
                    <View
                        style={{
                            zIndex: 99,
                            backgroundColor: COLORS.BASE,
                            marginTop: 5
                        }}
                    >
                        {/* {renderForm()} */}
                        {renderCashOutForm()}

                        {renderPanelButton()}
                    </View>

                    {/* <NoteText
                        width={SIZES.WIDTH_BASE * 0.9}
                        title="Giá trị quy đổi:"
                        content={generateNoteContent()}
                        contentStyle={{
                            fontSize: SIZES.FONT_H2,
                            color: COLORS.ACTIVE,
                            fontFamily: TEXT_BOLD,
                            marginVertical: 10
                        }}
                        iconComponent={(
                            <IconCustom
                                name="info-circle"
                                family={IconFamily.FONT_AWESOME}
                                size={16}
                                color={COLORS.ACTIVE}
                            />
                        )}
                        backgroundColor={COLORS.LIST_ITEM_BACKGROUND_1}
                    /> */}
                </View>
            )}
        </>
    );
}
