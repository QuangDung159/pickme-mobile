import Clipboard from 'expo-clipboard';
import { Block, Text } from 'galio-framework';
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { IconCustom, Line, NoteText } from '../components/uiComponents';
import { IconFamily, NowTheme, ScreenName } from '../constants';
import { ToastHelpers } from '../helpers';

export default function CashIn(props) {
    const { navigation } = props;

    const copyToClipboard = (content) => {
        Clipboard.setString(content);
        ToastHelpers.renderToast('Đã lưu vào khay nhớ tạm.', 'success');
    };

    const moneyTransferContent = 'Số điện thoại - pickme';

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
                                <Block>
                                    <TouchableWithoutFeedback onPress={() => {
                                        navigation.navigate(ScreenName.PERSONAL, {
                                            tabActiveIndex: 1
                                        });
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
                                marginTop: 10
                            }}
                        >
                            <NoteText
                                width={NowTheme.SIZES.WIDTH_BASE * 0.95}
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
                                width={NowTheme.SIZES.WIDTH_BASE * 0.95}
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
                                    width={NowTheme.SIZES.WIDTH_BASE * 0.95}
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
                                width={NowTheme.SIZES.WIDTH_BASE * 0.95}
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
