import { Line, NoteText } from '@components/uiComponents';
import { NowTheme, ScreenName } from '@constants';
import { ToastHelpers } from '@helpers';
import { setPersonTabActiveIndex } from '@redux/Actions';
import Clipboard from 'expo-clipboard';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';

const {
    FONT: {
        MONTSERRAT_REGULAR,
    },
    SIZES,
    COLORS
} = NowTheme;

export default function CashIn(props) {
    const { navigation } = props;
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

    const copyToClipboard = (content) => {
        Clipboard.setString(content);
        ToastHelpers.renderToast('Đã lưu vào khay nhớ tạm.', 'success');
    };

    const moneyTransferContent = 'Số điện thoại - pickme';

    useEffect(
        () => {
            if (isSignInOtherDeviceStore) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: ScreenName.SIGN_IN_WITH_OTP }],
                });
            }
        }, [isSignInOtherDeviceStore]
    );

    try {
        return (
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.9,
                        alignSelf: 'center',
                    }}
                >
                    <View
                        style={{
                            marginVertical: 10,
                            backgroundColor: COLORS.BASE,
                        }}
                    >
                        <View>
                            <View
                                style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: MONTSERRAT_REGULAR,
                                        marginVertical: 10
                                    }}
                                >
                                    THÔNG TIN CHUYỂN KHOẢN
                                </Text>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        navigation.navigate(ScreenName.PERSONAL);
                                        dispatch(setPersonTabActiveIndex(1));
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: MONTSERRAT_REGULAR,
                                            fontSize: SIZES.FONT_H4,
                                            color: COLORS.ACTIVE
                                        }}
                                    >
                                        Xem rương
                                    </Text>
                                </TouchableWithoutFeedback>
                            </View>
                            <Line
                                borderWidth={0.5}
                                borderColor={COLORS.ACTIVE}
                            />
                        </View>

                        <View
                            style={{
                                marginTop: 10
                            }}
                        >
                            <NoteText
                                width={SIZES.WIDTH_BASE * 0.9}
                                title="Số tài khoản: "
                                // content="0186xxxxxxxxx"
                                contentStyle={{
                                    fontSize: 22,
                                    color: COLORS.ACTIVE
                                }}
                                backgroundColor={COLORS.LIST_ITEM_BACKGROUND_2}
                            />
                        </View>

                        <View
                            style={{
                                marginTop: 10
                            }}
                        >
                            <NoteText
                                width={SIZES.WIDTH_BASE * 0.9}
                                title="Ngân hàng: "
                                content="Tienphong Bank - TPBank"
                                contentStyle={{
                                    fontSize: 18,
                                    color: COLORS.ACTIVE
                                }}
                                backgroundColor={COLORS.LIST_ITEM_BACKGROUND_2}
                            />
                        </View>

                        <View
                            style={{
                                marginTop: 10
                            }}
                        >
                            <TouchableWithoutFeedback
                                onPress={() => copyToClipboard(moneyTransferContent)}
                            >
                                <NoteText
                                    width={SIZES.WIDTH_BASE * 0.9}
                                    title="Nội dung chuyển khoản:"
                                    content={moneyTransferContent}
                                    contentStyle={{
                                        fontSize: 18,
                                        color: COLORS.ACTIVE
                                    }}
                                    backgroundColor={COLORS.LIST_ITEM_BACKGROUND_2}
                                />
                            </TouchableWithoutFeedback>

                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
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
