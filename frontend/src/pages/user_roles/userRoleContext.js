import { createContext, useState } from "react";
const userRoleConext = createContext({})
export function UserRoleContextProvider(useProps) {
    const [module, setModule] = useState([]);
    const context = { module, setModule };
    return <userRoleConext.Provider value={context}>
        {useProps.children}
    </userRoleConext.Provider>
}
export default userRoleConext;