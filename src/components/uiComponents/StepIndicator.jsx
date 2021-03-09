import { Block, Text } from 'galio-framework';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NowTheme } from '../../constants';
import Button from './Button';

export default function StepIndicator({
    type, buttonText, content
}) {
    let indicatorStyle = styles.stepIndicatorCurrent;
    let buttonFontColor = NowTheme.COLORS.BASE;
    switch (type) {
        case 'next': {
            indicatorStyle = styles.stepIndicatorNext;
            break;
        }
        case 'prev': {
            indicatorStyle = styles.stepIndicatorPrev;
            break;
        }
        default: {
            buttonFontColor = NowTheme.COLORS.ACTIVE;
            break;
        }
    }
    return (
        <Block row>
            <Block
                style={styles.stepIndicatorContainer}
            >
                <Button
                    round
                    shadowless
                    style={indicatorStyle}
                    fontFamily={NowTheme.FONT.MONTSERRAT_BOLD}
                    fontSize={20}
                    fontColor={buttonFontColor}
                >
                    {buttonText}
                </Button>
            </Block>

            <Block
                middle
                style={styles.contentContainer}
            >
                <Text
                    color={NowTheme.COLORS.DEFAULT}
                    size={16}
                    fontFamily={NowTheme.FONT.MONTSERRAT_REGULAR}
                    numberOfLines={2}
                >
                    {content}
                </Text>
            </Block>
        </Block>
    );
}

StepIndicator.propTypes = {
    type: PropTypes.oneOf(['next', 'current', 'prev']),
    buttonText: PropTypes.string,
    content: PropTypes.string
};

StepIndicator.defaultProps = {
    type: 'current',
    buttonText: '1',
    content: 'Booking was rejected'
};

const styles = StyleSheet.create({
    stepIndicatorCurrent: {
        width: NowTheme.SIZES.BASE * 3,
        height: NowTheme.SIZES.BASE * 3,
        borderRadius: NowTheme.SIZES.BASE * 1.5,
        justifyContent: 'center',
        marginHorizontal: 5,
        backgroundColor: NowTheme.COLORS.BASE,
        borderColor: NowTheme.COLORS.ACTIVE,
        borderWidth: 5,
    },
    stepIndicatorNext: {
        width: NowTheme.SIZES.BASE * 3,
        height: NowTheme.SIZES.BASE * 3,
        borderRadius: NowTheme.SIZES.BASE * 1.5,
        justifyContent: 'center',
        marginHorizontal: 5,
        backgroundColor: NowTheme.COLORS.BLOCK,
    },
    stepIndicatorPrev: {
        width: NowTheme.SIZES.BASE * 3,
        height: NowTheme.SIZES.BASE * 3,
        borderRadius: NowTheme.SIZES.BASE * 1.5,
        justifyContent: 'center',
        marginHorizontal: 5,
        backgroundColor: NowTheme.COLORS.ACTIVE,
    },
    stepIndicatorContainer: {
        width: 60,
    },
    contentContainer: {
        marginLeft: 10
    }
});
