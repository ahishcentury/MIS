/**
 * ops:[1,1,1] = [boolean(View),boolean(Create/edit),boolean(delete);
 * 
 * 
 */


let FIELDPERMISSIONS = {

    ["Fee Group"]: {
        ["group name"]: [0, 0, 0],
        ["envronment type"]: [0, 0, 0],
        ["currency"]: [0, 0, 0],
        ["platform"]: [0, 0, 0],
        ["leverage"]: [0, 0, 0],
        ["margin call level"]: [0, 0, 0],
        ["margin stopup"]: [0, 0, 0],
        ["margin mode"]: [0, 0, 0],
    },
    ["Securities"]: {
        name: [0, 0, 0],
        path: [0, 0, 0],
        description: [0, 0, 0],
        sector: [0, 0, 0],
        ["min lot size"]: [0, 0, 0],
        ["max lot size"]: [0, 0, 0],
        ["step interval"]: [0, 0, 0],
        ["position limit"]: [0, 0, 0],
        ["stop level"]: [0, 0, 0],
        ["base currency"]: [0, 0, 0],
        ["profit curreny"]: [0, 0, 0],
        ["margin curreny"]: [0, 0, 0],
        ["commission fee"]: [0, 0, 0],
        ["spread fee"]: [0, 0, 0],
        margin: [0, 0, 0],
        ["spread def"]: [0, 0, 0],
        ["contract size"]: [0, 0, 0],
        ["swap short"]: [0, 0, 0],
        ["swap long"]: [0, 0, 0]
    },
    ["User Roles"]: {
        ["role name"]: [0, 0, 0],
        created: [0, 0, 0],
        updated: [0, 0, 0]
    },
    Users: {
        email: [0, 0, 0],
        name: [0, 0, 0],
        role: [0, 0, 0],
        phone: [0, 0, 0],
        account: [0, 0, 0],
        created: [0, 0, 0]
    },
    ["SMTP Setup"]: {
        name: [0, 0, 0],
        host: [0, 0, 0],
        port: [0, 0, 0],
        login: [0, 0, 0],
        password: [0, 0, 0]
    },
    ["Holding Cost"]: {}
};

module.exports = FIELDPERMISSIONS;