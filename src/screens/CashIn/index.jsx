import {
    CustomButton,
    CustomModal, IconCustom, NoteText, TouchableText
} from '@components/uiComponents';
import { BANK_NUMBER_2SEEYOU } from '@constants/Content';
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
                        width={SIZES.WIDTH_MAIN}
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
                    width: SIZES.WIDTH_MAIN,
                    alignSelf: 'center',
                }}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{
                        marginVertical: 10,
                        backgroundColor: COLORS.BASE,
                    }}
                >
                    <View
                        style={{
                            marginTop: 2
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => copyToClipboard(BANK_NUMBER_2SEEYOU)}
                        >
                            <NoteText
                                width={SIZES.WIDTH_MAIN}
                                title="Số tài khoản: "
                                content={BANK_NUMBER_2SEEYOU}
                                contentStyle={{
                                    fontSize: SIZES.FONT_H3,
                                    color: COLORS.ACTIVE,
                                    fontFamily: TEXT_BOLD,
                                }}
                                containerStyle={{
                                    height: 70
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
                            containerStyle={{
                                height: 70
                            }}
                            width={SIZES.WIDTH_MAIN}
                            title="Ngân hàng: "
                            content="TMCP Tiên Phong - TPBank"
                            contentStyle={{
                                fontSize: SIZES.FONT_H3,
                                color: COLORS.ACTIVE,
                                textAlign: 'center',
                                fontFamily: TEXT_BOLD,
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
                                width={SIZES.WIDTH_MAIN}
                                title="Người thụ hưởng: "
                                content="Lư Quảng Dũng"
                                contentStyle={{
                                    fontSize: SIZES.FONT_H3,
                                    color: COLORS.ACTIVE,
                                    fontFamily: TEXT_BOLD,
                                }}
                                containerStyle={{
                                    height: 70
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
                                width={SIZES.WIDTH_MAIN}
                                title="Nội dung chuyển khoản: "
                                content={moneyTransferContent}
                                contentStyle={{
                                    fontSize: SIZES.FONT_H3,
                                    color: COLORS.ACTIVE,
                                    fontFamily: TEXT_BOLD,
                                }}
                                containerStyle={{
                                    height: 70
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
                            marginTop: 10,
                        }}
                    >
                        <NoteText
                            width={SIZES.WIDTH_MAIN}
                            title="Giá trị quy đổi: "
                            content="1 VND = 1 Xu"
                            contentStyle={{
                                fontSize: SIZES.FONT_H3,
                                color: COLORS.ACTIVE,
                                fontFamily: TEXT_BOLD,
                            }}
                            containerStyle={{
                                height: 70
                            }}
                        />
                    </View>
                    <TouchableText
                        style={{
                            color: COLORS.ACTIVE,
                            fontSize: SIZES.FONT_H3,
                            fontFamily: TEXT_BOLD,
                            marginTop: 10
                        }}
                        text="Mẫu đơn chuyển khoản"
                        onPress={() => {}}
                    />
                    <ImageScalable
                        source={Images.BankTransfer}
                        style={{
                            marginTop: 5,
                            alignSelf: 'center',
                            borderWidth: 0.5,
                            borderColor: COLORS.ACTIVE,
                            borderRadius: 20
                        }}
                        width={SIZES.WIDTH_MAIN}
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
