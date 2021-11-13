import { CustomButton, CustomModal } from '@components/uiComponents';
import Theme from '@constants/Theme';
import moment from 'moment';
import React from 'react';
import { Text, View } from 'react-native';

const {
    FONT: {
        TEXT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;

export default function PartnerBusyCalendarModal({ listBusyBySelectedDate, modalVisible, setModalVisible }) {
    const convertMinutesToStringHours = (minutes) => moment.utc()
        .startOf('day')
        .add(minutes, 'minutes')
        .format('HH:mm');

    const renderListBusySection = () => {
        if (listBusyBySelectedDate[0] !== '') {
            return listBusyBySelectedDate.map((item, sectionIndex) => {
                const startStr = convertMinutesToStringHours(item.startAt);
                const endStr = convertMinutesToStringHours(item.endAt);

                return (
                    <View
                        // eslint-disable-next-line react/no-array-index-key
                        key={sectionIndex}
                        style={{
                            backgroundColor: sectionIndex % 2 === 0
                                ? COLORS.LIST_ITEM_BACKGROUND_1
                                : COLORS.LIST_ITEM_BACKGROUND_2,
                            height: SIZES.HEIGHT_BASE * 0.07,
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                marginHorizontal: 10,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    flex: 1
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: TEXT_REGULAR,
                                        fontSize: 27,
                                        color: COLORS.ACTIVE,
                                    }}

                                >
                                    {startStr}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: TEXT_REGULAR,
                                        fontSize: 27,
                                        color: COLORS.ACTIVE
                                    }}

                                >
                                    -
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: TEXT_REGULAR,
                                        fontSize: 27,
                                        color: COLORS.ACTIVE
                                    }}

                                >
                                    {endStr}
                                </Text>
                            </View>
                        </View>
                    </View>
                );
            });
        }
        return <></>;
    };

    const renderBusyCalendar = () => (
        <>
            {!listBusyBySelectedDate || listBusyBySelectedDate.length === 0 ? (
                <View
                    style={{
                        marginBottom: 10,
                        alignSelf: 'center',
                        alignItems: 'center',
                        flex: 1.0
                    }}
                >
                    <Text
                        style={{
                            fontFamily: TEXT_REGULAR,
                            color: COLORS.SWITCH_OFF,
                            fontSize: 14
                        }}

                    >
                        Host rảnh vào ngày này, đặt hẹn nào!
                    </Text>
                </View>
            ) : (
                <View>
                    {renderListBusySection()}
                </View>
            )}
        </>
    );

    const renderModal = () => (
        <CustomModal
            modalVisible={modalVisible}
            renderContent={() => (
                <>
                    <Text
                        style={{
                            fontFamily: TEXT_REGULAR,
                            marginVertical: 10,
                            fontSize: SIZES.FONT_H2
                        }}
                    >
                        Lịch bận của host
                    </Text>
                    <View
                        style={{
                            width: SIZES.WIDTH_BASE * 0.8
                        }}
                    >
                        {renderBusyCalendar()}
                    </View>

                    <View
                        style={{
                            alignSelf: 'center'
                        }}
                    >
                        <CustomButton
                            onPress={() => setModalVisible(false)}
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.8,
                                marginVertical: 10
                            }}
                            type="active"
                            label="Đóng"
                        />
                    </View>
                </>
            )}
        />
    );

    return (
        <>
            {renderModal()}
        </>
    );
}
