import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState, useEffect} from "react";
import * as Linking from 'expo-linking';
import queryString from 'query-string';
import {themeStyles} from "../theme/Styles";
import HeadingComponent from "../components/HeadingComponent";

// TODO: extract functions to a separated file
const createAttributePresentation = async ({challenge, expiration, url}) => {
    console.debug("Creating Attribute Presentation, for challenge, expiration, url >>", challenge, expiration, url);

    let createURL;

    if (url === "/heimdalljs/pres/attribute") {
        createURL = `http://localhost:8083${url}?index=${10}&expiration=${expiration}&challenge=${challenge}&secretKey=holder_sk.txt&destination=pres_attribute_e_commerce.json&credential=cred_holder.json`;
    } else if (url === "/heimdalljs/pres/range") {
        createURL = `http://localhost:8083${url}?index=${11}&expiration=${expiration}&challenge=${challenge}&secretKey=holder_sk.txt&destination=pres_attribute_e_commerce.json&credential=cred_holder.json`;
    } else {
        console.error("url mismatch, url >>", url);
        return;
    }

    const data = await fetch(createURL);
    console.debug("data >>", data);
    const resp = await data.json();

    console.debug("resp >>", resp);
    return resp;
};

const confirmProofRequest = async (attributePresentation, orderID, agentURL, url) => {
    console.debug("Confirmed Proof Request, agentURL >>", agentURL);
    console.debug("Confirmed Proof Request, url >>", url);
    console.debug("Confirmed Proof Request, sending Attribute Presentation, attributePresentation >>", attributePresentation);

    const submitAttributePresentationURL = `http://${agentURL}/submit-attribute-presentation?orderID=${orderID}`;
    console.debug("submitAttributePresentationURL >>", submitAttributePresentationURL);

    const responseSubmitAttributePresentation = await fetch(submitAttributePresentationURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(attributePresentation),
    });

    const result = await responseSubmitAttributePresentation.json();
    console.debug("responseSubmitAttributePresentation >>", result);

    return result;
};

const rejectProofRequest = async (challenge, expiration) => {
    console.debug("Rejected Proof Request, for challenge, and expiration >>", challenge, expiration);
};

const confirmConnectionInvitation = async (agentURL, orderID) => {
    console.debug("Confirmed Connection Invitation, orderID >>", orderID);
    console.debug("Confirmed Connection Invitation, agentURL >>", agentURL);

    const confirmationURL = `http://${agentURL}/confirm-connection?orderID=${orderID}`;
    console.debug("confirmationURL", confirmationURL);

    const incomingProofRequest = await (await fetch(confirmationURL)).json();
    console.debug("incomingProofRequest", incomingProofRequest);
    return incomingProofRequest;
};

const rejectConnectionInvitation = async (agentURL, orderID) => {
    console.debug("Rejected Connection Invitation, orderID >>", orderID);
};

const ActionScreen = () => {
    const [connectionInvitationData, setConnectionInvitationData] = useState();
    const [connectionInvitation, setConnectionInvitation] = useState(null);
    const [proofRequestData, setProofRequestData] = useState();
    const [proofRequest, setProofRequest] = useState(null);
    const [attributePresentation, setAttributePresentation] = useState();

    const ProofRequestCard = ({
                                  proofRequestData: {challenge, expiration, url},
                                  connectionInvitationData: {agentURL, orderID},
                                  attributePresentation
                              }) => {
        return (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Proof Request</Text>
                <Text style={styles.cardText}>Credential Identity Card</Text>
                <Text style={styles.cardText}>Challenge: {challenge}</Text>
                <Text style={styles.cardText}>Expiration: {expiration}</Text>
                <Text style={styles.cardText}>Type: {url}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, !attributePresentation && styles.buttonDisabled]}
                        disabled={!attributePresentation}
                        onPress={async () => {
                            const result = await confirmProofRequest(attributePresentation, orderID, agentURL, url);
                            alert(JSON.stringify(result));
                            setProofRequest(null);
                        }}
                    >
                        <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonReject}
                        onPress={() => rejectProofRequest(challenge, expiration)}
                    >
                        <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const ConnectionInvitationCard = ({connectionInvitationData: {agentURL, orderID}}) => {
        return (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Connection Invitation</Text>
                <Text style={styles.cardText}>Agent URL: <Text style={styles.link}>{agentURL}</Text></Text>
                <Text style={styles.cardText}>Order ID: {orderID}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={async () => {
                            setConnectionInvitation(null);
                            const incomingProofRequest = await confirmConnectionInvitation(agentURL, orderID);
                            setProofRequestData(incomingProofRequest);
                        }}
                    >
                        <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonReject}
                        onPress={() => rejectConnectionInvitation(agentURL, orderID)}
                    >
                        <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    useEffect(() => {
        const create = async () => {
            console.debug("create() proofRequestData >>", proofRequestData);
            const newAttributePresentation = await createAttributePresentation(proofRequestData);
            setAttributePresentation(newAttributePresentation);
        };
        if (proofRequestData) {
            create();
        }
    }, [proofRequestData]);

    useEffect(() => {
        Linking.getInitialURL().then((url) => {
            console.log(url);
            const parsed = queryString.parseUrl(url);
            const connectionInvitationData = JSON.parse(decodeURIComponent(parsed.query.data));
            console.debug("connectionInvitationData", connectionInvitationData);
            setConnectionInvitationData(connectionInvitationData);
        });
    }, []);

    useEffect(() => {
        if (!connectionInvitationData) {
            return;
        }
        setConnectionInvitation(<ConnectionInvitationCard connectionInvitationData={connectionInvitationData} />);
    }, [connectionInvitationData]);

    useEffect(() => {
        if (!connectionInvitationData || !proofRequestData) {
            return;
        }
        setProofRequest(
            <ProofRequestCard
                proofRequestData={proofRequestData}
                connectionInvitationData={connectionInvitationData}
                attributePresentation={attributePresentation}
            />
        );
    }, [connectionInvitationData, proofRequestData, attributePresentation]);

    return (
        <ScrollView style={themeStyles.mainContainer}>
            <HeadingComponent text="Actions" />
            <View style={styles.contentContainer}>
                {connectionInvitation}
                {proofRequest}
            </View>
        </ScrollView>
    );
};

export default ActionScreen;

const styles = StyleSheet.create({
    contentContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cardText: {
        fontSize: 14,
        marginBottom: 6,
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonReject: {
        backgroundColor: '#f44336',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
