import { UploadDocSection } from '@components/businessComponents';
import {
    CenterLoader
} from '@components/uiComponents';
import { ScreenName, Theme } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import React, { useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';

const {
    SIZES,
} = Theme;

export default function Verification({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);

    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

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
            <>
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            width: SIZES.WIDTH_BASE * 0.9,
                            alignSelf: 'center'
                        }}
                    >
                        <UploadDocSection
                            setIsShowSpinner={(isShow) => setIsShowSpinner(isShow)}
                            navigation={navigation}
                        />
                    </KeyboardAwareScrollView>
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
