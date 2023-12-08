import { createContext, useState, useRef } from "react";
import { EN } from "./strings/en";
import { HI } from "./strings/hi";
import { CH } from './strings/ch';
import { RU } from './strings/ru';

const AppContext = createContext({
});

function getLang() {
    try {
        return localStorage.getItem("lang") || "EN";
    } catch (e) {
        return "EN";
    }
}

function getLocale() {
    try {
        return localStorage.getItem("locale") || "enUS";
    } catch (e) {
        return "enUS";
    }
}

export function AppContextProvider(props) {

    const [globalInputFieldVariant, setGlobalInputFieldVariant] = useState("outlined");
    const [headingColor, setHeadingColor] = useState("#ffd700");
    const [lang, setLang] = useState(getLang());
    const [renderGlobalTicketComponent, setRenderGlobalTicketComponent] = useState(false);
    const [globalTicketArray, setGlobalTicketArray] = useState([]);
    const [locale, setLocale] = useState(getLocale());
    const [pageBackgroundColor, setPageBackgroundColor] = useState("#f6f8fc");
    const [primaryLightColor, setPrimaryLightColor] = useState("#f7d93a");
    const [primaryMainColor, setPrimaryMainColor] = useState("#f5d00a");
    const [linkColor, setLinkColor] = useState("#338cf0");
    const [snackbarMsg, setSnackbarMsg] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [somethingChanged, setSomethingChanged] = useState(false);
    const [cardBackgroundColor, setCardBackgroundColor] = useState('whitesmoke');
    const [errorTextColor, setErrorTextColor] = useState("#ffcccb");
    const [userListFields, setUserListFields] = useState(["name", "phone", "createdAt"]);
    const [themeConfig, setThemeConfig] = useState({});
    const [legalDocs, setLegalDocs] = useState([]);
    const [socket, setSocket] = useState(null);
    const [BOClientChange, setBOClientChange] = useState(false);
    const [BOFundingChange, setBOFundingChange] = useState(false);
    const [BOTicketChange, setBOTicketChange] = useState(false);



    const [perms, setPerms] = useState(false);
    const [stages, setStages] = useState(false);

    const [userRoles, setUserRoles] = useState([
        { key: "DH", name: "Department Head" }, { key: "LGL", name: "Legal" }, { key: "Onboarding Compliance" }]);

    const [requiredUserDocumentList, setRequiredUserDocumentList] = useState([
        { type: "national", label: "National ID", isRequired: true },
        { type: "poa", label: "Proof of Address", isRequired: true },
        { type: "poi", label: "Proof of Income", isRequired: false },
        { type: "PAN", label: "PAN Card", isRequired: true, }
    ])



    function generateTicket(ticket) {
        setGlobalTicketArray(old => {
            let temp = old;
            temp = [ticket, ...temp];
            return temp;
        });
        setRenderGlobalTicketComponent(old => !old);
    }

    function removeTicket(tempTicketId) {
        setGlobalTicketArray(old => old.filter(ticket => tempTicketId !== ticket.tempTicketId));
    }




    const getToken = () => {
        if (localStorage.getItem("token"))
            return localStorage.getItem("token");

        return null;
    }

    const changeLang = (XX) => {
        let locale = "enUS";
        if (XX === "EN") {
            locale = "enUS"
        } else if (XX === "RU") {
            locale = "ruRU"
        } else if (XX === "CH") {
            locale = "zhCN"
        }
        setLocale(locale);
        setLang(XX);
        localStorage.setItem("locale", locale);
        localStorage.setItem("lang", XX);

    }

    function getApprovalStageItems(moduleName) {

        let items = [];
        for (let i = 0; i < stages.length; i++) {
            if (stages[i].name === moduleName) {
                items = stages[i].items;
            }
        }

        return items;
    }


    function getString(stringKey) {
        return { EN, RU, CH, HI }[lang][stringKey];
    }


    const getUserRole = () => {
        if (localStorage.getItem("token"))
            return localStorage.getItem("role") ? localStorage.getItem('role') : null;

        return null;
    }

    const context = {
        BOTicketChange, setBOTicketChange,
        BOClientChange, setBOClientChange,
        BOFundingChange, setBOFundingChange,
        severity, setSeverity,
        snackbarMsg, setSnackbarMsg,
        renderGlobalTicketComponent, setRenderGlobalTicketComponent,
        generateTicket, removeTicket,
        globalTicketArray,
        globalInputFieldVariant, legalDocs, setLegalDocs, socket, setSocket, themeConfig, setThemeConfig, locale, getString, somethingChanged, setSomethingChanged, getApprovalStageItems, perms, setPerms, stages, setStages, headingColor, primaryMainColor, linkColor, lang, primaryLightColor, changeLang, pageBackgroundColor, cardBackgroundColor, errorTextColor, requiredUserDocumentList, userRoles
    }

    return <AppContext.Provider value={context}>
        {props.children}
    </AppContext.Provider>
}

export default AppContext;