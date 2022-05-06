import {
    CenterLoader, CustomButton, CustomInput, CustomText, IconCustom, NoteText
} from '@components/uiComponents';
import IconFamily from '@constants/IconFamily';
import { Theme } from '@constants/index';
import { CommonHelpers, ToastHelpers, ValidationHelpers } from '@helpers/index';
import { setCurrentUser } from '@redux/Actions';
import { CashServices, UserServices } from '@services/index';
import React, { useState } from 'react';
import { Platform, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

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

    const {
        bankName, bankShortName, bankBranch, bankNum, ownerName
    } = currentUser;
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

    const renderCashOutForm = () => (
        <View
            style={{
                backgroundColor: COLORS.BASE,
                width: SIZES.WIDTH_BASE
            }}
        >
            <View
                style={{
                    width: SIZES.WIDTH_MAIN,
                    alignSelf: 'center',
                    marginTop: Platform.OS === 'ios' ? 0 : 10
                }}
            >
                <CustomInput
                    value={bankName}
                    onChangeText={(input) => setCashOutForm({ ...cashOutForm, bankName: input })}
                    containerStyle={{
                        width: SIZES.WIDTH_MAIN,
                        marginTop: 10
                    }}
                    label="Tên ngân hàng:"
                />

                <CustomInput
                    value={bankShortName}
                    inputStyle={{ width: SIZES.WIDTH_BASE * 0.65 }}
                    label="Viết tắt:"
                    onChangeText={(input) => setCashOutForm({ ...cashOutForm, bankShortName: input })}
                    containerStyle={{
                        width: SIZES.WIDTH_MAIN,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10
                    }}
                />

                <CustomInput
                    value={bankBranch}
                    inputStyle={{ width: SIZES.WIDTH_BASE * 0.65 }}
                    onChangeText={(input) => setCashOutForm({ ...cashOutForm, bankBranch: input })}
                    containerStyle={{
                        width: SIZES.WIDTH_MAIN,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10
                    }}
                    label="Chi nhánh:"
                />

                <CustomInput
                    value={bankNum}
                    inputStyle={{ width: SIZES.WIDTH_BASE * 0.65 }}
                    onChangeText={(input) => setCashOutForm({ ...cashOutForm, bankNum: input })}
                    containerStyle={{
                        width: SIZES.WIDTH_MAIN,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10
                    }}
                    label="Số tài khoản:"
                    keyboardType="number-pad"
                />

                <CustomInput
                    value={ownerName}
                    inputStyle={{ width: SIZES.WIDTH_BASE * 0.65 }}
                    onChangeText={(input) => setCashOutForm({ ...cashOutForm, ownerName: input })}
                    containerStyle={{
                        width: SIZES.WIDTH_MAIN,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginVertical: 10
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
                        width: (SIZES.WIDTH_MAIN) - 58,
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
                            width: SIZES.WIDTH_MAIN
                        }}
                    />
                </View>

                <View
                    style={{
                        marginBottom: 5
                    }}
                >
                    <NoteText
                        width={SIZES.WIDTH_MAIN}
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
