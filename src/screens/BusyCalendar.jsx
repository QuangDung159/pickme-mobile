import {
    Block, Button, Input, Text
} from 'galio-framework';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    Modal, ScrollView, StyleSheet, View
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { CenterLoader, IconCustom, NoteText } from '../components/uiComponents';
import {
    ArrDayOfWeek, IconFamily, NowTheme, Rx, ScreenName
} from '../constants';
import { ToastHelpers } from '../helpers';
import { rxUtil } from '../utils';

export default function BusyCalendar({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [modalVisible, setModalVisible] = useState(true);
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [isShowInput, setIsShowInput] = useState(false);
    const [dayOfWeekToAdd, setDayOfWeekToAdd] = useState(-1);
    const [isCalendarChanged, setIsCalendarChanged] = useState(true);
    const [busyCalendar, setBusyCalendar] = useState([
        [], [], [], [], [], [], []
    ]);

    const token = useSelector((state) => state.userReducer.token);

    useEffect(
        () => {
            setIsShowSpinner(true);
            getCalendar();
        }, []
    );

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    const getCalendar = () => {
        rxUtil(
            Rx.CALENDAR.MY_CALENDAR,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setIsShowSpinner(false);
                setBusyCalendar([...res.data.data]);
            },
            (err) => {
                console.log('err', err);
                setIsShowSpinner(false);
            },
            (err) => {
                console.log('err', err);
                setIsShowSpinner(false);
            }
        );
    };

    const convertStringHoursToMinutes = (hoursStr) => {
        const deltaTime = hoursStr.split(':');
        const hours = deltaTime[0];
        const minutes = deltaTime[1];
        return hours * 60 + +minutes;
    };

    const convertMinutesToStringHours = (minutes) => moment.utc()
        .startOf('day')
        .add(minutes, 'minutes')
        .format('HH:mm');

    const onChangeStart = (startInput) => {
        if (startInput.length === 2
            && startInput.length >= start.length) {
            setStart(`${startInput}:`);
        } else {
            setStart(startInput);
        }
    };

    const onChangeEnd = (endInput) => {
        if (endInput.length === 2
            && endInput.length >= end.length) {
            setEnd(`${endInput}:`);
        } else {
            setEnd(endInput);
        }
    };

    const onClickAddSection = () => {
        const startAt = convertStringHoursToMinutes(start);
        const endAt = convertStringHoursToMinutes(end);

        const busySectionToAdd = {
            startAt,
            endAt
        };

        const busyCalendarTemp = [...busyCalendar];
        busyCalendarTemp[dayOfWeekToAdd].push(busySectionToAdd);

        setIsShowInput(false);
        setStart('');
        setEnd('');
        setBusyCalendar(busyCalendarTemp);
    };

    const onRemoveSection = (dayOfWeek, sectionIndex) => {
        const busyCalendarTemp = [...busyCalendar];
        busyCalendarTemp[dayOfWeek].splice(sectionIndex, 1);

        setBusyCalendar(busyCalendarTemp);
    };

    const onSubmitSendCalendar = () => {
        // send new timetable to api
        setIsShowSpinner(true);

        rxUtil(
            Rx.CALENDAR.ADD_CALENDAR,
            'POST',
            {
                calendar: busyCalendar
            },
            {
                Authorization: token
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'success');
                setIsShowSpinner(false);
                navigation.navigate(ScreenName.PERSONAL);
            },
            () => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast();
            },
            (errMessage) => {
                setIsShowSpinner(false);
                ToastHelpers.renderToast(errMessage, 'error');
            }
        );
    };

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    const renderModal = () => (
        <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <NoteText
                            width={NowTheme.SIZES.WIDTH_BASE * 0.7}
                            content="Đăng kí lịch bận để có thể thoải mái hơn khi nhận đơn hẹn."
                            backgroundColor={NowTheme.COLORS.LIST_ITEM_BACKGROUND_2}
                        />

                        <Block
                            style={{
                                marginTop: 10
                            }}
                        >
                            <NoteText
                                width={NowTheme.SIZES.WIDTH_BASE * 0.7}
                                title="Lưu ý:"
                                // eslint-disable-next-line max-len
                                content="Lịch bận của bạn sẽ tự động được áp dụng cho các tuần tiếp theo, đến khi bạn cập nhật lại lịch làm của mình."
                                iconComponent={(
                                    <IconCustom
                                        name="info-circle"
                                        family={IconFamily.FONT_AWESOME}
                                        size={16}
                                        color={NowTheme.COLORS.ACTIVE}
                                    />
                                )}
                            />
                        </Block>

                        <Block
                            style={{
                                marginTop: 10
                            }}
                        >
                            <NoteText
                                title="Lưu ý:"
                                // eslint-disable-next-line max-len
                                content="Những thay đổi sẽ được áp dụng bắt đầu ngay khi bạn xác nhận. Lịch bận của bạn sẽ được thay đổi ngay lập tức phía khách hàng."
                                iconComponent={(
                                    <IconCustom
                                        name="info-circle"
                                        family={IconFamily.FONT_AWESOME}
                                        size={16}
                                        color={NowTheme.COLORS.ACTIVE}
                                    />
                                )}
                            />
                        </Block>

                        <Block center>
                            <Button
                                onPress={() => setModalVisible(false)}
                                style={[styles.buttonModal, {
                                    marginVertical: 10
                                }]}
                                shadowless
                            >
                                Đã hiểu
                            </Button>
                        </Block>
                    </View>
                </View>
            </ScrollView>
        </Modal>
    );

    const renderListFreetimeSection = () => ArrDayOfWeek.map((item, dayOfWeek) => {
        const listBusyByDOW = busyCalendar.length !== 0 ? busyCalendar[dayOfWeek] : [];

        return (
            <>
                {/* need break component */}
                {renderContentSectionItem(
                    (
                        <Text
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                            }}
                            size={20}
                            color={NowTheme.COLORS.ACTIVE}
                        >
                            {item}
                        </Text>
                    ),
                    (
                        <TouchableWithoutFeedback
                            onPress={() => {
                                setIsShowInput(true);
                                setDayOfWeekToAdd(dayOfWeek);
                            }}
                        >
                            {renderAddButton()}
                        </TouchableWithoutFeedback>
                    ),
                    () => {},
                    NowTheme.COLORS.LIST_ITEM_BACKGROUND_2
                )}
                {listBusyByDOW.map((busySectionItem, sectionIndex) => (
                    renderBusySectionItem(busySectionItem, dayOfWeek, sectionIndex)
                ))}
                {isShowInput && (dayOfWeekToAdd === dayOfWeek) ? (
                    <>
                        {renderInput()}
                    </>
                ) : (
                    <></>
                )}
            </>
        );
    });

    const renderInput = () => (
        <>
            {renderContentSectionItem(
                (
                    <>
                        <Block
                            row
                        >
                            <Input
                                maxLength={5}
                                style={{
                                    borderRadius: 5,
                                    width: NowTheme.SIZES.WIDTH_BASE * 0.37,
                                    height: 35,
                                    marginRight: 10
                                }}
                                color={NowTheme.COLORS.HEADER}
                                placeholder="Bắt đầu..."
                                value={start}
                                textInputStyle={{
                                    fontSize: 18,
                                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                                }}
                                onChangeText={(startInput) => onChangeStart(startInput)}
                            />
                            <Input
                                maxLength={5}
                                style={{
                                    borderRadius: 5,
                                    width: NowTheme.SIZES.WIDTH_BASE * 0.37,
                                    height: 35
                                }}
                                color={NowTheme.COLORS.HEADER}
                                placeholder="Kết thúc..."
                                value={end}
                                textInputStyle={{
                                    fontSize: 18,
                                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                                }}
                                onChangeText={(endInput) => onChangeEnd(endInput)}
                            />
                        </Block>
                    </>
                ),
                (
                    <>
                        <Block
                            row
                        >
                            <Block
                                style={{
                                    marginRight: 10
                                }}
                            >
                                <TouchableWithoutFeedback
                                    onPress={() => onClickAddSection()}
                                >
                                    {renderAddButton()}
                                </TouchableWithoutFeedback>
                            </Block>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    setIsShowInput(false);
                                    setStart('');
                                    setEnd('');
                                }}
                            >
                                {renderRemoveButton()}
                            </TouchableWithoutFeedback>
                        </Block>
                    </>
                ),
                () => {},
                NowTheme.COLORS.INPUT
            )}
        </>
    );

    const renderRemoveButton = () => (
        <IconCustom
            name="close"
            family={IconFamily.FONT_AWESOME}
            color={NowTheme.COLORS.ERROR}
            size={24}
        />
    );

    const renderAddButton = () => (
        <IconCustom
            name="plus"
            family={IconFamily.FONT_AWESOME}
            color={NowTheme.COLORS.SUCCESS}
            size={24}
        />
    );

    const renderContentSectionItem = (content, subContent, handler, backgroundColor) => (
        <Block
            style={{
                backgroundColor,
                height: NowTheme.SIZES.HEIGHT_BASE * 0.07,
                width: NowTheme.SIZES.WIDTH_BASE,
                justifyContent: 'center',
            }}
        >
            <Block
                row
                space="between"
                style={{
                    marginHorizontal: 10,
                    alignItems: 'center'
                }}
            >
                <Block>
                    {content}
                </Block>

                <Block>
                    <TouchableWithoutFeedback
                        onPress={() => handler()}
                    >
                        {subContent}
                    </TouchableWithoutFeedback>
                </Block>
            </Block>
        </Block>
    );

    const renderButtonPanel = () => (
        <>
            {!isCalendarChanged ? (
                <></>
            ) : (
                <Block
                    style={{
                        marginTop: 10,
                        marginBottom: 10
                    }}
                >
                    <Block center>
                        <Button
                            onPress={() => onSubmitSendCalendar()}
                            style={[styles.button, {
                                marginVertical: 5
                            }]}
                            shadowless
                        >
                            Xác nhận
                        </Button>
                    </Block>
                    <Block center>
                        <Button
                            shadowless
                            color={NowTheme.COLORS.DEFAULT}
                            style={styles.button}
                            onPress={() => {
                                getCalendar();
                                navigation.navigate(ScreenName.PERSONAL);
                                setIsCalendarChanged(true);
                            }}
                        >
                            Huỷ bỏ
                        </Button>
                    </Block>
                </Block>
            )}
        </>
    );

    const renderBusySectionItem = (busySectionItem, dayOfWeek, sectionIndex) => {
        const { startAt, endAt } = busySectionItem;
        const startAtStr = convertMinutesToStringHours(startAt);
        const endAtStr = convertMinutesToStringHours(endAt);
        return (
            <Block>
                {renderContentSectionItem(
                    (
                        <Text
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                            }}
                            size={20}
                            color={NowTheme.COLORS.ACTIVE}
                        >
                            {`Từ ${startAtStr} đến ${endAtStr}`}
                        </Text>
                    ),
                    renderRemoveButton(),
                    () => onRemoveSection(dayOfWeek, sectionIndex),
                    NowTheme.COLORS.LIST_ITEM_BACKGROUND_1
                )}
            </Block>
        );
    };

    try {
        return (
            <>
                {renderModal()}
                {isShowSpinner ? (
                    <CenterLoader size="large" />
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <Block>
                            {renderListFreetimeSection()}
                            {renderButtonPanel()}
                        </Block>
                    </ScrollView>
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
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
    },
    buttonModal: {
        width: NowTheme.SIZES.WIDTH_BASE * 0.7
    },
    button: {
        width: NowTheme.SIZES.WIDTH_90
    }
});
