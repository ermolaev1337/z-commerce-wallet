import * as React from 'react';
import {View, Text, StyleSheet, ImageBackground, Image} from 'react-native';

const image = require('../assets/images/card-bg.png')
const card_badge = require('../assets/images/id-card.png')


function CredentialsCard(props) {
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
    ] = props.attributes;


    console.log("birthdayTimestamp", birthdayTimestamp)
    return (
        <View>
            <View style={styles.card}>
                <ImageBackground source={image} style={styles.image} imageStyle={{borderRadius: 15}}>
                    <View style={styles.container}>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.card_text}>{name} {surname}</Text>
                        </View>
                        {/*<View style={styles.item1}>*/}
                        {/*    <Text style={styles.card_small_text}>Address</Text>*/}
                        {/*    <Text style={styles.card_small_text}>{address}</Text>*/}
                        {/*</View>*/}
                        {/*<View style={styles.item1}>*/}
                        {/*    <Text style={styles.card_small_text}>Birthday</Text>*/}
                        {/*    <Text style={styles.card_small_text}>{(new Date(1000*birthdayTimestamp)).toLocaleDateString()}</Text>*/}
                        {/*</View>*/}
                        {/*<View style={styles.imageContainer}>*/}
                        {/*    <Image source={card_badge} style={styles.logo}/>*/}
                        {/*</View>*/}
                        <View style={styles.item2}>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.item1}>
                            <Image source={card_badge} style={{width: 50, height: 50}}/>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.card_small_text}>Type: {type}</Text>
                            <Text style={styles.card_small_text}>Issued by: Registration Office</Text>
                            <Text style={styles.card_small_text}>Valid until: {(new Date(1*expirationTimestamp)).toLocaleDateString()}</Text>
                        </View>

                    </View>
                </ImageBackground>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardTextContainer: {
        paddingTop: 20,
        paddingLeft: 20,
    },
    logo: {
        width: 50,
        marginTop: 50,
        marginLeft: 75,
        height: 70,
        position: 'absolute',
        alignItems: 'center', justifyContent: 'center',
    },
    card: {
        width: '100%',
        height: 170,
        borderRadius: 20,
        backgroundColor: 'black',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    item: {
        justifyContent: 'center',
    },
    item1: {
        width: '20%',
        padding: 20,
        justifyContent: 'center',
    },
    item2: {
        width: '80%',
        padding: 20,
        justifyContent: 'center',
    },
    imageContainer: {},
    card_text: {
        color: 'white',
        fontSize: 23,
        lineHeight: 22,
        fontWeight: '100',
        fontWeight: "bold",
    },
    card_small_text: {
        color: 'white',
        lineHeight: 14,
    },
    image: {
        flex: 1,
        borderRadius: 20,
        justifyContent: "center"
    },
});

export default CredentialsCard;