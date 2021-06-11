import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { NowTheme } from '../../../constants';
import { ToastHelpers } from '../../../helpers';

export default function CustomModal({
    modalVisible, renderContent, contentStyle, containerStyle
}) {
    const renderModal = () => (
        <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
        >
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
        marginTop: NowTheme.SIZES.HEIGHT_BASE * 0.2,
        margin: 10,
        backgroundColor: 'white',
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
        width: NowTheme.SIZES.WIDTH_BASE * 0.9
    },
    contentStyle: {
        width: NowTheme.SIZES.WIDTH_BASE * 0.8,
        marginVertical: 10,
        alignItems: 'center'
    }
});
