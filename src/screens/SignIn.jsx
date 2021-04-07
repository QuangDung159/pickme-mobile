import {
    Block, Button, Text
} from 'galio-framework';
import React, { useState } from 'react';
import {
    ActivityIndicator, ImageBackground,
    StyleSheet
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { ExpoNotification } from '../components/bussinessComponents';
import { Input } from '../components/uiComponents';
import {
    Images, NowTheme, Rx, ScreenName
} from '../constants';
import { ToastHelpers } from '../helpers';
import {
    setCurrentUser,
    setToken
} from '../redux/Actions';
import { rxUtil } from '../utils';

export default function SignIn({ navigation }) {
    const [username, setUsername] = useState('huyvd');
    const [password, setPassword] = useState('0000');
    const [isShowSpinner, setIsShowSpinner] = useState(false);

    const expoToken = useSelector((state) => state.appConfigReducer.expoToken);

    const dispatch = useDispatch();

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const onChangeUsername = (usernameInput) => {
        setUsername(usernameInput);
    };

    const onChangePassword = (passwordInput) => {
        setPassword(passwordInput);
    };

    const updateExpoTokenToServer = (bearerToken) => {
        rxUtil(
            Rx.USER.UPDATE_EXPO_TOKEN,
            'POST',
            {
                token: expoToken
            },
            {
                Authorization: bearerToken,
            },
            (res) => {
                console.log('res :>> ', res);
            }
        );
    };

    const onSubmitLogin = () => {
        if (validation()) {
            const data = {
                username,
                password
            };

            toggleSpinner(true);
            rxUtil(
                Rx.AUTHENTICATION.LOGIN,
                'POST',
                data,
                {},
                (res) => {
                    onLoginSucess(res.data.data);
                },
                () => {
                    toggleSpinner(false);
                    Toast.show({
                        type: 'error',
                        text1: 'Lỗi hệ thống! Vui lòng thử lại.'
                    });
                },
                () => {
                    toggleSpinner(false);
                    Toast.show({
                        type: 'error',
                        text1: 'Lỗi hệ thống! Vui lòng thử lại.'
                    });
                }
            );
        }
    };

    const validation = () => {
        if (!username) {
            ToastHelpers.renderToast('Tên đăng nhập không hợp lệ!', 'error');
            return false;
        }

        if (!password) {
            ToastHelpers.renderToast('Mật khẩu không hợp lệ!', 'error');
            return false;
        }

        return true;
    };

    const onGetCurrentUserData = (url, bearerToken) => {
        const headers = {
            Authorization: bearerToken
        };

        rxUtil(url, 'GET', '', headers,
            (res) => {
                dispatch(setCurrentUser(res.data.data));
                toggleSpinner(false);
                navigation.reset({
                    index: 0,
                    routes: [{ name: ScreenName.APP }],
                });
            },
            () => {
                toggleSpinner(false);
                Toast.show({
                    type: 'error',
                    text1: 'Đăng nhập thất bại! Vui lòng thử lại.'
                });
            },
            () => {
                toggleSpinner(false);
                Toast.show({
                    type: 'error',
                    text1: 'Đăng nhập thất bại! Vui lòng thử lại.'
                });
            });
    };

    const onLoginSucess = (tokenFromAPI) => {
        const bearerToken = `Bearer ${tokenFromAPI}`;
        dispatch(setToken(tokenFromAPI));
        onGetCurrentUserData(
            Rx.USER.CURRENT_USER_INFO,
            bearerToken
        );
        updateExpoTokenToServer(bearerToken);
    };

    const toggleSpinner = (isShowSpinnerToggled) => {
        setIsShowSpinner(isShowSpinnerToggled);
    };

    return (
        <Block flex middle>
            <ExpoNotification navigation={navigation} />
            <ImageBackground
                source={Images.RegisterBackground}
                style={styles.imageBackgroundContainer}
                imageStyle={styles.imageBackground}
            >
                <KeyboardAwareScrollView>
                    <Block flex middle>
                        <Block style={styles.registerContainer}>
                            <Block
                                middle
                                style={{
                                    height: NowTheme.SIZES.HEIGHT_BASE * 0.3,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                                        textAlign: 'center'
                                    }}
                                    color="#333"
                                    size={24}
                                    height={100}
                                >
                                    Đăng nhập
                                </Text>
                            </Block>

                            {isShowSpinner ? (
                                <ActivityIndicator
                                    size="large"
                                    color={NowTheme.COLORS.ACTIVE}
                                />
                            ) : (
                                <>
                                    <Block style={{
                                        height: NowTheme.SIZES.HEIGHT_BASE * 0.3
                                    }}
                                    >
                                        <Block
                                            style={{
                                                marginBottom: 10,
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Input
                                                style={{
                                                    borderRadius: 5,
                                                    width: NowTheme.SIZES.WIDTH_BASE * 0.77,
                                                }}
                                                placeholder="Nhập tên đăng nhập..."
                                                value={username}
                                                onChangeText={
                                                    (usernameInput) => onChangeUsername(usernameInput)
                                                }
                                            />

                                            <Input
                                                placeholder="Nhập mật khẩu..."
                                                style={{
                                                    borderRadius: 5,
                                                    width: NowTheme.SIZES.WIDTH_BASE * 0.77
                                                }}
                                                password
                                                viewPass
                                                value={password}
                                                onChangeText={
                                                    (passwordInput) => onChangePassword(passwordInput)
                                                }
                                            />
                                        </Block>
                                    </Block>

                                    <Block center>
                                        <Button
                                            onPress={() => onSubmitLogin()}
                                            style={[styles.button, {
                                                marginVertical: 10
                                            }]}
                                            shadowless
                                        >
                                            Đăng nhập
                                        </Button>
                                    </Block>
                                </>
                            )}
                        </Block>
                    </Block>
                </KeyboardAwareScrollView>
            </ImageBackground>
        </Block>
    );
}

const styles = StyleSheet.create({
    imageBackgroundContainer: {
        width: NowTheme.SIZES.WIDTH_BASE,
        height: NowTheme.SIZES.HEIGHT_BASE,
        padding: 0,
        zIndex: 1
    },
    imageBackground: {
        width: NowTheme.SIZES.WIDTH_BASE,
        height: NowTheme.SIZES.HEIGHT_BASE
    },
    registerContainer: {
        marginTop: 55,
        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
        height: NowTheme.SIZES.HEIGHT_BASE < 812 ? NowTheme.SIZES.HEIGHT_BASE * 0.8 : NowTheme.SIZES.HEIGHT_BASE * 0.8,
        backgroundColor: NowTheme.COLORS.BASE,
        borderRadius: 4,
        shadowColor: NowTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1,
        overflow: 'hidden'
    },
    button: {
        width: NowTheme.SIZES.WIDTH_BASE * 0.77
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
    }
});
