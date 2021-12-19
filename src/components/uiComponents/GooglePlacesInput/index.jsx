import { Theme } from '@constants/index';
import { getConfigByEnv } from '@helpers/CommonHelpers';
import React, { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const {
    FONT: {
        TEXT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;

const { MAP_API_KEY } = getConfigByEnv();

export default function GooglePlacesInput({ onChangeAddress, addressInput, label }) {
    const ref = useRef();

    useEffect(() => {
        ref.current.setAddressText(addressInput);
    }, []);

    const renderGooglePlacesInput = () => (
        <View
            style={{
                zIndex: 99,
            }}
        >
            {label && (
                <Text
                    style={{
                        fontFamily: TEXT_REGULAR,
                        fontSize: SIZES.FONT_H3,
                        color: COLORS.ACTIVE,
                        marginVertical: 10
                    }}
                >
                    {label}
                </Text>
            )}

            <GooglePlacesAutocomplete
                ref={ref}
                onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                    onChangeAddress(details);
                }}
                query={{
                    key: MAP_API_KEY,
                    language: 'vi',
                }}
                fetchDetails
                styles={{
                    textInputContainer: {
                        borderRadius: 8,
                        borderColor: COLORS.DEFAULT,
                        width: SIZES.WIDTH_BASE * 0.9,
                        marginBottom: 10,
                        borderWidth: 1
                    },
                    textInput: {
                        height: 80,
                        color: COLORS.DEFAULT,
                        fontSize: SIZES.FONT_H3,
                        fontFamily: TEXT_REGULAR,
                        backgroundColor: COLORS.TRANSPARENT
                    },
                }}
                textInputProps={{
                    multiline: true,
                }}
                getDefaultValue={() => addressInput || 'N/a'}
                renderRow={(rowData) => {
                    const title = rowData.structured_formatting.main_text;
                    const address = rowData.structured_formatting.secondary_text;
                    return (
                        <View>
                            <Text style={{
                                fontSize: SIZES.FONT_H3,
                                fontFamily: TEXT_REGULAR,
                                color: COLORS.BASE
                            }}
                            >
                                {title}
                            </Text>
                            <Text style={{
                                fontSize: SIZES.FONT_H4,
                                fontFamily: TEXT_REGULAR,
                                color: COLORS.BASE
                            }}
                            >
                                {address}
                            </Text>
                        </View>
                    );
                }}
            />
        </View>
    );
    return (
        <>
            {renderGooglePlacesInput()}
        </>
    );
}
