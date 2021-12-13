import {
    CenterLoader, CustomButton, CustomCheckbox, CustomInput, CustomText
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

const {
    SIZES, COLORS, FONT: {
        TEXT_BOLD
    }
} = Theme;

export default function PartnerData() {
    const [newUser, setNewUser] = useState({});
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [amountDisplay, setAmountDisplay] = useState('');
    const [amountDisplayOnline, setAmountDisplayOnline] = useState('');
    const [isOnline, setIsOnline] = useState(false);
    const [isOffline, setIsOffline] = useState(true);

    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    useEffect(
        () => {
            setNewUser({
                ...currentUser,
                minimumDuration: currentUser.minimumDuration,
                onlineMinimumDuration: currentUser.onlineMinimumDuration,
            });
            setAmountDisplay(CommonHelpers.formatCurrency(currentUser.earningExpected));
            setAmountDisplayOnline(CommonHelpers.formatCurrency(currentUser.onlineEarningExpected));
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
            label="Thu nhập mong muốn (UCoin/phút):*"
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
            label="Số phút tối thiểu của buổi hẹn:*"
        />
    );

    const renderEarningExpectedOnline = () => (
        <CustomInput
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            onChangeText={(input) => {
                setNewUser({ ...newUser, onlineEarningExpected: input });
                setAmountDisplayOnline(input);
            }}
            value={amountDisplayOnline}
            label="Thu nhập mong muốn (online) (UCoin/phút):*"
            onEndEditing={
                (e) => {
                    setAmountDisplayOnline(CommonHelpers.formatCurrency(e.nativeEvent.text));
                }
            }
            onFocus={() => {
                setAmountDisplayOnline(newUser.onlineEarningExpected);
            }}
        />
    );

    const renderInputMinimumDurationOnline = () => (
        <CustomInput
            value={newUser.onlineMinimumDuration}
            onChangeText={(input) => setNewUser({ ...newUser, onlineMinimumDuration: input })}
            containerStyle={{
                marginVertical: 10,
                width: SIZES.WIDTH_BASE * 0.9
            }}
            label="Số phút tối thiểu của buổi hẹn (online):*"
        />
    );

    const renderGetBookingType = () => (
        <View
            style={{
                width: SIZES.WIDTH_BASE * 0.9,
                marginBottom: 5
            }}
        >
            <CustomText
                style={{
                    color: COLORS.ACTIVE,
                    marginVertical: 5,
                }}
                text="Hình thức buổi hẹn:"
            />
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
            >
                <CustomCheckbox
                    label="Trực tiếp"
                    onChange={(checked) => {
                        setIsOffline(checked);
                    }}
                    containerStyle={{
                        width: SIZES.WIDTH_BASE * 0.3,
                    }}
                    labelStyle={{
                        fontFamily: TEXT_BOLD
                    }}
                    isChecked={isOffline}
                />
                <CustomCheckbox
                    label="Online"
                    onChange={(checked) => {
                        setIsOnline(checked);
                    }}
                    containerStyle={{
                        width: SIZES.WIDTH_BASE * 0.3
                    }}
                    labelStyle={{
                        fontFamily: TEXT_BOLD
                    }}
                    isChecked={isOnline}
                />
            </View>

        </View>

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
        let validateArr = [];

        if (isOffline) {
            validateArr = [
                {
                    fieldName: 'Thu nhập mong muốn',
                    input: newUser.earningExpected,
                    validate: {
                        required: {
                            value: true,
                        },
                        equalGreaterThan: {
                            value: 600
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
                }
            ];
        }

        if (isOnline) {
            validateArr = validateArr.concat([
                {
                    fieldName: 'Thu nhập mong muốn (online)',
                    input: newUser.onlineEarningExpected,
                    validate: {
                        required: {
                            value: true,
                        },
                        equalGreaterThan: {
                            value: 600
                        }
                    }
                },
                {
                    fieldName: 'Số phút tối thiểu của buổi hẹn (online)',
                    input: newUser.onlineMinimumDuration,
                    validate: {
                        required: {
                            value: true,
                        },
                        equalGreaterThan: {
                            value: 30
                        }
                    }
                },
            ]);
        }

        if (!isOnline && !isOffline) {
            ToastHelpers.renderToast('Bạn vui lòng chọn hình thức buổi hẹn!', 'error');
            return false;
        }

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
            earningExpected,
            onlineEarningExpected,
            onlineMinimumDuration
        } = newUser;

        if (!validate()) {
            return;
        }

        const body = {
            imageUrl: currentUser.url,
            minimumDuration: +minimumDuration,
            earningExpected: +earningExpected,
            onlineMinimumDuration: +onlineMinimumDuration,
            onlineEarningExpected: +onlineEarningExpected,
            IsDatingOnline: isOnline,
            IsDatingOffline: isOffline
        };

        setIsShowSpinner(true);

        const result = await UserServices.submitUpdatePartnerInfoAsync(body);
        const { data } = result;

        if (data) {
            const userInfo = {
                ...currentUser,
                minimumDuration,
                earningExpected,
                onlineEarningExpected,
                onlineMinimumDuration
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
                                {renderGetBookingType()}

                                {isOffline && (
                                    <>
                                        {renderEarningExpected()}
                                        {renderInputMinimumDuration()}
                                    </>
                                )}

                                {isOnline && (
                                    <>
                                        {renderEarningExpectedOnline()}
                                        {renderInputMinimumDurationOnline()}
                                    </>
                                )}
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
