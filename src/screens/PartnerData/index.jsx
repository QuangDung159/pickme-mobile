import {
    CenterLoader, CustomButton, CustomInput
} from '@components/uiComponents';
import { Theme } from '@constants/index';
import { CommonHelpers, ToastHelpers, ValidationHelpers } from '@helpers/index';
import { setCurrentUser, setPersonTabActiveIndex } from '@redux/Actions';
import { UserServices } from '@services/index';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';

const { SIZES, COLORS } = Theme;

export default function PartnerData() {
    const [newUser, setNewUser] = useState({});
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [amountDisplay, setAmountDisplay] = useState('0');

    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    useEffect(
        () => {
            setNewUser({
                ...currentUser,
                minimumDuration: currentUser.minimumDuration,
            });
            setAmountDisplay(CommonHelpers.formatCurrency(currentUser.earningExpected));
        }, []
    );

    const onChangeMinimumDuration = (durationInput) => {
        setNewUser({ ...newUser, minimumDuration: durationInput });
    };

    const onChangeEarningExpected = (input) => {
        setNewUser({ ...newUser, earningExpected: input });
        setAmountDisplay(input);
    };

    const renderEarningExpected = () => (
        <CustomInput
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            onChangeText={(input) => onChangeEarningExpected(input)}
            value={amountDisplay}
            label="Thu nhập mong muốn (VND/phút):"
            onEndEditing={
                (e) => {
                    setAmountDisplay(CommonHelpers.formatCurrency(e.nativeEvent.text));
                }
            }
            onFocus={() => {
                setAmountDisplay(newUser.earningExpected);
            }}
        />
    );

    const renderInputMinimumDuration = () => (
        <CustomInput
            value={newUser.minimumDuration}
            onChangeText={(minimumDuration) => onChangeMinimumDuration(minimumDuration)}
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            label="Số phút tối thiểu của buổi hẹn:"
        />
    );

    const renderButtonPanel = () => (
        <View
            style={{
                paddingTop: 10,
                paddingBottom: 20,
            }}
        >
            <CustomButton
                onPress={() => onSubmitUpdateInfo()}
                type="active"
                label="Xác nhận"
                buttonStyle={{
                    width: SIZES.WIDTH_BASE * 0.9
                }}
            />
        </View>
    );

    const validate = () => {
        const validateArr = [
            {
                fieldName: 'Thu nhập mong muốn (VND/phút)',
                input: newUser.earningExpected,
                validate: {
                    required: {
                        value: true,
                    },
                    equalGreaterThan: {
                        value: 1
                    }
                }
            },
            {
                fieldName: 'Số phút tối thiểu của buổi hẹn',
                input: newUser.minimumDuration,
                validate: {
                    required: {
                        value: true,
                    },
                    equalGreaterThan: {
                        value: 90
                    }
                }
            },
        ];

        if (!validateYearsOld(newUser.dob)) {
            ToastHelpers.renderToast('Bạn phải đủ 16 tuổi!', 'error');
            return false;
        }

        return ValidationHelpers.validate(validateArr);
    };

    const validateYearsOld = (dob) => {
        const dateString = moment(dob).format('YYYY-MM-DD');
        const years = moment().diff(dateString, 'years');

        return !(years < 16);
    };

    const onSubmitUpdateInfo = async () => {
        const {
            minimumDuration,
            earningExpected
        } = newUser;

        if (!validate()) {
            return;
        }

        const body = {
            imageUrl: currentUser.url,
            minimumDuration: +minimumDuration,
            earningExpected: +earningExpected,
        };

        setIsShowSpinner(true);

        const result = await UserServices.submitUpdatePartnerInfoAsync(body);
        const { data } = result;

        if (data) {
            const userInfo = {
                ...currentUser,
                minimumDuration,
                earningExpected
            };
            dispatch(setCurrentUser(userInfo));
            dispatch(setPersonTabActiveIndex(0));
            setNewUser(userInfo);
            ToastHelpers.renderToast(data.message, 'success');
        }
        setIsShowSpinner(false);
    };

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            backgroundColor: COLORS.BASE,
                            alignItems: 'center',
                            width: SIZES.WIDTH_BASE,
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                    >
                        {newUser && (
                            <>
                                {renderEarningExpected()}
                                {renderInputMinimumDuration()}
                                {renderButtonPanel()}
                            </>
                        )}
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
