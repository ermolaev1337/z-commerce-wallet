import React from 'react';
import {Text, View, StyleSheet, Image, Button, TouchableOpacity, ScrollView} from 'react-native';
import Modal from 'react-native-modal';
import {WHITE_COLOR, GRAY_COLOR} from '../theme/Colors';
import HeadingComponent from './HeadingComponent';
import CredentialsCard from './CredentialsCard';

const card_logo = require('../assets/images/visa.jpg')
const close_img = require('../assets/images/close.png')

function ModalComponent(props) {

    const styles = StyleSheet.create({
        ModalComponent: {
            flex: 1,
        },
        ModalChildContainer: {
            flex: 1,
            backgroundColor: WHITE_COLOR,
            borderRadius: 15,
            marginTop: "10%",
            marginBottom: "2%",
        },
        centerContainer: {
            alignItems: 'center',
            paddingBottom: 20,
        },
        modalValues: {
            color: GRAY_COLOR,
            fontSize: 18,
            marginBottom: "2%"

        },
        modalTitles: {
            marginTop: "2%"
        },
        horizontalRule: {
            borderBottomColor: GRAY_COLOR,
            borderBottomWidth: 1,
        },
        modalValuesContainer: {
            width: '97%',
            alignSelf: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10
        },
        cross: {
            width: 10,
            height: 10,
            resizeMode: 'contain'
        },
        crossIcon: {
            width: 60,
            height: 60,
            resizeMode: 'contain'
        },
        crossContainer: {
            marginTop: '4%'
        },
    });


    console.log("props", props)
    const [
        digits,
        type,
        someNumbers,
        otherNumbers,
        revocationTree,
        expirationTimestamp,
        digit,
        empty,
        name,
        surname,
        address,
        birthdayTimestamp,
        eyes,
        height,
        anotherNumbers,
        someOtherNumbers,
    ] = props.data;

    return (
        <View style={styles.ModalComponent}>
            <Modal hideModalContentWhileAnimating={true} useNativeDriver={false} isVisible={props.isVisible}>
                <View style={styles.ModalChildContainer}>
                    {props.credentials && <CredentialsCard attributes={props.data}/>}
                    <View style={styles.centerContainer}>
                        <HeadingComponent text="Details"/>
                    </View>
                    <ScrollView>
                        {props.data !== undefined && (<View style={styles.modalValuesContainer}>
                            <Text style={styles.modalTitles}>First Name</Text>
                            <Text style={styles.modalValues}>{name}</Text>
                            <Text style={styles.modalTitles}>Last Name</Text>
                            <Text style={styles.modalValues}>{surname}</Text>
                            <Text style={styles.modalTitles}>Birthday</Text>
                            <Text
                                style={styles.modalValues}>{(new Date(1000 * birthdayTimestamp)).toLocaleDateString()}</Text>
                            <Text style={styles.modalTitles}>Address</Text>
                            <Text style={styles.modalValues}>{address}</Text>
                            <Text style={styles.modalTitles}>Valid until</Text>
                            <Text
                                style={styles.modalValues}>{(new Date(1 * expirationTimestamp)).toLocaleDateString()}</Text>
                            <Text style={styles.modalTitles}>Revocation registry</Text>
                            <Text style={styles.modalValues}>{revocationTree}</Text>
                        </View>)
                        }
                    </ScrollView>
                    <View style={styles.horizontalRule}/>
                    <View style={styles.centerContainer}>
                        {props.modalType === 'action' && <Button text="Accept" nextHandler={props.acceptModal}/>}
                        {props.modalType === 'action' && <Button isVisible={props.modalType === 'action'}
                                                                 text="Reject" nextHandler={props.rejectModal}/>}
                        <TouchableOpacity activeOpacity={.5} style={styles.crossContainer} onPress={props.dismissModal}>
                            <Image source={close_img} style={styles.crossIcon}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default ModalComponent;
