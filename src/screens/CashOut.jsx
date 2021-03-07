import { Block, Button, Text } from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import {
    CenterLoader, IconCustom, Input, Line, NoteText
} from '../components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '../constants';
import { ToastHelpers } from '../helpers';
import { setCurrentUser } from '../redux/Actions';
import { rxUtil } from '../utils';

export default function CashOut(props) {
    const { navigation } = props;

    const [cashOutForm, setCashOutForm] = useState({
        amount: 0,
        bankNum: '',
        ownerName: ''
    });
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [bankId, setBankId] = useState('');
    const [listBankAccount, setListBankAccount] = useState([]);

    const token = useSelector((state) => state.userReducer.token);

    const dispatch = useDispatch();

    useEffect(
        () => {
            const eventTriggerGetListBankAccountAPI = navigation.addListener(
                'focus',
                () => {
                    getListBankAccountByUserAPI();
                }
            );

            // componentWillUnmount
            return eventTriggerGetListBankAccountAPI;
        }, []
    );

    const getCurrentUser = () => {
        rxUtil(
            Rx.USER.CURRENT_USER_INFO,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                dispatch(setCurrentUser(res.data.data));
            },
            () => {},
            () => {}
        );
    };

    const getListBankAccountByUserAPI = () => {
        rxUtil(
            Rx.BANK.BANK_ACCOUNTS,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setListBankAccount(res.data.data);
            },
            () => {},
            () => {}
        );
    };

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const isValidForm = () => {
        const { amount } = cashOutForm;

        if (!bankId) {
            ToastHelpers.renderToast('Vui lòng chọn tài khoản ngân hàng.');
            return false;
        }

        if (!amount || amount === 0) {
            ToastHelpers.renderToast('Vui lòng nhập số lượng kim cương muốn rút.');
            return false;
        }

        return true;
    };

    const onSubmit = () => {
        if (!isValidForm()) {
            return;
        }

        setIsShowSpinner(true);

        rxUtil(
            `${Rx.CASH_REQUEST.CREATE_CASH_OUT_REQUEST}/${bankId}`,
            'POST',
            cashOutForm,
            {
                Authorization: token
            },
            (res) => {
                navigation.goBack();
                ToastHelpers.renderToast(res.data.message || 'Success!', 'success');

                setIsShowSpinner(false);
                getCurrentUser();
            },
            () => {
                ToastHelpers.renderToast();
                setIsShowSpinner(false);
            },
            (errMessage) => {
                const arrErrorMessage = Object.values(errMessage);
                ToastHelpers.renderToast(arrErrorMessage, 'error');

                setIsShowSpinner(false);
            }
        );
    };

    const onChangeBankAccount = (bankAccount) => {
        const { bankNum, ownerName, bank: { id } } = bankAccount;
        const cashOutFormTemp = { ...cashOutForm, bankNum, ownerName };

        setCashOutForm(cashOutFormTemp);
        setBankId(id);
    };

    const onChangeNumberfDiamond = (amount) => {
        const cashOutFormTemp = { ...cashOutForm, amount };

        setCashOutForm(cashOutFormTemp);
    };

    const reverse = (s) => s.split('').reverse().join('');

    const convertListBankAccountToDropdown = () => {
        const listBankFinal = [];
        if (listBankAccount.length !== 0) {
            listBankAccount.forEach((item) => {
                const {
                    bankNum,
                    ownerName,
                    bank: {
                        codeName
                    }, id
                } = item;
                const reverseString = reverse(bankNum);
                const label = `xxxx ${reverseString.substring(0, 4)} - ${codeName} - ${ownerName}`;
                const bankAccount = { ...item };

                bankAccount.label = label;
                bankAccount.value = id;
                listBankFinal.push(bankAccount);
            });
        }
        return listBankFinal;
    };

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderForm = () => {
        const { numberOfDiamond } = cashOutForm;
        const listBankAccountDropdown = convertListBankAccountToDropdown(listBankAccount);

        return (
            <>
                <DropDownPicker
                    items={listBankAccountDropdown}
                    containerStyle={{
                        borderRadius: 5,
                        width: NowTheme.SIZES.WIDTH_90,
                        alignSelf: 'center',
                        height: 60,
                        marginVertical: 5,
                        marginTop: 15
                    }}
                    selectedtLabelStyle={{
                        color: 'red'
                    }}
                    placeholderStyle={{
                        color: NowTheme.COLORS.MUTED,
                        fontSize: 16
                    }}
                    itemStyle={{
                        justifyContent: 'flex-start',
                    }}
                    dropDownStyle={{ backgroundColor: '#fafafa' }}
                    activeLabelStyle={{ color: NowTheme.COLORS.ACTIVE }}
                    onChangeItem={(item) => onChangeBankAccount(item)}
                    labelStyle={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                    }}
                    placeholder="Chọn tài khoản thanh toán..."
                    searchable
                    searchablePlaceholder="Tìm kiếm..."
                    searchablePlaceholderTextColor={NowTheme.COLORS.MUTED}
                    searchableError={() => <Text>Not Found</Text>}
                />
                <Block
                    style={{
                        width: NowTheme.SIZES.WIDTH_90,
                        alignSelf: 'center',
                        paddingBottom: 10
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            navigation.navigate(ScreenName.BANK_ACCOUNT, {
                                listBankAccount
                            });
                        }}
                    >
                        <Text
                            color={NowTheme.COLORS.ACTIVE}
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                            }}
                        >
                            Danh sách tài khoản ngân hàng
                        </Text>
                    </TouchableWithoutFeedback>
                </Block>

                <Input
                    style={{
                        borderRadius: 5,
                        width: NowTheme.SIZES.WIDTH_90,
                        alignSelf: 'center',
                        height: 60,
                    }}
                    size={24}
                    value={numberOfDiamond}
                    onChangeText={(input) => onChangeNumberfDiamond(input)}
                    keyboardType="number-pad"
                    placeholder="Nhập số kim cương muốn quy đổi..."
                    textInputStyle={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        fontSize: 16
                    }}
                />
            </>
        );
    };

    const renderPanelButton = () => (
        <Block
            center
            style={{
                paddingTop: 10
            }}
        >
            <Button
                style={{
                    width: NowTheme.SIZES.WIDTH_90,
                    marginVertical: 5
                }}
                shadowless
                onPress={() => onSubmit()}
            >
                Xác nhận
            </Button>
            <Button
                style={{
                    width: NowTheme.SIZES.WIDTH_90,
                    marginBottom: 10
                }}
                shadowless
                color={NowTheme.COLORS.DEFAULT}
                onPress={() => {
                    navigation.goBack();
                    setCashOutForm({});
                }}
            >
                Huỷ bỏ
            </Button>
        </Block>
    );

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader size="small" />
                ) : (
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <Block>
                            <Block
                                style={{
                                    marginVertical: 10,
                                    backgroundColor: NowTheme.COLORS.BASE,
                                }}
                            >
                                <Block
                                    style={{
                                        marginHorizontal: 10,
                                    }}
                                >
                                    <Block
                                        row
                                        style={{
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text style={{
                                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                            marginVertical: 10
                                        }}
                                        >
                                            THÔNG TIN GIAO DỊCH
                                        </Text>
                                        <Block>
                                            <TouchableWithoutFeedback onPress={() => {
                                                navigation.navigate(ScreenName.WALLET);
                                            }}
                                            >
                                                <Text color={NowTheme.COLORS.FACEBOOK}>
                                                    Xem rương
                                                </Text>
                                            </TouchableWithoutFeedback>
                                        </Block>
                                    </Block>
                                    <Line
                                        borderWidth={0.5}
                                        borderColor={NowTheme.COLORS.ACTIVE}
                                    />
                                </Block>

                                <Block
                                    style={{
                                        zIndex: 99
                                    }}
                                >
                                    {renderForm()}
                                </Block>

                                <NoteText
                                    width={NowTheme.SIZES.WIDTH_90}
                                    title="Giá trị quy đổi:"
                                    content="1.000 vnd = 1 kim cương"
                                    contentStyle={{
                                        fontSize: 18,
                                        color: NowTheme.COLORS.ACTIVE,
                                        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD
                                    }}
                                    iconComponent={(
                                        <IconCustom
                                            name="info-circle"
                                            family={IconFamily.FONT_AWESOME}
                                            size={16}
                                            color={NowTheme.COLORS.ACTIVE}
                                        />
                                    )}
                                    backgroundColor={NowTheme.COLORS.LIST_ITEM_BACKGROUND_1}
                                />

                                {renderPanelButton()}
                            </Block>
                        </Block>
                    </KeyboardAwareScrollView>
                )}
            </>
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
