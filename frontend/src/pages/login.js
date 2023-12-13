import React, { useEffect, useState } from "react";
import { config } from "../helper/config";
import { PublicClientApplication } from "@azure/msal-browser";
import { useNavigate } from "react-router-dom";
import { Paper, Box, Button, CircularProgress } from "@mui/material";
import { CHECK_ALLOWED_USERS, GET_PUBLIC_KEY, } from "../helper/apiString";
import { JSEncrypt } from "jsencrypt";
import axios from "axios";
import { Buffer } from "buffer";

const encrypt = new JSEncrypt();

const publicClientApplication = new PublicClientApplication({
    auth: {
        clientId: config.appId,
        redirectUri: config.redirectUri,
        authority: config.authority,
        postLogoutRedirectUri: config.postLogoutRedirectUri,
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
    },
});

const logo = `data:image/png;base64,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`;

export default function Login(props) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    function getPublicKey() {
        setLoading(true);
        axios
            .get(GET_PUBLIC_KEY)
            .then((res) => {
                setLoading(false);
                const d = Buffer.from(res.data, "base64").toString("ascii");
                encrypt.setPublicKey(d);

                let accounts = publicClientApplication.getAllAccounts();

                if (accounts.length == 0) {
                } else {
                    checkAuthorization(accounts[0].username);
                    //GENERATE JWT TOKEN WITH USER INFO USERTYPE & USEREMAIL
                }
            })
            .catch((e) => {
                setLoading(false);
                console.log(e.message);
            });
    }

    function logout() {
        try {
            localStorage.clear();
            sessionStorage.clear();
            (function () {
                var cookies = document.cookie.split("; ");
                for (var c = 0; c < cookies.length; c++) {
                    var d = window.location.hostname.split(".");
                    while (d.length > 0) {
                        var cookieBase =
                            encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) +
                            "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=" +
                            d.join(".") +
                            " ;path=";
                        var p = window.location.pathname.split("/");
                        document.cookie = cookieBase + "/";
                        while (p.length > 0) {
                            document.cookie = cookieBase + p.join("/");
                            p.pop();
                        }
                        d.shift();
                    }
                }
            })();
            window.location.reload();
        } catch (e) {
            console.log(e.message);
        }
    }

    function checkAuthorization(userEmail) {
        const enc = encrypt.encrypt(JSON.stringify({ userType: "MISA", userEmail }));
        axios
            .post(CHECK_ALLOWED_USERS, { payload: enc })
            .then((res) => {
                navigate("/mis_home");
            })
            .catch((e) => {
                console.log(e.message);
                logout();
            });
    }
    
    useEffect(() => {
        // getPublicKey();
    }, []);

    const login = async () => {
        try {
            // const res = await publicClientApplication.loginPopup({
            //     scopes: config.scopes,
            //     prompt: "select_account",
            // });

            // if (res) {
            //     checkAuthorization(res.account.username);
            // }
            navigate("/mis_home");
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
            }}
        >
            <Paper sx={{ padding: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <img src={logo} alt="brandlogo" />
                </Box>
                <h2>MIS Login</h2>
                {loading && (
                    <Button variant="contained" onClick={login}>
                        Sign In
                    </Button>
                )}
                {!loading && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <CircularProgress disableShrink />
                    </Box>
                )}
            </Paper>
        </div>
    );
}
