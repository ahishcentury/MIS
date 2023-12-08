const express = require("express");
const getUsers = require("../controller/users/getUsers");
const addUsers = require("../controller/users/addUser");
const checkAllowedUsers = require("../permissions/checkAllowedUsers");
const { ENCODED_PUBLIC_KEY } = require("../helper/keys");
const getGroups = require("../controller/getGroupMaster");
const getGroupSymbolConfiguration = require("../controller/getGroupSymbolsConfigurationMaster");
const getGroupCommissionConfiguration = require("../controller/getGroupCommissionConfigurationMaster");
const getSymbols = require("../controller/getSymbolMaster");
const updateSMTP = require("../controller/smtp/updateSmtpDetails");
const getSmtpDetails = require("../controller/smtp/getSmtpDetails");
const uploadSwapMaster = require("../controller/holding_cost/opsHoldingRateUploadMaster");
const uploadHoldingRateMaster = require("../controller/holding_cost/lpHoldingRateUploadMaster");
const getFormattedFileHoldingCost = require("../controller/holding_cost/getFormattedFileHoldingCost");
const removeFormattedFile = require("../controller/holding_cost/removeFormattedFile");
const fetchFormattedFileMaster = require("../controller/holding_cost/fetchFormattedFileMaster");
const readHoldingCostUploadsDir = require("../controller/holding_cost/readHoldingCostUploadsDir");
const fetchFormattedFileByName = require("../controller/holding_cost/fetchFormattedFileByName");
const UserRole = require("../schemas/userRole");
const userModules = require("../schemas/userModules");
const addUserRole = require("../controller/user_role/addUserRole");
const addModules = require("../controller/modules/addModules");
const getUserRole = require("../controller/user_role/getUserRole");
const getUserModules = require("../controller/modules/getUserModules");
const deleteUserRole = require("../controller/user_role/deleteUserRole");
const updateUserRoleFieldPermission = require("../controller/user_role/updateUserRoleFieldPermission");
const updateUserRoleModulePermission = require("../controller/user_role/updateUserRoleModulePermission");
const addUserRoleModulePermission = require("../controller/user_role/addUserRoleModulePermission");
const createUser = require("../controller/users/createUser");
const deleteUser = require("../controller/users/deleteUser");
const updateUserInfo = require("../controller/users/updateUserInfo");
const router = express.Router();

router.get("/getUsers", getUsers);

router.post("/addUsers", addUsers);

router.get("/getGroups", getGroups);

router.get("/getSymbols", getSymbols);

router.get("/getSmtpDetails", getSmtpDetails);

router.post("/updateSmtpDetails", updateSMTP);

router.get("/getGroupSymbolConfiguration/:groupName", getGroupSymbolConfiguration);

router.get("/getGroupCommissionConfiguration/:groupName", getGroupCommissionConfiguration);

router.post("/checkAllowedUsers", checkAllowedUsers);

router.post("/uploadSwapMaster", uploadSwapMaster);

router.post("/uploadHoldingRateMaster", uploadHoldingRateMaster);

router.get("/getFormattedFileHoldingCost", getFormattedFileHoldingCost);

router.post("/removeFormattedFile/:fileId", removeFormattedFile);

router.get("/fetchFormattedFileMaster/:filename", fetchFormattedFileMaster);

router.get("/readHoldingCostUploadsDir", readHoldingCostUploadsDir);

router.post("/fetchFormattedFileMasterByName/:fileName", fetchFormattedFileByName);

router.post("/addModules", addModules);

router.post("/addUserRole", addUserRole);

router.get("/getUserRoles", getUserRole);

router.get("/getUserModules", getUserModules);

router.post("/deleteUserRole", deleteUserRole);

router.post("/updateUserRoleFieldPermission", updateUserRoleFieldPermission);

router.post("/addUserRoleModulePermission", addUserRoleModulePermission);

router.post("/updateUserRoleModulePermission", updateUserRoleModulePermission);

router.post("/createUser", createUser);

router.post("/getUsers", getUsers);

router.post("/deleteUser", deleteUser);

router.post("/updateUserInfo", updateUserInfo);

router.get("/getPublicKey", function (req, res, next) {
    res.json(ENCODED_PUBLIC_KEY);
});

module.exports = router;