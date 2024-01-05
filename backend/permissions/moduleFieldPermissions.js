/**
 * ops:[1,1,1] = [boolean(View),boolean(Create/edit),boolean(delete);
 * 
 * 
 */


let FIELDPERMISSIONS = {

    ["Fee Groups"]: {
        ["groupName"]: [0, 0, 0],
        ["envType"]: [0, 0, 0],
        ["currency"]: [0, 0, 0],
        ["platform"]: [0, 0, 0],
        ["leverage"]: [0, 0, 0],
        ["marginCall"]: [0, 0, 0],
        ["marginStopUp"]: [0, 0, 0],
        ["marginMode"]: [0, 0, 0],
    },
    ["Symbols"]: {
        symbolName: [0, 0, 0],
        path: [0, 0, 0],
        description: [0, 0, 0],
        sector: [0, 0, 0],
        ["min"]: [0, 0, 0],
        ["max"]: [0, 0, 0],
        ["step"]: [0, 0, 0],
        ["limit"]: [0, 0, 0],
        ["stopLevel"]: [0, 0, 0],
        ["baseCur"]: [0, 0, 0],
        ["profitCur"]: [0, 0, 0],
        ["marginCur"]: [0, 0, 0],
        ["commission"]: [0, 0, 0],
        ["spread"]: [0, 0, 0],
        margin: [0, 0, 0],
        ["spreaddef"]: [0, 0, 0],
        ["contractSize"]: [0, 0, 0],
        ["swapShort"]: [0, 0, 0],
        ["swapLong"]: [0, 0, 0]
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
    ["Holding Cost"]: {
        _id: [1, 1, 1]
    },
    ["Open Position"]: {
        loginid: [1, 1, 1]
    }
};

module.exports = FIELDPERMISSIONS;