import {
    CenterLoader, CustomButton, CustomInput, CustomText
} from '@components/uiComponents';
import { Theme } from '@constants/index';
import { CommonHelpers, ToastHelpers, ValidationHelpers } from '@helpers/index';
import { Picker } from '@react-native-picker/picker';
import { setCurrentUser, setListBank } from '@redux/Actions';
import { BankServices, CashServices, UserServices } from '@services/index';
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const {
    SIZES,
    COLORS,
    FONT: {
        TEXT_BOLD
    }
} = Theme;

export default function CashOut() {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [cashOutForm, setCashOutForm] = useState({
        bankNum: '',
        ownerName: '',
        bankId: '',
        amount: ''
    });
    const [amountDisplay, setAmountDisplay] = useState('');

    const listBank = useSelector((state) => state.bankReducer.listBank);
    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    useEffect(
        () => {
            fetchListBankByStore();

            const { bankNum, ownerName } = currentUser;
            setCashOutForm({
                ...cashOutForm,
                bankNum,
                ownerName,
                amount: ''
            });
        }, []
    );

    useEffect(
        () => {
            if (listBank && listBank.length > 0) {
                const { bankId } = currentUser;
                setCashOutForm({
                    ...cashOutForm,
                    bankId: bankId || listBank[0].id,
                });
            }
        }, [listBank]
    );

    const fetchListBankByStore = () => {
        if (!listBank || listBank.length === 0) {
            setIsShowSpinner(true);
            fetchListBank();
        }
    };

    const fetchListBank = async () => {
        const result = await BankServices.fetchListBankAsync();
        const { data } = result;

        if (data) {
            const listBankFetched = data.data;
            dispatch(setListBank(listBankFetched));
        }
        setIsShowSpinner(false);
    };

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
                fieldName: 'Số tài khoản',
                input: cashOutForm.bankNum,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 20,
                    },
                    minLength: {
                        value: 5,
                    },
                }
            },
            {
                fieldName: 'Chủ tài khoản',
                input: cashOutForm.ownerName,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 50,
                    },
                    minLength: {
                        value: 5,
                    },
                }
            },
            {
                fieldName: 'Số tiền',
                input: cashOutForm.amount,
                validate: {
                    required: {
                        value: true,
                    },
                    equalGreaterThan: {
                        value: 100000
                    },
                }
            },
        ];

        if (cashOutForm.amount > currentUser.walletAmount) {
            ToastHelpers.renderToast('Số tiền rút vượt quá số dư trong rương');
            return false;
        }

        return ValidationHelpers.validate(validationArr);
    };

    const onSubmitCashOut = async () => {
        if (validate()) {
            setIsShowSpinner(true);

            const result = await CashServices.submitCashOutRequestAsync(cashOutForm);
            const { data } = result;

            if (data) {
                // setCashOutForm(data);
                getCurrentUser();
                ToastHelpers.renderToast(data.message, 'success');
                setAmountDisplay('');
            }
            setIsShowSpinner(false);
        }
    };

    const renderCashOutForm = () => {
        const {
            ownerName,
            bankNum,
            bankId,
        } = cashOutForm;

        const listBankFinal = [];

        if (listBank) {
            listBank.forEach((item) => {
                const bank = { ...item };
                bank.label = `${item.codeName} - ${item.name}`;
                bank.value = item.id;
                listBankFinal.push(bank);
            });
        }

        return (
            <View
                style={{
                    backgroundColor: COLORS.BASE,
                    width: SIZES.WIDTH_BASE
                }}
            >
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.9,
                        alignSelf: 'center',
                        marginTop: Platform.OS === 'ios' ? 0 : 10
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            borderColor: COLORS.ACTIVE,
                            borderRadius: 20,
                            borderWidth: 1,
                            height: 35,
                            justifyContent: 'center'
                        }}
                    >
                        <CustomText
                            style={{
                                fontFamily: TEXT_BOLD,
                                fontSize: SIZES.FONT_H3,
                                color: COLORS.ACTIVE,
                                textAlign: 'center'
                            }}
                            text={`Số dư: ${CommonHelpers.formatCurrency(currentUser.walletAmount)}`}
                        />
                    </View>

                    <Picker
                        selectedValue={bankId}
                        onChangeText={(input) => setCashOutForm({ ...cashOutForm, bankId: input })}
                        itemStyle={{
                            fontSize: SIZES.FONT_H3,
                            textAlign: 'left',
                            color: COLORS.DEFAULT
                        }}
                        mode="dropdown"
                        dropdownIconColor={COLORS.ACTIVE}
                        style={{
                            fontSize: SIZES.FONT_H2,
                            color: COLORS.ACTIVE
                        }}
                    >
                        {
                            listBankFinal.map((item) => (
                                <Picker.Item label={`   ${item.label}`} value={item.value} key={item.value} />
                            ))
                        }
                    </Picker>
                    <CustomInput
                        value={bankNum}
                        onChangeText={(input) => setCashOutForm({ ...cashOutForm, bankNum: input })}
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        label="Số tài khoản:*"
                        keyboardType="number-pad"
                    />

                    <CustomInput
                        value={ownerName}
                        onChangeText={(input) => setCashOutForm({ ...cashOutForm, ownerName: input })}
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        label="Chủ tài khoản:*"
                    />
                    <CustomInput
                        label="Số tiền rút:*"
                        value={amountDisplay}
                        keyboardType="number-pad"
                        onChangeText={(input) => {
                            setCashOutForm({ ...cashOutForm, amount: input });
                            setAmountDisplay(input);
                        }}
                        containerStyle={{
                            marginVertical: 10,
                            width: (SIZES.WIDTH_BASE * 0.9) - 58,
                        }}
                        onEndEditing={
                            (e) => {
                                setAmountDisplay(CommonHelpers.formatCurrency(e.nativeEvent.text));
                            }
                        }
                        onFocus={() => {
                            setAmountDisplay(cashOutForm.amount);
                        }}
                        inputStyle={{
                            color: COLORS.ACTIVE,
                        }}
                    />
                    <View
                        style={{
                            marginBottom: 20,
                            marginTop: 10
                        }}
                    >
                        <CustomButton
                            onPress={() => onSubmitCashOut()}
                            type="active"
                            label="Xác nhận"
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.9
                            }}
                        />
                    </View>
                </View>
            </View>
        );
    };

    return (
        <>
            {isShowSpinner ? (
                <View
                    style={{
                        marginTop: SIZES.HEIGHT_BASE * 0.3
                    }}
                >
                    <CenterLoader size="small" />
                </View>
            ) : (
                <View
                    style={{
                        alignItems: 'center'
                    }}
                >
                    <View
                        style={{
                            marginTop: 5,
                            backgroundColor: COLORS.BASE,
                        }}
                    >
                        {renderCashOutForm()}
                    </View>
                </View>
            )}
        </>
    );
}
