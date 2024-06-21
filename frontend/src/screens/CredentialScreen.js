import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import CredentialsCard from '../components/CredentialsCard';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';
import HeadingComponent from '../components/HeadingComponent';
import { themeStyles } from '../theme/Styles';
import { getItem, saveItem } from '../helpers/Storage';
import ConstantsList from '../helpers/ConfigApp';
import AsyncStorage from '@react-native-community/async-storage';
import ModalComponent from '../components/ModalComponent'

const CredentialScreen = () => {
  const [isCredential, setCredential] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [credentials, setCredentialList] = useState();
  const [modalData, setModalData] = useState([]);

  const saveItem = async () => {
      const credentials = [{
        "vaccineName": "covishield",
        "issuedBy":"GOI",
        "details":{
          "firstname" :"jyoti",
          "lastname":"kumari",
          "gender":"female"
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
      console.log("credentials",credentials);
      if (credentials != null) {
        let credentialsList = JSON.parse(credentials);
        console.log("credentialsList",credentialsList);
        if (credentialsList.length === 0) {
          setCredential(false);
        }
        else {
          setCredential(true);
          setCredentialList(credentialsList);
        }
      } else {
        setCredential(false);
      }
    }).catch(e => { })
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
            }
            else {
              saveItem(ConstantsList.CREDENTIALS, JSON.stringify(arr)).then(() => {
                setCredential(true);
              })
            }

          }
          catch{
            arr = [];
          }
          console.log(arr.length === 0);

        }));

  };

  return (
    <View style={themeStyles.mainContainer}>
      <HeadingComponent text="Certificates" />
      
      {isCredential &&
        <View>
          <ModalComponent credentials={false} data={modalData} isVisible={isModalVisible} toggleModal={toggleModal} dismissModal={dismissModal} />
          {credentials !== undefined && credentials.map((v, i) => {
            let vaccineName = v.vaccineName;
            let issuedBy = v.issuedBy;


            return <TouchableOpacity onPress={() => toggleModal(v.details)}>
              <View style={styles.CredentialsCardContainer}>
                <CredentialsCard card_title={vaccineName} card_type="Digital Certificate" issuer={issuedBy} card_user="" date="05/09/2020"/>
              </View>
            </TouchableOpacity>
          })

          }
        </View>}

      {!isCredential &&
        <View style={styles.EmptyContainer}>
          <ImageBoxComponent source={require('../assets/images/credentialsempty.png')} />
          <TextComponent text="There are no certificates in your wallet. Once you receive a certificate, it will show up here." />

        </View>}

    </View >
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