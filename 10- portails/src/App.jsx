import {createPortal} from "react-dom";

function App() {
    return <div style={{
        height: 300,
        overflowY: 'scroll',
        background: '#EEE',
        margin: 20,
        position: 'relative'
    }}>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam amet aut
            delectus dolore eaque eligendi facere, fuga laboriosam, natus omnis quam
            quibusdam reiciendis. Culpa perspiciatis quasi quidem quos tempore tenetur?
        </p>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam amet aut
            delectus dolore eaque eligendi facere, fuga laboriosam, natus omnis quam
            quibusdam reiciendis. Culpa perspiciatis quasi quidem quos tempore tenetur?
        </p>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam amet aut
            delectus dolore eaque eligendi facere, fuga laboriosam, natus omnis quam
            quibusdam reiciendis. Culpa perspiciatis quasi quidem quos tempore tenetur?
        </p>
        <Modal/>
    </div>
}

function Modal() {
    return createPortal(<div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 10,
        border: 'solid 1px grey',
        background: '#FFF'
    }}>
        Je suis une modale
    </div>, document.body);
}

export default App;
