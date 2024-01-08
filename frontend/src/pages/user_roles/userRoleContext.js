import { createContext, useState } from "react";
const UserRoleConext = createContext({})
export function UserRoleContextProvider({ children }) {
    const [name, setName] = useState("Mumshad ")
    const [age, setAge] = useState("Jawad")
    const [platformType, setPlatformType] = useState("TU");
    const [dialog, setDialog] = useState(false)
    const context = { name, setName, age, setAge, dialog, setDialog, platformType, setPlatformType }
    return <UserRoleConext.Provider value={context}>
        {children}
    </UserRoleConext.Provider>
}
export default UserRoleConext;