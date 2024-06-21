import {StyleSheet, Text, View} from 'react-native'
import React, {useState, useEffect} from "react";
import * as Linking from 'expo-linking';
import queryString from 'query-string';


//TODO extract functions to a separated file
const createAttributePresentation = async ({challenge, expiration}) => {
    console.debug("Creating Attribute Presentation, for challenge, and expiration >> >>", challenge, expiration)
    const createAttributePresentationURL = `http://localhost:8083/heimdalljs/pres/attribute?index=10&expiration=${expiration}&challenge=${challenge}&secretKey=holder_sk.txt&destination=pres_attribute_e_commerce.json&credential=cred_holder.json`
    console.debug("createAttributePresentationURL >>", createAttributePresentationURL)
    const newAttributePresentation = await (await fetch(createAttributePresentationURL)).json()
    console.debug("newAttributePresentation >>", newAttributePresentation)
    return newAttributePresentation
}
const confirmProofRequest = async (attributePresentation, orderID) => {//TODO
    console.debug("Confirmed Proof Request, sending Attribute Presentation, attributePresentation >>", attributePresentation)
    const submitAttributePresentationURL = `http://localhost:2222/submit-attribute-presentation?orderID=${orderID}`
    console.debug("submitAttributePresentationURL >>", submitAttributePresentationURL)

    const responseSubmitAttributePresentation = await fetch(submitAttributePresentationURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(attributePresentation),
    })
    const result = await responseSubmitAttributePresentation.json()
    console.debug("responseSubmitAttributePresentation >>", result)

    return result
}
//TODO Proof Request should also have an ID
const rejectProofRequest = async (challenge, expiration) => {//TODO
    console.debug("Rejected Proof Request, for challenge, and expiration >>", challenge, expiration)
}

const confirmConnectionInvitation = async (agentURL, orderID) => {//TODO
    console.debug("Confirmed Connection Invitation, orderID >>", orderID)
    agentURL = "localhost:2222"//TODO solve the mismatch between docker names and localhost IP address when dockerized frontend is accessed from the browser, idea: have all the interactions with the Heimdall instance via Wallet Backend which is within the docker network
    const confirmationURL = `http://${agentURL}/confirm-connection?orderID=${orderID}`
    console.debug("confirmationURL", confirmationURL)
    const incomingProofRequest = await (await fetch(confirmationURL)).json()
    console.debug("incomingProofRequest", incomingProofRequest)
    return incomingProofRequest
}
const rejectConnectionInvitation = async (agentURL, orderID) => {//TODO
    console.debug("Rejected Connection Invitation, orderID >>", orderID)
}

const ActionScreen = () => {
    const [connectionInvitationData, setConnectionInvitationData] = useState()
    const [connectionInvitation, setConnectionInvitation] = useState(<p>No incoming Connection Invitations</p>)
    const [proofRequestData, setProofRequestData] = useState()
    const [proofRequest, setProofRequest] = useState(<p>No incoming Proof Requests</p>)
    //TODO we create Attribute Presentation automatically for each Proof Request but we share it only when confirmed
    const [attributePresentation, setAttributePresentation] = useState()

    //TODO we will have multiple cred types in the future
    const ProofRequestCard = ({
                                  proofRequestData: {challenge, expiration},
                                  connectionInvitationData: {agentURL, orderID},
                                  attributePresentation
                              }) => {//TODO make a nice Connection Invitation Card

        return (//TODO should be Connection ID, instead of the Order ID
            <div style={{width: "300px", borderStyle: "solid", padding: "10px"}}>
                <h3>Proof Request</h3>
                <p>Credential Identity Card</p>
                <p>Challenge {challenge}</p>
                <p>Expiration {expiration}</p>
                <button disabled={!attributePresentation}
                        onClick={async () => {
                            const result = await confirmProofRequest(attributePresentation, orderID)
                            alert(JSON.stringify(result))
                            setProofRequest(<p>No incoming Proof Requests</p>)
                        }}>Confirm
                </button>
                <button onClick={() => rejectProofRequest(challenge, expiration)}>Reject</button>
            </div>
        )
    }

    const ConnectionInvitationCard = ({connectionInvitationData: {agentURL, orderID}}) => {//TODO make a nice Connection Invitation Card
        return (//TODO should be Connection ID, instead of the Order ID
            <div style={{width: "300px", borderStyle: "solid", padding: "10px"}}>
                <h3>Connection Invitation</h3>
                <p>Agent URL <a>{agentURL}</a></p>
                <p>Order ID {orderID}</p>
                <button onClick={async () => {
                    setConnectionInvitation(<p>No incoming Connection Invitations</p>)//TODO and erase the URL from where we initially get the incoming connection invitation
                    const incomingProofRequest = await confirmConnectionInvitation(agentURL, orderID)
                    console.debug(" ConnectionInvitationCard onClick() incomingProofRequest >>", incomingProofRequest)
                    setProofRequestData(incomingProofRequest)//TODO maybe messaging channel instead of passing data between child/parent components?
                }}>Confirm</button>
                <button onClick={() => rejectConnectionInvitation(agentURL, orderID)}>Reject</button>
            </div>
        )
    }

    useEffect(() => {
        const create = async () => {
            console.debug("create() proofRequestData >>", proofRequestData)
            const newAttributePresentation = await createAttributePresentation(proofRequestData)
            setAttributePresentation(newAttributePresentation)
        }
        if (proofRequestData)//TODO figure out how to trigger useEffect only when there is a value set by the func setProofRequestData
            create()
    }, [proofRequestData])


    useEffect(() => {
        Linking.getInitialURL().then((url) => {
            console.log(url);
            const parsed = queryString.parseUrl(url)
            const connectionInvitationData = JSON.parse(decodeURIComponent(parsed.query.data))
            console.debug("connectionInvitationData", connectionInvitationData)
            setConnectionInvitationData(connectionInvitationData)
        });
    }, [])

    useEffect(() => {
        if (!connectionInvitationData){
            // console.error("No connectionInvitationData")
            return
        }
        setConnectionInvitation(<ConnectionInvitationCard connectionInvitationData={connectionInvitationData}/>)
    }, [connectionInvitationData])

    useEffect(() => {
        if (!connectionInvitationData){
            // console.error("No connectionInvitationData")
            return
        }
        if (!proofRequestData){
            // console.error("No proofRequestData")
            return
        }
        setProofRequest(<ProofRequestCard proofRequestData={proofRequestData} connectionInvitationData={connectionInvitationData}
                                     attributePresentation={attributePresentation}/>)
    }, [connectionInvitationData, proofRequestData, attributePresentation])


    return (
        <View>
            {connectionInvitation}
            {proofRequest}
        </View>
    )
}

export default ActionScreen

const styles = StyleSheet.create({})