import {
    Block, Button, Input, Text
} from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageScalable from 'react-native-scalable-image';
import { useDispatch, useSelector } from 'react-redux';
import { CenterLoader } from '../components/uiComponents';
import { NowTheme, Rx } from '../constants';
import { ToastHelpers } from '../helpers';
import { rxUtil } from '../utils';
import { setListBank } from '../redux/Actions';

export default function BankAccount(props) {
    const { route } = props;
    const [bankAccountForm, setBankAccountForm] = useState({
        bankNum: '',
        ownerName: '',
        bankId: '',
        bankCode: ''
    });
    const [isShowForm, setIsShowForm] = useState(false);
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [listBankAccount, setListBankAccount] = useState([]);

    const token = useSelector((state) => state.userReducer.token);
    const listBank = useSelector((state) => state.bankReducer.listBank);

    const dispatch = useDispatch();

    useEffect(
        () => {
            setListBankAccount(route.params?.listBankAccount || []);
            fetchListBank();
        }, []
    );

    const fetchListBank = () => {
        if (!listBank || listBank.length === 0) {
            rxUtil(
                Rx.BANK.GET_LIST_BANK,
                'GET',
                null,
                {
                    Authorization: token
                },
                (res) => {
                    const listBankFetched = res.data.data;
                    dispatch(setListBank(listBankFetched));
                }
            );
        }
    };

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const onSubmitCreateBankAccount = () => {
        const {
            bankNum, bankId, ownerName
        } = bankAccountForm;

        const data = {
            bankNum,
            ownerName
        };

        setIsShowSpinner(true);

        rxUtil(
            `${Rx.BANK.ADD_BANK_ACCOUNT}/${bankId}`,
            'POST',
            data,
            {
                Authorization: token
            },
            () => {
                setIsShowForm(false);
                setBankAccountForm({});
                setIsShowSpinner(false);
                ToastHelpers.renderToast('Success', 'success');
                getListBankAccountByUserAPI();
            },
            () => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast('Fail', 'error');
            },
            () => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast('Fail', 'error');
            }
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

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderListBankAccount = () => (
        <Block
            flex={4}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <Block
                    style={{
                        alignSelf: 'center',
                        marginTop: 10
                    }}
                >
                    {listBankAccount.map((bankAccountItem) => (
                        <>
                            {renderBankAccountItem(bankAccountItem)}
                        </>
                    ))}
                </Block>
                {!isShowForm ? (
                    <>
                        {renderButtonAddBankAccount()}
                    </>
                ) : (
                    <></>
                )}
            </ScrollView>
        </Block>
    );

    const renderButtonAddBankAccount = () => (
        <Block
            style={{
                marginTop: 10
            }}
        >
            <Button
                color={NowTheme.COLORS.BLOCK}
                fontSize={NowTheme.SIZES.FONT_BUTTON_TITLE}
                style={{
                    width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                    alignSelf: 'center'
                }}
                onPress={() => setIsShowForm(true)}
                textStyle={{
                    color: NowTheme.COLORS.ACTIVE
                }}
                shadowless
            >
                Thêm tài khoản ngân hàng
            </Button>
        </Block>
    );

    const reverse = (s) => s.split('').reverse().join('');

    const renderBankAccountItem = (bankAccountItem) => {
        const {
            bankNum,
            bank: {
                codeName,
                url
            },
            ownerName
        } = bankAccountItem;

        const reverseString = reverse(bankNum);
        const label = `${codeName} - ${reverseString.substring(0, 4)} - ${ownerName}`;
        return (
            <TouchableWithoutFeedback key={bankAccountItem.id}>
                <>
                    <Block
                        row
                        style={{
                            alignItems: 'center',
                            marginVertical: 5,
                            width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                        }}
                    >
                        <Block
                            middle
                            style={{
                                width: NowTheme.SIZES.WIDTH_BASE * 0.13,
                                height: NowTheme.SIZES.WIDTH_BASE * 0.1,
                                borderWidth: 0.5,
                                borderColor: NowTheme.COLORS.ACTIVE,
                                borderRadius: 5,
                                marginRight: 10
                            }}
                        >
                            <ImageScalable
                                source={{ uri: url }}
                                width={30}
                            />
                        </Block>
                        <Block
                            width={NowTheme.SIZES.WIDTH_BASE * 0.8}
                        >
                            <Text
                                style={{
                                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                                }}
                                size={NowTheme.SIZES.FONT_INFO}
                                color={NowTheme.COLORS.ACTIVE}
                            >
                                {label}
                            </Text>
                        </Block>
                    </Block>
                </>
            </TouchableWithoutFeedback>
        );
    };

    const renderForm = () => {
        const {
            ownerName,
            bankNum
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
            <Block
                flex={6}
                style={{
                    backgroundColor: NowTheme.COLORS.BASE,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <Block>
                        <DropDownPicker
                            items={listBankFinal}
                            containerStyle={{
                                borderRadius: 5,
                                width: NowTheme.SIZES.WIDTH_90,
                                alignSelf: 'center',
                                marginVertical: 5,
                                marginTop: 15,
                                height: 60,
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
                            onChangeItem={(item) => onChangeBankId(item.value)}
                            labelStyle={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                            }}
                            placeholder="Chọn ngân hàng..."
                            searchable
                            searchablePlaceholder="Tìm kiếm..."
                            searchablePlaceholderTextColor={NowTheme.COLORS.MUTED}
                            searchableError={() => <Text>Not Found</Text>}
                        />
                        <Input
                            style={{
                                borderRadius: 5,
                                width: NowTheme.SIZES.WIDTH_90,
                                alignSelf: 'center',
                                height: 60,
                            }}
                            color={NowTheme.COLORS.HEADER}
                            value={bankNum}
                            onChangeText={(input) => onChangeBankNumber(input)}
                            size={24}
                            keyboardType="number-pad"
                            placeholder="Nhập số tài khoản..."
                            textInputStyle={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                fontSize: 16
                            }}
                        />

                        <Input
                            color={NowTheme.COLORS.HEADER}
                            style={{
                                borderRadius: 5,
                                width: NowTheme.SIZES.WIDTH_90,
                                alignSelf: 'center',
                                height: 60,
                            }}
                            size={24}
                            value={ownerName}
                            onChangeText={(input) => onChangeBankHolder(input)}
                            placeholder="Nhập tên chủ tài khoản..."
                            textInputStyle={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                fontSize: 16
                            }}
                        />
                    </Block>
                    <Block
                        center
                    >
                        <Button
                            style={{
                                width: NowTheme.SIZES.WIDTH_90,
                                marginVertical: 5
                            }}
                            onPress={() => onSubmitCreateBankAccount()}
                            shadowless
                        >
                            Xác nhận
                        </Button>
                        <Button
                            style={{
                                width: NowTheme.SIZES.WIDTH_90,
                                marginBottom: 10
                            }}
                            shadowless
                            onPress={() => {
                                setIsShowForm(false);
                                setBankAccountForm({});
                            }}
                            color={NowTheme.COLORS.DEFAULT}
                        >
                            Huỷ bỏ
                        </Button>
                    </Block>
                </ScrollView>
            </Block>
        );
    };

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader size="large" />
                ) : (
                    <Block
                        flex
                    >
                        {renderListBankAccount()}

                        {isShowForm ? (
                            <>
                                {renderForm()}
                            </>
                        ) : (
                            <></>
                        )}

                    </Block>
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
