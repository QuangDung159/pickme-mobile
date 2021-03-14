import { Block, Text } from 'galio-framework';
import React, { useRef } from 'react';
import { Button } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

export default function TimePickerBottomSheet() {
    const refRBSheet = useRef();
    return (
        <Block
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#000'
            }}
        >
            <Button title="OPEN BOTTOM SHEET" onPress={() => refRBSheet.current.open()} />
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown
                closeOnPressMask={false}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'transparent',
                    },
                    draggableIcon: {
                        backgroundColor: '#000'
                    }
                }}
            >
                <Block
                    style={{

                        backgroundColor: 'yellow'
                    }}
                />
                <Text>
                    Bottom Sheet
                </Text>
                <Button
                    onPress={() => refRBSheet.current.close()}
                    title="Click"
                />
            </RBSheet>
        </Block>
    );
}
