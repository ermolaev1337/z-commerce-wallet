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

const CredentialScreen = () => {
    const [isCredential, setCredential] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [credentials, setCredentialList] = useState();
    const [modalData, setModalData] = useState([]);

    const saveItem = async () => {
        const credentials = [{
            "attributes": ["1234501", "IdentityCard", "12923613273728872177574111242549658279820225772904028247604055806979583572807", "12233940937490263487452696164272264752313202658589317354006117603185145192197", "https://github.com/ermolaev1337/test-revoc.git", "1752328390544", "0", "", "John", "Jones", "4543 Chapmans Lane, 87109, Albuquerque", "843995700", "blue", "180", "115703781", "499422598"],
            "root": "4302603418693063545546375551340695481612721019217068991688887443562041935790",
            "signature": {
                "R8": ["53043713878415306593282623230197575466650258438831268749309817059967376282", "18906288631939781458302910545174460561020406584045852782655550063022374483770"],
                "S": "2248094461830101183761160223441162081615509039041494052746357746467602854574",
                "pk": ["1847793775679428145329562034305785677211560812951491979112230468977840389422", "19182820369147835675317751287306493524806597916660510817633295485500602330391"]
            }
        }]
        try {
            await AsyncStorage.setItem(ConstantsList.CREDENTIALS, JSON.stringify(credentials));
        } catch (error) {
            console.log(error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            saveItem()
            updateCredentialsList()
            return
        }, [isCredential])
    );

    const updateCredentialsList = async () => {
        getItem(ConstantsList.CREDENTIALS).then((credentials) => {
            console.log("credentials", credentials);
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

    const loadCreds = async () => {
        //add load from server
        //fetch wallet credentials
        let walletName = await getItem(ConstantsList.WALLET_NAME);
        let walletSecret = await getItem(ConstantsList.WALLET_SECRET);
        await fetch(ConstantsList.BASE_URL + `/credentials`,
            {
                method: 'GET',
                headers: {
                    'X-API-Key': ConstantsList.API_SECRET,
                    'Content-Type': 'application/json; charset=utf-8',
                    'Server': 'Python/3.6 aiohttp/3.6.2',
                    'wallet-name': walletName,
                    'wallet-key': walletSecret
                }
            }).then(credsResult =>
            credsResult.json().then(data => {
                let arr = [];
                try {
                    arr = data.results;
                    if (arr.length === 0) {
                        setCredential(false);
                    } else {
                        saveItem(ConstantsList.CREDENTIALS, JSON.stringify(arr)).then(() => {
                            setCredential(true);
                        })
                    }

                } catch {
                    arr = [];
                }
                console.log(arr.length === 0);

            }));

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
                        console.log("attributes",attributes)

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