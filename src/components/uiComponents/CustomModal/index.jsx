import { Theme } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import { BlurView } from 'expo-blur';
import React from 'react';
import {
    Modal, ScrollView, StyleSheet, View
} from 'react-native';

const { SIZES, COLORS } = Theme;

export default function CustomModal({
    modalVisible, renderContent, contentStyle, containerStyle
}) {
    const renderModal = () => (
        <Modal
            animationType="fade"
            transparent
            visible={modalVisible}
        >
            <BlurView intensity={100} style={[StyleSheet.absoluteFill]}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={
                        [
                            styles.containerStyle,
                            containerStyle
                        ]
                    }
                    >
                        <View
                            style={
                                [
                                    styles.contentStyle,
                                    contentStyle
                                ]
                            }
                        >
                            {renderContent && (
                                <>
                                    {renderContent()}
                                </>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </BlurView>
        </Modal>
    );

    try {
        return (
            <View>
                {renderModal()}
            </View>
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
    containerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: SIZES.HEIGHT_BASE * 0.2,
        margin: 10,
        backgroundColor: COLORS.BASE,
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: SIZES.WIDTH_BASE * 0.9
    },
    contentStyle: {
        width: SIZES.WIDTH_BASE * 0.8,
        marginVertical: 10,
        alignItems: 'center'
    }
});
