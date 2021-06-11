import Clipboard from 'expo-clipboard';
import { Block, Text } from 'galio-framework';
import React, { useEffect } from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { IconCustom, Line, NoteText } from '../../components/uiComponents';
import { IconFamily, NowTheme, ScreenName } from '../../constants';
import { ToastHelpers } from '../../helpers';
import { setPersonTabActiveIndex } from '../../redux/Actions';

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
                                    THÔNG TIN CHUYỂN KHOẢN
                                </Text>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        navigation.navigate(ScreenName.PERSONAL);
                                        dispatch(setPersonTabActiveIndex(1));
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                        fontSize: NowTheme.SIZES.FONT_H4,
                                        color: NowTheme.COLORS.ACTIVE
                                    }}
                                    >
                                        Xem rương
                                    </Text>
                                </TouchableWithoutFeedback>
                            </Block>
                            <Line
                                borderWidth={0.5}
                                borderColor={NowTheme.COLORS.ACTIVE}
                            />
                        </Block>

                        <Block
                            style={{
                                marginTop: 10
                            }}
                        >
                            <NoteText
                                width={NowTheme.SIZES.WIDTH_BASE * 0.9}
                                title="Số tài khoản: "
                                // content="0186xxxxxxxxx"
                                contentStyle={{
                                    fontSize: 22,
                                    color: NowTheme.COLORS.ACTIVE
                                }}
                                backgroundColor={NowTheme.COLORS.LIST_ITEM_BACKGROUND_2}
                            />
                        </Block>

                        <Block
                            style={{
                                marginTop: 10
                            }}
                        >
                            <NoteText
                                width={NowTheme.SIZES.WIDTH_BASE * 0.9}
                                title="Ngân hàng: "
                                content="Tienphong Bank - TPBank"
                                contentStyle={{
                                    fontSize: 18,
                                    color: NowTheme.COLORS.ACTIVE
                                }}
                                backgroundColor={NowTheme.COLORS.LIST_ITEM_BACKGROUND_2}
                            />
                        </Block>

                        <Block
                            style={{
                                marginTop: 10
                            }}
                        >
                            <TouchableWithoutFeedback
                                onPress={() => copyToClipboard(moneyTransferContent)}
                            >
                                <NoteText
                                    width={NowTheme.SIZES.WIDTH_BASE * 0.9}
                                    title="Nội dung chuyển khoản:"
                                    content={moneyTransferContent}
                                    contentStyle={{
                                        fontSize: 18,
                                        color: NowTheme.COLORS.ACTIVE
                                    }}
                                    backgroundColor={NowTheme.COLORS.LIST_ITEM_BACKGROUND_2}
                                />
                            </TouchableWithoutFeedback>

                        </Block>

                        <Block
                            style={{
                                marginVertical: 10
                            }}
                        >
                            <NoteText
                                width={NowTheme.SIZES.WIDTH_BASE * 0.9}
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
                        </Block>
                    </Block>
                </Block>
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
