import {
    CenterLoader, CustomButton, CustomInput, CustomText, NoteText, IconCustom
} from '@components/uiComponents';
import { Theme } from '@constants/index';
import { CommonHelpers, ToastHelpers, ValidationHelpers } from '@helpers/index';
import { Picker } from '@react-native-picker/picker';
import { setCurrentUser, setListBank } from '@redux/Actions';
import { BankServices, CashServices, UserServices } from '@services/index';
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import IconFamily from '@constants/IconFamily';

const {
    SIZES,
    COLORS,
    FONT: {
        TEXT_BOLD,
        TEXT_REGULAR
    }
} = Theme;

export default function CashOut() {
    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    const { bankName, bankShortName, bankBranch, bankNum, ownerName } = currentUser;
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [cashOutForm, setCashOutForm] = useState({
        bankName,
        bankShortName,
        bankBranch,
        bankNum,
        ownerName,
        amount: ''
    });
    const [amountDisplay, setAmountDisplay] = useState('');

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
                fieldName: 'Ngân hàng',
                input: cashOutForm.bankName,
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
            {
                fieldName: 'Viết tắt',
                input: cashOutForm.bankShortName,
                validate: {
                    required: {
                        value: true,
                    },
                    maxLength: {
                        value: 20,
                    },
                    minLength: {
                        value: 2,
                    },
                }
            },
            {
                fieldName: 'Chi nhánh',
                input: cashOutForm.bankBranch,
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
                fieldName: 'Số Xu',
                input: cashOutForm.amount,
                validate: {
                    required: {
                        value: true,
                    },
                    equalGreaterThan: {
                        value: 50000
                    },
                }
            },
        ];

        if (cashOutForm.amount > currentUser.walletAmount) {
            ToastHelpers.renderToast('Số Xu rút vượt quá số dư trong Ví');
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
            bankName,
            bankShortName,
            bankBranch,
            bankNum,
            ownerName,
        } = cashOutForm;

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
                    <CustomInput
                        value={bankName}
                        onChangeText={(input) => setCashOutForm({ ...cashOutForm, bankName: input })}
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        label="Ngân hàng"
                    />

                    <CustomInput
                        value={bankShortName}
                        inputStyle={{ width: 200 }}
                        onChangeText={(input) => setCashOutForm({ ...cashOutForm, bankShortName: input })}
                        containerStyle={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        label="Viết tắt"
                    />

                    <CustomInput
                        value={bankBranch}
                        inputStyle={{ width: 200 }}
                        onChangeText={(input) => setCashOutForm({ ...cashOutForm, bankBranch: input })}
                        containerStyle={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        label="Chi nhanh"
                    />

                    <CustomInput
                        value={bankNum}
                        inputStyle={{ width: 200 }}
                        onChangeText={(input) => setCashOutForm({ ...cashOutForm, bankNum: input })}
                        containerStyle={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        label="Số tài khoản:"
                        keyboardType="number-pad"
                    />

                    <CustomInput
                        value={ownerName}
                        inputStyle={{ width: 200 }}
                        onChangeText={(input) => setCashOutForm({ ...cashOutForm, ownerName: input })}
                        containerStyle={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.9
                        }}
                        label="Chủ tài khoản:"
                    />

                    <View
                        style={{
                            width: '100%',
                            // borderColor: COLORS.ACTIVE,
                            // borderRadius: 20,
                            // borderWidth: 1,
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
                            text={`Tổng Xu: ${CommonHelpers.formatCurrency(currentUser.walletAmount)}`}
                        />
                    </View>

                    <CustomInput
                        label="Số Xu rút: (1 Xu = 1 VND)"
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

                    <View
                        style={{
                            marginBottom: 5
                        }}
                    >
                        <NoteText
                            width={SIZES.WIDTH_BASE * 0.9}
                            title="Lưu ý:"
                            content="Nếu chuyển tiền giữa các ngân hàng mất phí thì chi phí này sẽ do người rút chi trả."
                            contentStyle={{
                                fontSize: SIZES.FONT_H4,
                                color: COLORS.ACTIVE,
                                fontFamily: TEXT_REGULAR,
                            }}
                            iconComponent={(
                                <IconCustom
                                    name="info-circle"
                                    family={IconFamily.FONT_AWESOME}
                                    size={18}
                                    color={COLORS.ACTIVE}
                                />
                            )}
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
