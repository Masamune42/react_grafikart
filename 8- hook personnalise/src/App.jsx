import {useState} from "react";
import {useToggle} from "./hooks/useToggle.js";
import {useIncrement} from "./hooks/useIncrement.js";
import {useDocumentTitle} from "./hooks/useDocumentTitle.js";
import {Input} from "./components/forms/Input.jsx";
import {useFetch} from "./hooks/useFetch.js";


function App() {
    const [checked, toggleCheck] = useToggle()
    const {count, increment, decrement} = useIncrement({
        base: 0,
        max: 10,
        min: 0
    })

    const [name, setName] = useState('')

    const {loading, data, errors} = useFetch('https://jsonplaceholder.typicode.com/posts?_limit=10&_delay=2000')

    useDocumentTitle(name ? `Editer ${name}` : null)

    return <div>
        {/*<input type="checkbox" checked={checked} onChange={toggleCheck}/>*/}
        {/*{checked && 'Je suis coché'}*/}
        <Input value={name} onChange={setName} label="Name"/>
        Compteur {count}
        <button onClick={increment} type="button">Incrémenter</button>
        <button onClick={decrement} type="button">Décrémenter</button>

        {loading && <div>Loading...</div>}
        {errors && <div>{errors.toString()}</div>}
        {data && <div>
            <ul>
                {data.map(post => (<li key={post.id}>{post.title}</li>))}
            </ul>
        </div>}
    </div>
}

export default App;