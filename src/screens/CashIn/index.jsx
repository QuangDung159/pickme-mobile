import {
    CustomButton,
    CustomModal, IconCustom, NoteText, TouchableText
} from '@components/uiComponents';
import {
    IconFamily, Images, ScreenName, Theme
} from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import ImageScalable from 'react-native-scalable-image';
import { useSelector } from 'react-redux';

const {
    SIZES,
    COLORS,
    FONT: { TEXT_BOLD }
} = Theme;

export default function CashIn(props) {
    const { navigation } = props;
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);
    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const [modalVisible, setModalVisible] = useState(false);

    const copyToClipboard = (content) => {
        Clipboard.setString(content);
        ToastHelpers.renderToast('Đã lưu vào khay nhớ tạm.', 'success');
    };

    const moneyTransferContent = `${currentUser.userName} - 2SeeYou`;

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

    const renderModalGuide = () => (
        <CustomModal
            modalVisible={modalVisible}
            renderContent={() => (
                <View>
                    <ImageScalable
                        source={Images.BankTransfer}
                        style={{
                            zIndex: 99
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />

                    <View>
                        <CustomButton
                            onPress={() => setModalVisible(false)}
                            buttonStyle={{ width: SIZES.WIDTH_BASE * 0.8 }}
                            type="active"
                            label="Đã hiểu"
                        />
                    </View>
                </View>
            )}
        />
    );

    try {
        return (
            <ScrollView
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
                        <TouchableOpacity
                            onPress={() => copyToClipboard('01860423701')}
                        >
                            <NoteText
                                width={SIZES.WIDTH_BASE * 0.9}
                                title="Số tài khoản: "
                                content="01860423701"
                                contentStyle={{
                                    fontSize: SIZES.FONT_H1,
                                    color: COLORS.ACTIVE,
                                    fontFamily: TEXT_BOLD,
                                    paddingVertical: 5,
                                }}
                                iconComponentRight={(
                                    <IconCustom
                                        name="copy"
                                        family={IconFamily.FONT_AWESOME}
                                        size={18}
                                        color={COLORS.ACTIVE}
                                        style={{
                                            marginTop: 2
                                        }}
                                    />
                                )}
                            />
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            marginTop: 10
                        }}
                    >
                        <NoteText
                            width={SIZES.WIDTH_BASE * 0.9}
                            title="Ngân hàng: "
                            content="TMCP Tiên Phong - TPBank"
                            contentStyle={{
                                fontSize: SIZES.FONT_H2,
                                paddingVertical: 5,
                                color: COLORS.ACTIVE,
                                textAlign: 'center'
                            }}
                        />
                    </View>

                    <View
                        style={{
                            marginTop: 10
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => copyToClipboard('Lư Quảng Dũng')}
                        >
                            <NoteText
                                width={SIZES.WIDTH_BASE * 0.9}
                                title="Người thụ hưởng/chủ tài khoản: "
                                content="Lư Quảng Dũng"
                                contentStyle={{
                                    fontSize: SIZES.FONT_H2,
                                    paddingVertical: 5,
                                    color: COLORS.ACTIVE,
                                }}
                                iconComponentRight={(
                                    <IconCustom
                                        name="copy"
                                        family={IconFamily.FONT_AWESOME}
                                        size={18}
                                        color={COLORS.ACTIVE}
                                        style={{
                                            marginTop: 2
                                        }}
                                    />
                                )}
                            />
                        </TouchableOpacity>

                    </View>

                    <View
                        style={{
                            marginTop: 10
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => copyToClipboard(moneyTransferContent)}
                        >
                            <NoteText
                                width={SIZES.WIDTH_BASE * 0.9}
                                title="Nội dung chuyển khoản: "
                                content="[Tên đăng nhập] - 2SeeYou"
                                contentStyle={{
                                    fontSize: SIZES.FONT_H2,
                                    paddingVertical: 5,
                                    color: COLORS.ACTIVE,
                                }}
                                iconComponentRight={(
                                    <IconCustom
                                        name="copy"
                                        family={IconFamily.FONT_AWESOME}
                                        size={18}
                                        color={COLORS.ACTIVE}
                                        style={{
                                            marginTop: 2
                                        }}
                                    />
                                )}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableText
                        style={{
                            color: COLORS.ACTIVE,
                            fontSize: SIZES.FONT_H3,
                            fontFamily: TEXT_BOLD,
                            marginTop: 10
                        }}
                        text="Ví dụ"
                        onPress={() => setModalVisible(true)}
                    />
                    <ImageScalable
                        source={Images.BankTransfer}
                        style={{
                            zIndex: 99
                        }}
                        width={SIZES.WIDTH_BASE * 0.9}
                    />
                </View>
                {renderModalGuide()}
            </ScrollView>
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
