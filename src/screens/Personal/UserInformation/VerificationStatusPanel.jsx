/* eslint-disable max-len */
import { Theme, VerificationStatus } from '@constants/index';
import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function VerificationStatusPanel() {
    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const renderStatusInfo = () => {
        switch (currentUser.verifyStatus) {
            case VerificationStatus.NONE: {
                return (
                    <>
                        <View
                            style={{
                                width: SIZES.WIDTH_BASE * 0.9,
                                alignSelf: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    color: COLORS.DEFAULT,
                                    fontFamily: TEXT_BOLD,
                                    fontSize: SIZES.FONT_H3,
                                }}
                            >
                                Tài khoản của bạn chưa được xác thực
                            </Text>
                            <Text
                                style={{
                                    color: COLORS.ACTIVE,
                                    fontFamily: TEXT_REGULAR,
                                    fontSize: SIZES.FONT_H3,
                                    marginTop: 10
                                }}
                            >
                                {'Tài khoản chưa được xác thực sẽ bị hạn chế một số chức năng.\nVui lòng nhấp vào đây để hoàn tất quá trình xác thực tài khoản.'}
                            </Text>
                        </View>
                    </>
                );
            }
            case VerificationStatus.REJECT: {
                return (
                    <>
                        <View
                            style={{
                                width: SIZES.WIDTH_BASE * 0.9,
                                alignSelf: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    color: COLORS.DEFAULT,
                                    fontFamily: TEXT_BOLD,
                                    fontSize: SIZES.FONT_H3,
                                }}
                            >
                                Tài khoản của bạn chưa được xác thực
                            </Text>
                            <Text
                                style={{
                                    color: COLORS.ACTIVE,
                                    fontFamily: TEXT_REGULAR,
                                    fontSize: SIZES.FONT_H3,
                                    marginTop: 10
                                }}
                            >
                                {'Tài khoản chưa được xác thực sẽ bị hạn chế một số chức năng.\nVui lòng nhấp vào đây để hoàn tất quá trình xác thực tài khoản.'}
                            </Text>
                        </View>
                    </>
                );
            }
            case VerificationStatus.IN_PROCESS: {
                return (
                    <>
                        <View
                            style={{
                                width: SIZES.WIDTH_BASE * 0.9,
                                alignSelf: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    color: COLORS.DEFAULT,
                                    fontFamily: TEXT_BOLD,
                                    fontSize: SIZES.FONT_H3,
                                }}
                            >
                                Quá trình xác thực đang được tiến hành
                            </Text>
                            <Text
                                style={{
                                    color: COLORS.ACTIVE,
                                    fontFamily: TEXT_REGULAR,
                                    fontSize: SIZES.FONT_H3,
                                    marginTop: 10
                                }}
                            >
                                Quá trình này sẽ mất một khoảng thời gian, chúng tôi sẽ sớm có thông báo về tình trạng tài khoản của bạn.
                            </Text>
                        </View>
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
        <View
            style={{
                marginVertical: 20
            }}
        >
            {renderStatusInfo()}
        </View>
    );
}
