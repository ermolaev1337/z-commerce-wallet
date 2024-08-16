import {useFocusEffect} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import CredentialsCard from '../components/CredentialsCard';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import HeadingComponent from '../components/HeadingComponent';
import {themeStyles} from '../theme/Styles';
import {getItem, saveItem} from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';
import AsyncStorage from '@react-native-community/async-storage';
import ModalComponent from '../components/ModalComponent';


const getCred = async () => {
    const cred = await fetch("http://localhost:8083/cred?path=cred_holder.json")
    return await cred.json()
}

const CredentialScreen = () => {
    const [isCredential, setCredential] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [credentials, setCredentialList] = useState();
    const [modalData, setModalData] = useState([]);


    useEffect(()=>{
        (async ()=>{
            const cred = JSON.stringify([await getCred()])
            console.debug(cred)
            AsyncStorage.setItem(ConstantsList.CREDENTIALS, cred);
            updateCredentialsList()
        })();
    },[isCredential])
    //
    // useFocusEffect(
    //     React.useCallback(() => {
    //
    //     }, [isCredential])
    // );

    const updateCredentialsList = async () => {
        getItem(ConstantsList.CREDENTIALS).then((credentials) => {
            console.log("credentials", JSON.stringify(credentials));
            if (credentials != null) {
                let credentialsList = JSON.parse(credentials);
                console.log("credentialsList", credentialsList);
                if (credentialsList.length === 0) {
                    setCredential(false);
                } else {
                    setCredential(true);
                    setCredentialList(credentialsList);
                }
            } else {
                setCredential(false);
            }
        }).catch(e => {
        })
    }

    const toggleModal = (v) => {
        setModalData(v)
        setModalVisible(!isModalVisible);
    };

    const dismissModal = (v) => {
        setCredential(false);
        setModalVisible(false);
    };

    return (
        <View style={themeStyles.mainContainer}>
            <HeadingComponent text="Credentials"/>

            {isCredential &&
                <View>
                    <ModalComponent credentials={false} data={modalData} isVisible={isModalVisible}
                                    toggleModal={toggleModal} dismissModal={dismissModal}/>
                    {credentials !== undefined && credentials.map((v, i) => {
                        const attributes = v.attributes;
                        console.log("attributes", attributes)

                        return <TouchableOpacity onPress={() => toggleModal(v.attributes)}>
                            <View style={styles.CredentialsCardContainer}>
                                <CredentialsCard attributes={attributes}/>
                            </View>
                        </TouchableOpacity>
                    })

                    }
                </View>}

            {!isCredential &&
                <View style={styles.EmptyContainer}>
                    <ImageBoxComponent source={require('../assets/images/credentialsempty.png')}/>
                    <TextComponent
                        text="There are no certificates in your wallet. Once you receive a certificate, it will show up here."/>

                </View>}

        </View>
    )
}

export default CredentialScreen

const styles = StyleSheet.create({
    EmptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    CredentialsCardContainer: {
        paddingTop: 5
    },
    refreshButton: {
        width: 60,
        height: 60,
        resizeMode: 'contain'
    },
})