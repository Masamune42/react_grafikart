import React, {useEffect} from "react";
import {Input} from "../components/forms/Input.jsx";
import {Checkbox} from "../components/forms/Checkbox.jsx";

function App() {
    // const [showInput, setShowInput] = React.useState(false);

    const [duration, setDuration] = React.useState(5);
    const [secondsLeft, setSecondsLeft] = React.useState(duration);

    const handleChange = (v) => {
        setDuration(v)
        setSecondsLeft(v)
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsLeft(v => {
                if( v <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return v - 1
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [duration]);

    return <div className="vstack gap-2">
        {/*<Checkbox label="Afficher" checked={showInput} onChange={setShowInput}/>*/}
        {/*{showInput && <EditTitle/>}*/}
        {/*<div style={{height: '300vh'}}></div>*/}

        <Input placeholder="Timer..."
               value={duration}
               onChange={handleChange}
        />
        <p>
            Décompte : {secondsLeft}
        </p>
    </div>
}

function EditTitle() {
    const [title, setTitle] = React.useState('');
    const [firstname, setFirstname] = React.useState('');
    const [y, setY] = React.useState(0);

    useEffect(() => {
        const originalTitle = document.title
        return () => {
            document.title = originalTitle;
        }
    }, []);

    useEffect(() => {
        document.title = title;
    }, [title]);

    useEffect(() => {
        const handler = (e) => {
            setY(window.scrollY)
        }
        window.addEventListener('scroll', handler)
        return () => {
            window.removeEventListener('scroll', handler)
        }
    }, []);

    return <div className="vstack gap-2">
        <div>
            Scroll: {y}
        </div>
        <Input
            placeholder="Modifier le titre"
            value={title}
            onChange={setTitle}
        />
        <Input
            placeholder="Prénom"
            value={firstname}
            onChange={setFirstname}
        />
    </div>
}

export default App;