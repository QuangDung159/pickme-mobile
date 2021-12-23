/* eslint-disable max-len */
import { CustomText } from '@components/uiComponents';
import { Theme, VerificationStatus } from '@constants/index';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

const {
    FONT: {
        TEXT_BOLD
    },
    COLORS,
    SIZES,
} = Theme;

export default function VerificationStatusPanel() {
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const verificationStore = useSelector((state) => state.userReducer.verificationStore);

    const renderStatusInfo = () => {
        switch (currentUser?.verifyStatus) {
            case VerificationStatus.NONE: {
                return (
                    <>
                        <CustomText
                            style={{
                                fontFamily: TEXT_BOLD,
                                fontSize: SIZES.FONT_H5
                            }}
                            text="Tài khoản của bạn chưa được xác thực:"
                        />
                        <CustomText
                            style={{
                                marginTop: 5,
                                fontSize: SIZES.FONT_H5
                            }}
                            text={'Tài khoản chưa được xác thực sẽ bị hạn chế một số chức năng.\nVui lòng nhấp vào đây để hoàn tất quá trình xác thực tài khoản.'}
                        />
                    </>
                );
            }
            case VerificationStatus.REJECT: {
                return (
                    <>
                        <CustomText
                            style={{
                                fontFamily: TEXT_BOLD,
                                fontSize: SIZES.FONT_H5
                            }}
                            text="Tài khoản của bạn chưa được xác thực:"
                        />
                        <CustomText
                            text={'Tài khoản chưa được xác thực sẽ bị hạn chế một số chức năng.\nVui lòng nhấp vào đây để hoàn tất quá trình xác thực tài khoản.'}
                            style={{
                                marginTop: 5,
                                fontSize: SIZES.FONT_H5
                            }}
                        />
                    </>
                );
            }
            case VerificationStatus.IN_PROCESS: {
                return (
                    <>
                        <CustomText
                            text={`Quá trình ${verificationStore?.verifyNote.toUpperCase()} đang được tiến hành`}
                            style={{
                                fontFamily: TEXT_BOLD,
                                fontSize: SIZES.FONT_H5
                            }}
                        />
                        <CustomText
                            text="Quá trình này sẽ mất một khoảng thời gian, chúng tôi sẽ sớm có thông báo về tình trạng tài khoản của bạn."
                            style={{
                                fontSize: SIZES.FONT_H5
                            }}
                        />
                    </>
                );
            }
            default: {
                return (
                    <></>
                );
            }
        }
    };

    return (
        <>
            {currentUser?.verifyStatus !== VerificationStatus.ACCEPTED && (
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.9,
                        alignSelf: 'center',
                        borderWidth: 0.5,
                        borderColor: COLORS.ACTIVE,
                        borderRadius: 20,
                        marginTop: 5
                    }}
                >
                    <View
                        style={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.8,
                            alignSelf: 'center'
                        }}
                    >
                        {renderStatusInfo()}
                    </View>
                </View>
            )}
        </>

    );
}
