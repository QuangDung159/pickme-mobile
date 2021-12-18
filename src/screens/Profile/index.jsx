/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import UserDetail from '@components/businessComponents/UserDetail';
import {
    CenterLoader, CustomButton
} from '@components/uiComponents';
import { ScreenName, Theme } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import { BookingServices } from '@services/index';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

const {
    SIZES,
    COLORS
} = Theme;

export default function Profile({ route, navigation }) {
    const [partnerInfo, setPartnerInfo] = useState({});
    const [isShowSpinner, setIsShowSpinner] = useState(true);

    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);
    const currentUser = useSelector((state) => state.userReducer.currentUser);

    useEffect(
        () => {
            getPartnerInfo();
        }, [route?.params?.userId]
    );

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

    const getPartnerInfo = async () => {
        const {
            params: {
                userId
            }
        } = route;

        const result = await BookingServices.fetchPartnerInfoAsync(userId);
        const { data } = result;

        if (data) {
            setIsShowSpinner(false);
            setPartnerInfo(data.data);
        }
        setIsShowSpinner(false);
    };

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <UserDetail
                        navigation={navigation}
                        userInfo={partnerInfo}
                        setIsShowSpinner={(showSpinner) => setIsShowSpinner(showSpinner)}
                    />
                )}
                {currentUser.id !== route.params.userId && partnerInfo.isPartnerVerified && (
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: SIZES.WIDTH_BASE * 0.9,
                            alignSelf: 'center',
                            position: 'absolute',
                            bottom: 10
                        }}
                    >
                        <CustomButton
                            onPress={() => {
                                navigation.navigate(ScreenName.MESSAGE, {
                                    name: partnerInfo.fullName,
                                    userStatus: 'Vừa mới truy cập',
                                    toUserId: partnerInfo.id,
                                    userInfo: partnerInfo
                                });
                            }}
                            type="default"
                            label="Nhắn tin"
                            buttonStyle={{
                                backgroundColor: COLORS.BASE
                            }}
                        />
                        <CustomButton
                            onPress={() => {
                                navigation.navigate(ScreenName.CREATE_BOOKING, {
                                    partner: partnerInfo,
                                    from: ScreenName.PROFILE
                                });
                            }}
                            type="active"
                            label="Đặt hẹn"
                        />
                    </View>
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

Profile.propTypes = {
    route: PropTypes.object,
};

Profile.defaultProps = {
    route: {}
};
