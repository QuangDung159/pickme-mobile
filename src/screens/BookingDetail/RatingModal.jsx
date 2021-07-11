import {
    CustomButton, CustomCheckbox, CustomInput, CustomModal
} from '@components/uiComponents';
import Theme from '@constants/Theme';
import ToastHelpers from '@helpers/ToastHelpers';
import BookingServices from '@services/BookingServices';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';

const {
    FONT: {
        MONTSERRAT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;

export default function RatingModal({ modalRatingVisible, setModalRatingVisible, bookingId }) {
    const [enthusiasm, setEnthusiasm] = useState(5);
    const [onTime, setOnTime] = useState(5);
    const [possitive, setPossitive] = useState(5);
    const [professional, setProfessional] = useState(5);
    const [isRecomendForFriends, setIsRecomendForFriends] = useState(true);
    const [ratingDesc, setRatingDesc] = useState('');

    const sendRating = async () => {
        const result = await BookingServices.submitRatingAsync({
            bookingId,
            description: ratingDesc || 'Rating',
            enthusiasm,
            professional,
            onTime,
            possitive,
            isRecomendForFriends
        });

        const { data } = result;
        if (data) {
            ToastHelpers.renderToast(data.message, 'success');
        }
    };

    const renderIsRecommendSession = () => (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 30,
            }}
        >
            <CustomCheckbox
                label={`Sẽ giới thiệu đối tác với bạn bè ${'<3'}!`}
                onChange={(checked) => {
                    setIsRecomendForFriends(checked);
                }}
                labelStyle={{
                    fontSize: SIZES.FONT_H3,
                    color: COLORS.ACTIVE
                }}
                containerStyle={{
                    width: SIZES.WIDTH_BASE * 0.8
                }}
            />
        </View>
    );

    const renderRatingItem = (label, ratingValue, setRatingValue) => (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 5
            }}
        >
            <Text
                style={{
                    color: COLORS.ACTIVE,
                    fontFamily: MONTSERRAT_REGULAR,
                    fontSize: SIZES.FONT_H2
                }}
            >
                {label}
            </Text>
            <AirbnbRating
                count={5}
                reviewSize={25}
                defaultRating={ratingValue}
                size={25}
                onFinishRating={(ratingNumber) => {
                    setRatingValue(ratingNumber);
                }}
                showRating={false}
            />
        </View>
    );

    const renderRatingModal = () => (
        <CustomModal
            modalVisible={modalRatingVisible}
            renderContent={() => (
                <>
                    <Text
                        style={{
                            fontFamily: MONTSERRAT_REGULAR,
                            width: SIZES.WIDTH_BASE * 0.8,
                            fontSize: SIZES.FONT_H2,
                            color: COLORS.DEFAULT
                        }}
                    >
                        Bạn vui lòng góp ý để chúng tôi phục vụ bạn tốt hơn, cảm ơn.
                    </Text>
                    <View
                        style={{
                            width: SIZES.WIDTH_BASE * 0.8,
                            marginTop: 20,
                            marginBottom: 10
                        }}
                    >
                        {renderRatingItem('Hăng hái:', enthusiasm, (rating) => setEnthusiasm(rating))}
                        {renderRatingItem('Đúng giờ:', onTime, (rating) => setOnTime(rating))}
                        {renderRatingItem('Tích cực:', possitive, (rating) => setPossitive(rating))}
                        {renderRatingItem('Chuyên nghiệp:', professional, (rating) => setProfessional(rating))}
                    </View>
                    <CustomInput
                        value={ratingDesc}
                        multiline
                        onChangeText={(input) => setRatingDesc(input)}
                        containerStyle={{
                            marginBottom: 20,
                            width: SIZES.WIDTH_BASE * 0.8
                        }}
                        label="Góp ý:"
                        inputStyle={{
                            height: 80,
                        }}
                    />
                    {renderIsRecommendSession()}

                    <View
                        style={{
                            alignSelf: 'center'
                        }}
                    >
                        <CustomButton
                            onPress={() => {
                                sendRating();
                                setModalRatingVisible(false);
                            }}
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.8
                            }}
                            type="active"
                            label="Gửi đánh giá"
                        />
                    </View>
                </>
            )}
        />
    );

    return (
        <>
            {renderRatingModal()}
        </>
    );
}
