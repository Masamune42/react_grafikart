import {useState, memo, useMemo, useCallback} from "react";
import {Input} from "./components/forms/Input.jsx";

function App(factory, deps) {
    const [name, setName] = useState('');

    const handleClick = useCallback(() => {
        console.log(name.length)
    }, [name.length])

    return <div className="container my-2 vstack gap-2">
        <div>
            <Input label="Prénom" onChange={setName} value={name}/>
            <div>
                {name.toUpperCase()}
            </div>
        </div>
        <InfoMemo onClick={handleClick}/>
    </div>
}

const InfoMemo = memo(function Info({onClick}) {
    console.log('Info', 'render')
    return <div className="alert alert-info" onClick={onClick}>
        Lorem ipsum dolor sit amet, consetetur adipiscing elit. Nulla nisl lectus, placerat id sodales id, ullamcorper
    </div>
})

export default App;