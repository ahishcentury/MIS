import { createContext, useState } from "react";
const UserRoleConext = createContext({})
export function UserRoleContextProvider({ children }) {
    const [name, setName] = useState("Mumshad ")
    const [age, setAge] = useState("Jawad")
    const [dialog, setDialog] = useState(false)
    const context = { name, setName, age, setAge, dialog, setDialog }
    return <UserRoleConext.Provider value={context}>
        {children}
    </UserRoleConext.Provider>
}
export default UserRoleConext;