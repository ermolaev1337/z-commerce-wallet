import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { themeStyles } from '../theme/Styles';
import ConstantsList from '../helpers/ConfigApp';
import HeadingComponent from '../components/HeadingComponent';
import ImageBoxComponent from '../components/ImageBoxComponent';
import TextComponent from '../components/TextComponent';

import { getItem } from '../helpers/Storage';

const ConnectionScreen = () => {
  const [isConnection, setConnection] = useState(true);
  const [connectionsList, setConnectionsList] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const saveItem = async () => {
    const connections = [{
      "imgURI" : "",
      "vaccineName": "covishield",
      "issuedBy":"GOI"
    }]
    try {
      await AsyncStorage.setItem(ConstantsList.CREDENTIALS, JSON.stringify(connections));
    } catch (error) {
      console.log(error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      saveItem()
      updateConnectionsList()
      return
    }, [isConnection])
  );

  const updateConnectionsList = () => {
    getItem(ConstantsList.CONNECTIONS).then((connections) => {
      if (connections != null) {
        let connectionsList = JSON.parse(connections)
        setConnectionsList(connectionsList)
        setConnection(true);
      } else {
        setConnection(false);
      }
    }).catch(e => { })
  }

  return (
    <View style={themeStyles.mainContainer}>
      <HeadingComponent text="Connections" />
      {isConnection &&
        <View>
          {
            connectionsList.map((v, i) => {
              let imgURI = '../assets/images/connectionsempty.png';
              let header = "test";
              let subtitle = "The connection is secure and encrypted.";
              return <TouchableOpacity key={i} >
                <FlatCard image={imgURI} heading={header} text={subtitle} />
              </TouchableOpacity>
            })
          }
        </View>
      }
      {!isConnection &&
        <View style={styles.EmptyContainer}>
          <ImageBoxComponent source={require('../assets/images/connectionsempty.png')} />
          <TextComponent text="Once you establish a connection, it will show up here. Go ahead and connect with someone." />
        </View>
      }
    </View>
  )
}

export default ConnectionScreen

const styles = StyleSheet.create({})