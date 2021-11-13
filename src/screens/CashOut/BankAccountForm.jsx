import {
    CenterLoader, CustomButton, CustomInput
} from '@components/uiComponents';
import { Theme } from '@constants/index';
import { ToastHelpers, ValidationHelpers } from '@helpers/index';
import { Picker } from '@react-native-picker/picker';
import { setCurrentUser, setListBank } from '@redux/Actions';
import { BankServices, UserServices } from '@services/index';
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const {
    SIZES,
    COLORS
} = Theme;

export default function BankAccountForm({ setTabActiveIndex }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [bankAccountForm, setBankAccountForm] = useState({
        bankNum: '',
        ownerName: '',
        bankId: '',
    });

    const listBank = useSelector((state) => state.bankReducer.listBank);
    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    useEffect(
        () => {
            fetchListBankByStore();

            const { bankId, bankNum, ownerName } = currentUser;
            if (!bankNum) return;

            const bankAccount = {
                bankId,
                bankNum,
                ownerName
            };

            setBankAccountForm(bankAccount);
        }, []
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

    const onChangeBankId = (bankId) => {
        const bankAccountFormTemp = { ...bankAccountForm, bankId };
        setBankAccountForm(bankAccountFormTemp);
    };

    const onChangeBankNumber = (bankNum) => {
        const bankAccountFormTemp = { ...bankAccountForm, bankNum };
        setBankAccountForm(bankAccountFormTemp);
    };

    const onChangeBankHolder = (ownerName) => {
        const bankAccountFormTemp = { ...bankAccountForm, ownerName };
        setBankAccountForm(bankAccountFormTemp);
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
                input: bankAccountForm.bankNum,
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
                input: bankAccountForm.ownerName,
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
            }
        ];

        return ValidationHelpers.validate(validationArr);
    };

    const onSubmitCreateBankAccount = async () => {
        if (validate()) {
            const {
                bankNum, bankId, ownerName
            } = bankAccountForm;

            const body = {
                bankNum,
                ownerName,
                bankId
            };

            setIsShowSpinner(true);

            const result = await BankServices.submitAddBankAccountAsync(body);
            const { data } = result;

            if (data) {
                setBankAccountForm(data);
                getCurrentUser();
                ToastHelpers.renderToast(data.message, 'success');
                setTabActiveIndex(0);
            }
            setIsShowSpinner(false);
        }
    };

    const renderBankAccountForm = () => {
        const {
            ownerName,
            bankNum,
            bankId
        } = bankAccountForm;

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
                    <Picker
                        selectedValue={bankId}
                        onValueChange={(itemValue) => onChangeBankId(itemValue)}
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
                        onChangeText={(input) => onChangeBankNumber(input)}
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        label="Số tài khoản"
                        keyboardType="number-pad"
                    />

                    <CustomInput
                        value={ownerName}
                        onChangeText={(input) => onChangeBankHolder(input)}
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        label="Chủ tài khoản"
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 20,
                            marginTop: 10
                        }}
                    >
                        <CustomButton
                            onPress={() => {
                                const { userBankInfo } = currentUser;
                                const bankAccount = {
                                    bankId: userBankInfo.bank.id,
                                    bankNum: userBankInfo.bankNum,
                                    ownerName: userBankInfo.ownerName
                                };

                                setBankAccountForm(bankAccount);
                            }}
                            type="default"
                            label="Huỷ bỏ"
                        />
                        <CustomButton
                            onPress={() => onSubmitCreateBankAccount()}
                            type="active"
                            label="Xác nhận"
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
                        {renderBankAccountForm()}
                    </View>
                </View>
            )}
        </>
    );
}
