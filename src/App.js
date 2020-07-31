import React from "react";
import logo from "./logo.svg";
import "./App.css";
const firebase = require("firebase");

var firebaseConfig = {
    apiKey: "AIzaSyDYJcbZ9sK8oA4Zr_E1jkMKrimr6xCvl0Q",
    authDomain: "authtest-22c51.firebaseapp.com",
    databaseURL: "https://authtest-22c51.firebaseio.com",
    projectId: "authtest-22c51",
    storageBucket: "authtest-22c51.appspot.com",
    messagingSenderId: "583304601600",
    appId: "1:583304601600:web:e90ae3bd139182da2df8e5",
    measurementId: "G-HZLM6E8XP9",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var provider = new firebase.auth.OAuthProvider("microsoft.com");

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: "processing",
            active_screen: "welcome",
            logs: "START1",
        };

        this.myHappyCallback = this.myHappyCallback.bind(this);
    }

    myHappyCallback(result) {
        this.setState((state) => ({
            logs: state.logs + JSON.stringify(result),
        }));
        return fetch(
            "http://localhost:5001/authtest-22c51/us-central1/widgets/testToken",
            {
                headers: {
                    Authorization: "Bearer " + result.credential.accessToken,
                    "Content-Type": "application/json",
                },
            }
        );
    }

    async checkRedirect() {
        const auth = firebase.auth();
        const result = await auth.getRedirectResult();
        if (result.user !== null) {
            console.log(result.credential.accessToken);
            return true;
        } else {
            return false;
        }
    }

    async componentDidMount() {
        var user = await this.checkRedirect();
        if (user) {
            this.setState((state) => ({
                logs: state.logs + " Authenticated",
            }));
        } else {
            firebase.auth().signInWithRedirect(provider);
        }
    }

    render() {
        return <div>{this.state.logs}</div>;
    }
}
