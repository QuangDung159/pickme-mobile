import { NoteText } from '@components/uiComponents';
import { ScreenName, Theme } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import Clipboard from 'expo-clipboard';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';

const {
    SIZES,
    COLORS
} = Theme;

export default function CashIn(props) {
    const { navigation } = props;
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const copyToClipboard = (content) => {
        Clipboard.setString(content);
        ToastHelpers.renderToast('Đã lưu vào khay nhớ tạm.', 'success');
    };

    const moneyTransferContent = '[Số điện thoại] - pickme';

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
                        <View
                            style={{
                                marginTop: 10
                            }}
                        >
                            <TouchableWithoutFeedback
                                onPress={() => copyToClipboard('0186xxxxxxxxx')}
                            >
                                <NoteText
                                    width={SIZES.WIDTH_BASE * 0.9}
                                    title="Số tài khoản: "
                                    content="0186xxxxxxxxx"
                                    contentStyle={{
                                        fontSize: SIZES.FONT_H1 - 5,
                                        color: COLORS.ACTIVE,
                                        marginTop: 10,
                                        paddingVertical: 20
                                    }}
                                />
                            </TouchableWithoutFeedback>
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
                                    fontSize: SIZES.FONT_H1 - 5,
                                    color: COLORS.ACTIVE,
                                    marginTop: 10,
                                    paddingVertical: 20
                                }}
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
                                        fontSize: SIZES.FONT_H1 - 5,
                                        color: COLORS.ACTIVE,
                                        marginTop: 10,
                                        paddingVertical: 20
                                    }}
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
