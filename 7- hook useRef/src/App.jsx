import React, {useEffect, useId, useMemo, useRef, useState} from "react";
import {Input} from "../components/forms/Input.jsx";
import {Checkbox} from "../components/forms/Checkbox.jsx";

function App() {

    const prefixRef = useRef(null);
    const [prefix, setPrefix] = useState("");
    prefixRef.current = prefix

    useEffect(() => {
        const timer = setInterval(() => {
            console.log(prefixRef.current)
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    }, [])

    return <div>
        <Input label="prefix" value={prefix} onChange={setPrefix} />
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nisl lectus, placerat id sodales id, ullamcorper
        eu dolor. Sed non faucibus libero, vitae aliquam nibh. Phasellus maximus orci ut pharetra.
    </div>
}

export default App;