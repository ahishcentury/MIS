let MODULEPERMISSIONS = [
    {
        moduleName: "Fee Groups",
        permission: { roles: { "Admin": [1, 1, 1] } }
    },
    {
        moduleName: "Securities",
        permission: { roles: { "Admin": [1, 1, 1] } }
    },
    {
        moduleName: "User Roles",
        permission: { roles: { "Admin": [1, 1, 1] } }
    },
    {
        moduleName: "Users",
        permission: { roles: { "Admin": [1, 1, 1] } }
    },
    {
        moduleName: "SMTP Setup",
        permission: { roles: { "Admin": [1, 1, 1] } }
    },
    {
        moduleName: "Holding Cost",
        permission: { roles: { "Admin": [1, 1, 1] } }
    },
    {
        moduleName: "Open Position",
        permission: { roles: { "Admin": [1, 1, 1] } } /// Alway add new module with admin permission like   permission : {roles : {"Admin" : [1,1,1]}}
    }
];

module.exports = MODULEPERMISSIONS;