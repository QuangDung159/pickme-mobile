/* eslint-disable max-len */
import React from 'react';
import { useSelector } from 'react-redux';
import { IconCustom, NoteText } from '../../../components/uiComponents';
import { IconFamily, NowTheme, VerificationStatus } from '../../../constants';

export default function VerificationStatusPanel() {
    const currentUser = useSelector((state) => state.userReducer.currentUser);

    switch (currentUser.verifyStatus) {
        case VerificationStatus.NONE: {
            return (
                <NoteText
                    width={NowTheme.SIZES.WIDTH_BASE * 0.9}
                    title="Tài khoản của bạn chưa được xác thực:"
                    content={'Tài khoản chưa được xác thực sẽ bị hạn chế một số chức năng.\nVui lòng nhấp vào đây để hoàn tất quá trình xác thực tài khoản.'}
                    contentStyle={{
                        fontSize: NowTheme.SIZES.FONT_H4,
                        color: NowTheme.COLORS.ACTIVE,
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        marginTop: 5
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
            );
        }
        case VerificationStatus.REJECT: {
            return (
                <NoteText
                    width={NowTheme.SIZES.WIDTH_BASE * 0.9}
                    title="Tài khoản của bạn chưa được xác thực:"
                    content={'Tài khoản chưa được xác thực sẽ bị hạn chế một số chức năng.\nVui lòng nhấp vào đây để hoàn tất quá trình xác thực tài khoản.'}
                    contentStyle={{
                        fontSize: NowTheme.SIZES.FONT_H4,
                        color: NowTheme.COLORS.ACTIVE,
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        marginTop: 5
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
            );
        }
        case VerificationStatus.IN_PROCESS: {
            return (
                <NoteText
                    width={NowTheme.SIZES.WIDTH_BASE * 0.9}
                    title="Quá trình xác thực đang được tiến hành"
                    content="Quá trình này sẽ mất một khoảng thời gian, chúng tôi sẽ sớm có thông báo về tình trạng tài khoản của bạn."
                    contentStyle={{
                        fontSize: NowTheme.SIZES.FONT_H4,
                        color: NowTheme.COLORS.ACTIVE,
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        marginTop: 5
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
            );
        }
        default: {
            return (
                <></>
            );
        }
    }
}
