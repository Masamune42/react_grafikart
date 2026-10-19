import React, {useEffect, useId, useMemo} from "react";
import {Input} from "../components/forms/Input.jsx";
import {Checkbox} from "../components/forms/Checkbox.jsx";

function App() {
    const [firstname, setFirstname] = React.useState('John')
    const [password, setPassword] = React.useState('MotdePasse')
    const security = useMemo(() => {
        return passwordSecurity(password)
    }, [password])


    return <div className="container my-3 vstack gap-2">
        <Input
            label="Nom utilisateur"
            value={firstname}
            onChange={setFirstname}
        />

        <div>
            <Input
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
            />
        </div>
        Sécurité : {security}
    </div>
}

function passwordSecurity(password) {
    if(password.length <= 3) {
        return 'Faible'
    } else if (password.length < 6) {
        return 'Moyen'
    }
    return 'Fort'
}

export default App;