import { IconFamily, NowTheme } from '@constants/index';
import PropTypes from 'prop-types';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import IconCustom from '../IconCustom';

const {
    FONT: {
        MONTSERRAT_REGULAR,
    },
    SIZES,
    COLORS
} = NowTheme;

CustomInput.propTypes = {
    label: PropTypes.string,
    inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    rightIcon: PropTypes.object,
    onPressRightIcon: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

CustomInput.defaultProps = {
    label: '',
    inputStyle: {},
    labelStyle: {},
    containerStyle: {},
    rightIcon: null,
    onPressRightIcon: null,
    value: ''
};

export default function CustomInput({
    label,
    labelStyle, inputStyle,
    containerStyle,
    onPressRightIcon,
    value,
    rightIcon, ...props
}) {
    const renderTextInputBase = () => (
        <TextInput
            style={
                [
                    {
                        borderColor: COLORS.INPUT,
                        borderWidth: 1,
                        borderRadius: 5,
                        height: 50,
                        paddingHorizontal: 10,
                        fontFamily: MONTSERRAT_REGULAR,
                        fontSize: SIZES.FONT_H3,
                        color: COLORS.HEADER
                    },
                    inputStyle,
                ]
            }
            value={value.toString()}
            {...props}
        />
    );

    const renderTextInputByRight = () => {
        if (rightIcon) {
            const {
                size, color, name, family
            } = rightIcon;
            return (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    <View
                        style={{
                            flex: 9
                        }}
                    >
                        {renderTextInputBase()}
                    </View>

                    <View
                        style={{
                            width: SIZES.WIDTH_BASE * 0.1,
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            marginRight: 10,
                            flex: 1
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => {
                                if (onPressRightIcon) onPressRightIcon();
                            }}
                        >
                            <IconCustom
                                size={size || 30}
                                color={color || COLORS.DEFAULT}
                                name={name || 'home'}
                                family={family || IconFamily.FONT_AWESOME}
                            />
                        </TouchableWithoutFeedback>
                    </View>

                </View>
            );
        }

        return (
            <>
                {renderTextInputBase()}
            </>
        );
    };

    return (
        <View
            style={containerStyle}
        >
            {label !== '' && (
                <Text
                    style={
                        [
                            {
                                fontFamily: MONTSERRAT_REGULAR,
                                fontSize: SIZES.FONT_H3,
                                color: COLORS.ACTIVE,
                                marginBottom: 10
                            },
                            labelStyle
                        ]
                    }
                >
                    {label}
                </Text>
            )}
            {renderTextInputByRight()}
        </View>
    );
}
