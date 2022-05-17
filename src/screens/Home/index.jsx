/* eslint-disable no-unused-vars */
/* eslint no-underscore-dangle: ["error", { "allow": ["_isMounted", "_id"] }] */
import { LocationModal } from '@components/businessComponents';
import ListServiceDisplay from '@components/businessComponents/ListServiceDisplay';
import ProfileInfoItem from '@components/businessComponents/ProfileInfoItem';
import {
    CenterLoader, CustomText, IconCustom, Separator
} from '@components/uiComponents';
import { LOCATION } from '@constants/Common';
import { GENDER } from '@constants/Gender';
import {
    GraphQueryString, IconFamily, Images, ScreenName, Theme
} from '@constants/index';
import { CommonHelpers, ToastHelpers } from '@helpers/index';
import {
    setListBookingStore,
    setListConversation,
    setListNotification,
    setListPartnerHomeRedux,
    setNumberMessageUnread,
    setNumberNotificationUnread,
    setVerificationStore
} from '@redux/Actions';
import { BookingServices, NotificationServices, UserServices } from '@services/index';
import { socketRequestUtil } from '@utils/index';
import * as SecureStore from 'expo-secure-store';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View
} from 'react-native';
import ImageScalable from 'react-native-scalable-image';
import { useDispatch, useSelector } from 'react-redux';
import FilterModal from './FilterModal';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function Home({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [listConversationGetAtHome, setListConversationGetAtHome] = useState([]);

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const messageListened = useSelector((state) => state.messageReducer.messageListened);
    const numberMessageUnread = useSelector((state) => state.messageReducer.numberMessageUnread);
    const chattingWith = useSelector((state) => state.messageReducer.chattingWith);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);
    const listPartnerHomeRedux = useSelector((state) => state.bookingReducer.listPartnerHomeRedux);
    const [pageIndex, setPageIndex] = useState(1);
    const [modalFilterVisible, setModalFilterVisible] = useState(false);
    const [modalLocationVisible, setModalLocationVisible] = useState(false);
    const [hometownSelectedIndex, setHometownSelectedIndex] = useState(0);
    const [listPartnerFilter, setListPartnerFilter] = useState(listPartnerHomeRedux);
    const [listInterestFilter, setListInterestFilter] = useState([]);

    const dispatch = useDispatch();

    useEffect(
        () => {
            const onFocus = navigation.addListener('focus', () => {
                // checkForUpdate();
            });

            return onFocus;
        }, []
    );

    useEffect(
        () => {
            fetchListNotification();
            fetchListBooking();
            getListConversationFromSocket();
            fetchVerification();
            showAlertLocation();
            if (!listPartnerHomeRedux || listPartnerHomeRedux.length === 0) {
                setIsShowSpinner(true);
                getListPartner(pageIndex);
            }
        }, []
    );

    useEffect(
        () => {
            const intervalUpdateLatest = setIntervalToUpdateLastActiveOfUserStatus();
            return () => {
                clearInterval(intervalUpdateLatest);
            };
        }, []
    );

    useEffect(
        () => {
            const conversationPayLoad = getConversationByMessage(
                messageListened,
                listConversationGetAtHome
            );

            if (!conversationPayLoad) {
                return;
            }

            // in case user on chatting screen
            if (messageListened.from === chattingWith) {
                return;
            }

            const { conversation, indexInSource } = conversationPayLoad;

            if (conversation.isRead === true) {
                dispatch(setNumberMessageUnread(numberMessageUnread + 1));

                // re-assign recentlyMessage.isRead = false
                // to ignore increase numberOfUnreadMessage
                // in case next incoming message is belong to this conversation
                // because we don't refetch listRecentlyMessage from API
                const listConversationTemp = [...listConversationGetAtHome];
                listConversationTemp[indexInSource].isRead = false;
                setListConversationGetAtHome(listConversationTemp);
            }
        }, [messageListened]
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

    useEffect(
        () => {
            if (!modalFilterVisible) {
                getFilterFromLocal();
            }
        }, [modalFilterVisible, listPartnerHomeRedux]
    );

    // const checkForUpdate = async () => {
    //     if (await checkVersion()) {
    //         Alert.alert('Đã có bản cập nhật mới',
    //             'Vui lòng cập nhật ứng dụng để có trải nghiệm tốt nhất với 2SeeYou',
    //             [
    //                 {
    //                     text: 'Cập nhật',
    //                     onPress: () => {
    //                         Linking.openURL(OutsideApp.GOOGLE_PLAY_STORE.deepLink);
    //                     },
    //                 }
    //             ]);
    //     }
    // };

    const showAlertLocation = () => {
        let isValidLocation = false;
        LOCATION.forEach((item) => {
            if (item.value.toLowerCase() === currentUser.homeTown.toLowerCase()) {
                isValidLocation = true;
            }
        });

        if (!isValidLocation) {
            Alert.alert('Thông tin cá nhân',
                'Nơi ở hiện tại không hợp lệ, vui lòng cập nhật thông tin.',
                [
                    {
                        text: 'Đóng',
                        style: 'cancel'
                    },
                    {
                        text: 'Cập nhật',
                        onPress: () => {
                            navigation.navigate(ScreenName.UPDATE_INFO_ACCOUNT);
                        },
                    }
                ]);
        }
    };

    const getFilterFromLocal = async () => {
        let filterObjLocal = await SecureStore.getItemAsync('FILTER');
        const listGender = await SecureStore.getItemAsync('LIST_GENDER_FILTER');
        const listInterest = await SecureStore.getItemAsync('LIST_INTEREST_FILTER');

        if (filterObjLocal && listGender && listInterest) {
            filterObjLocal = JSON.parse(filterObjLocal);
            filterObjLocal.listGender = JSON.parse(listGender);
            filterObjLocal.listInterest = JSON.parse(listInterest);
        }

        console.log('filterObjLocal :>> ', filterObjLocal);

        handelHomepageByFilter(listPartnerHomeRedux, filterObjLocal);
    };

    const filterByGender = (listUser, filterObj) => {
        let result = listUser;
        let isMale = false;
        let isFemale = false;
        let isAll = false;
        const genderList = filterObj?.listGender || [];

        genderList.forEach((gender) => {
            if (gender.value === GENDER.male && gender.selected) {
                isMale = true;
            }

            if (gender.value === GENDER.female && gender.selected) {
                isFemale = true;
            }

            if (isMale && isFemale) {
                isAll = true;
            }
        });

        result = result.filter(
            (userItem) => {
                if (isAll) {
                    return userItem;
                }

                if (isMale) {
                    return userItem.isMale;
                }

                if (isFemale) {
                    return !userItem.isMale;
                }

                return userItem;
            }
        );

        return result;
    };

    const filterByAge = (listUser, filterObj) => {
        let result = listUser;
        result = result.filter((userItem) => {
            const dob = userItem.dob.slice(0, 4);
            const age = calculateAge(+dob);
            return age >= +filterObj.ageFrom && age <= +filterObj.ageTo;
        });

        return result;
    };

    const filterByEstimatePricing = (listUser, filterObj) => listUser.filter(
        (userItem) => userItem.estimatePricing >= +filterObj.feeFrom && userItem.estimatePricing <= +filterObj.feeTo
    );

    const filterByInterest = (listUser, filterObj) => {
        let haveInterestSelected = false;
        let result = listUser;
        const list = [];

        result.forEach((userItem) => {
            filterObj.listInterest.forEach((interest) => {
                if (interest.selected) {
                    haveInterestSelected = true;
                    if (userItem.interests.toLowerCase().includes(interest.value.toLowerCase())) {
                        if (!getUserById(list, userItem.id)) {
                            list.push(userItem);
                        }
                    }
                }
            });
        });

        if (haveInterestSelected) {
            result = list;
        }

        return result;
    };

    const filterByLocation = (listUser, filterObj) => {
        if (filterObj.from === 0 || filterObj.from === 1 || filterObj.from === 65) {
            return listUser;
        }

        let result = listUser;
        const locationByIndex = LOCATION[filterObj.from];

        result = result.filter((userItem) => userItem.homeTown.toLowerCase() === locationByIndex.value.toLowerCase());
        return result;
    };

    const handelHomepageByFilter = (listUser, filterObj) => {
        let result = listUser;

        if (!listUser || !filterObj) {
            return;
        }

        result = filterByGender(result, filterObj);
        result = filterByLocation(result, filterObj);
        result = filterByAge(result, filterObj);
        result = filterByEstimatePricing(result, filterObj);
        result = filterByInterest(result, filterObj);

        console.log('result :>> ', result);
        setListPartnerFilter(result);
    };

    const getUserById = (listUser, userId) => listUser.find((user) => user.id === userId);

    const calculateAge = (dob) => {
        const currentYear = new Date().getFullYear();
        return currentYear - dob;
    };

    const fetchListBooking = async () => {
        const res = await BookingServices.fetchListBookingAsync();
        if (res.data) {
            dispatch(setListBookingStore(res.data.data));
        }
    };

    const fetchVerification = async () => {
        const result = await UserServices.fetchVerificationAsync();
        const { data } = result;

        if (data) {
            dispatch(setVerificationStore(data.data));
        }
    };

    const fetchListNotification = async () => {
        const result = await NotificationServices.fetchListNotificationAsync();
        const { data } = result;

        if (data) {
            dispatch(setListNotification(data.data));
            countNumberNotificationUnread(data.data);
        }
    };

    const countNumberNotificationUnread = (listNotiFromAPI) => {
        let count = 0;
        listNotiFromAPI.forEach((item) => {
            if (!item.isRead) {
                count += 1;
            }
        });

        dispatch(setNumberNotificationUnread(count));
    };

    const getConversationByMessage = (message, listConversationSource) => {
        const index = listConversationSource.findIndex(
            (conversation) => conversation.from === message.from || conversation.from === message.to
        );

        if (index === -1) {
            return null;
        }

        return {
            conversation: listConversationSource[index],
            indexInSource: index
        };
    };

    const getListConversationFromSocket = () => {
        const { token } = currentUser;
        const data = {
            query: GraphQueryString.GET_LIST_CONVERSATION,
            variables: { pageIndex: 1, pageSize: 20 }
        };

        socketRequestUtil(
            'POST',
            data,
            token,
            (res) => {
                dispatch(setListConversation(res.data.data.getRecently));
                setListConversationGetAtHome(res.data.data.getRecently);
                countNumberOfUnreadConversation(res.data.data.getRecently);
            }
        );
    };

    const countNumberOfUnreadConversation = (listConversation) => {
        let count = 0;
        listConversation.forEach((conversation) => {
            if (conversation.to === currentUser.id && !conversation.isRead) {
                count += 1;
            }
        });

        dispatch(setNumberMessageUnread(count));
    };

    const getListPartner = async (newPageIndex) => {
        const result = await BookingServices.fetchListPartnerAsync({ pageIndex: newPageIndex });
        const { data } = result;

        if (data) {
            dispatch(setListPartnerHomeRedux(data.data));
            setPageIndex(newPageIndex);
        }
        setRefreshing(false);
        setIsShowSpinner(false);
    };

    const setIntervalToUpdateLastActiveOfUserStatus = () => {
        const intervalUpdateLastActive = setInterval(() => {
            const data = {
                query: GraphQueryString.UPDATE_LAST_ACTIVE,
                variables: { url: currentUser.url }
            };

            socketRequestUtil(
                'POST',
                data,
                currentUser.token
            );
        }, 300000);
        return intervalUpdateLastActive;
    };

    const onRefresh = () => {
        setRefreshing(true);
        getListPartner(pageIndex);
    };

    const handleDisplayName = (name) => {
        if (name.length > 21) {
            let nameArr = name.split(' ');
            nameArr = nameArr.slice(nameArr.length - 2, nameArr.length);
            return nameArr.join(' ');
        }
        return name;
    };

    const renderArticles = () => (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={listPartnerFilter}
            refreshControl={(
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => onRefresh()}
                    tintColor={COLORS.ACTIVE}
                />
            )}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
                <>
                    {renderUserCard(item, index)}
                </>
            )}
            onEndReached={() => {
                const newPageIndex = pageIndex + 1;
                getListPartner(newPageIndex);
            }}
            contentContainerStyle={{
                paddingTop: 10,
            }}
            ListEmptyComponent={() => (
                <View
                    style={{
                        alignItems: 'center',
                        width: SIZES.WIDTH_MAIN
                    }}
                >
                    <CustomText text="Không có kết quả phù hợp với bộ lọc" />
                </View>
            )}
        />
    );

    const handleInterestFromAPI = (user) => {
        if (!user?.interests) {
            return 'N/a';
        }

        const result = user.interests.split(', ');
        result.splice(result.length - 1, 1);
        return result.join(', ');
    };

    const renderUserCard = (item, index) => {
        let amountDisplay = item.id === currentUser.id ? item.earningExpected : item.estimatePricing;
        amountDisplay = CommonHelpers.formatCurrency(amountDisplay);

        return (
            <TouchableNativeFeedback
                onPress={() => navigation.navigate(ScreenName.PROFILE, { userId: item.id })}
            >
                <View
                    style={{
                        backgroundColor: COLORS.BASE,
                        alignItems: 'center'
                    }}
                >
                    {index === 0 && (
                        <Separator style={{
                            marginTop: -10
                        }}
                        />
                    )}
                    <View
                        style={{
                            flexDirection: 'row',
                            width: SIZES.WIDTH_MAIN,
                            marginVertical: 10
                        }}
                    >
                        <View style={styles.imageContainer}>
                            <ImageScalable
                                style={{
                                    zIndex: 99,
                                    borderRadius: 10
                                }}
                                width={SIZES.WIDTH_BASE * 0.4 - 10}
                                source={item.url ? { uri: item.url } : Images.defaultImage}
                            />
                        </View>
                        <View
                            style={{
                                width: SIZES.WIDTH_BASE * 0.55,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: SIZES.FONT_H2,
                                    color: COLORS.DEFAULT,
                                    fontFamily: TEXT_BOLD,
                                }}
                            >
                                {handleDisplayName(item.fullName)}
                            </Text>
                            {/* <ProfileInfoItem
                                fontSize={SIZES.FONT_H3}
                                iconName="home"
                                iconFamily={IconFamily.FONT_AWESOME_5}
                                content={`${item.homeTown || 'N/a'}`}
                                iconSize={16}
                            /> */}
                            <Text
                                style={{
                                    fontSize: SIZES.FONT_H3,
                                    color: COLORS.DEFAULT,
                                }}
                            >
                                {`${item.homeTown || 'N/a'}`}
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <ProfileInfoItem
                                    fontSize={SIZES.FONT_H3}
                                    iconName="birthday-cake"
                                    iconFamily={IconFamily.FONT_AWESOME}
                                    content={
                                        moment(item.dob).format('YYYY').toString().toLowerCase() !== 'invalid date'
                                            ? moment(item.dob).format('YYYY').toString()
                                            : '1990'
                                    }
                                    iconSize={16}
                                />
                                <ProfileInfoItem
                                    fontSize={SIZES.FONT_H3}
                                    iconName={item.isMale ? 'male' : 'female'}
                                    iconFamily={IconFamily.FONTISTO}
                                    content={`${item.isMale ? 'Nam' : 'Nữ'}`}
                                    iconSize={16}
                                />
                                <ProfileInfoItem
                                    fontSize={SIZES.FONT_H3}
                                    iconName="star"
                                    iconFamily={IconFamily.FONT_AWESOME}
                                    content={`${item.ratingAvg}/5`}
                                    iconSize={16}
                                />
                            </View>

                            {/* <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: -3
                                }}
                            >
                                <View
                                    style={{
                                        width: '100%'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: SIZES.FONT_H3,
                                            color: COLORS.DEFAULT,
                                        }}
                                    >
                                        {handleInterestFromAPI(item)}
                                    </Text>
                                </View>
                            </View> */}

                            <ListServiceDisplay
                                userServices={item?.interests}
                                onPressServiceItem={async (value) => {
                                    setModalFilterVisible(true);
                                    let listInterest = await SecureStore.getItemAsync('LIST_INTEREST_FILTER');
                                    if (!listInterest) {
                                        return;
                                    }

                                    listInterest = JSON.parse(listInterest);

                                    listInterest.forEach((interestItem, interestIndex) => {
                                        if (interestItem.value.toLowerCase() === value.toLowerCase()) {
                                            listInterest[interestIndex].selected = true;
                                        }
                                    });

                                    console.log('listInterest :>> ', listInterest);
                                    setListInterestFilter(listInterest);
                                }}
                            />

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                <View
                                    style={{
                                        width: '100%'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: SIZES.FONT_H3,
                                            color: COLORS.DEFAULT,
                                            fontFamily: TEXT_BOLD,
                                        }}
                                    >
                                        {`Phí thuê: ${amountDisplay} Xu/phút`}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <Separator />
                </View>
            </TouchableNativeFeedback>
        );
    };

    const renderFilterButton = () => (
        <TouchableOpacity
            style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                width: 45,
                height: 45,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.ACTIVE
            }}
            onPress={() => {
                setModalFilterVisible(true);
            }}
        >
            <IconCustom
                name="filter"
                family={IconFamily.FEATHER}
                size={22}
                color={COLORS.BASE}
            />
        </TouchableOpacity>
    );

    const renderFilterModal = useCallback(
        () => (
            <FilterModal
                setModalFilterVisible={setModalFilterVisible}
                modalFilterVisible={modalFilterVisible}
                setModalLocationVisible={setModalLocationVisible}
                hometownSelectedIndex={hometownSelectedIndex}
                setHometownSelectedIndex={setHometownSelectedIndex}
                listInterestFilter={listInterestFilter}
                setListInterestFilter={setListInterestFilter}
            />
        ), [listInterestFilter,
            setListInterestFilter,
            setModalFilterVisible,
            modalFilterVisible,
            setModalLocationVisible,
            hometownSelectedIndex,
            setHometownSelectedIndex]
    );

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <View
                        style={{
                            backgroundColor: COLORS.SEPARATE,
                            alignSelf: 'center',
                        }}
                    >
                        {renderArticles()}
                        {renderFilterButton()}
                        {renderFilterModal()}

                        <LocationModal
                            modalLocationVisible={modalLocationVisible}
                            setModalLocationVisible={setModalLocationVisible}
                            hometownSelectedIndex={hometownSelectedIndex}
                            setHometownSelectedIndex={setHometownSelectedIndex}
                            setModalFilterVisible={setModalFilterVisible}
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

const styles = StyleSheet.create({
    imageContainer: {
        elevation: 1,
        overflow: 'hidden',
        flex: 1,
    },
    subInfoCard: {
        fontFamily: TEXT_REGULAR,
    },
});
