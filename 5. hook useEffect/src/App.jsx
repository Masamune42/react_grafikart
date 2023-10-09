import { useState } from "react"
import { Checkbox } from "./components/forms/checkbox"
import { useEffect } from "react"
import { Input } from "./components/forms/input"

function App() {
  const [showInput, setSHowInput] = useState(true)

  return <div className="container my-3 stack">
    <Checkbox
      checked={showInput}
      onChange={setSHowInput}
      id="titleshow"
      label="Afficher le champs titre"
    />
    {showInput && <EditTitle />}
    <div style={{height: '300vh'}}></div>
  </div>
}

function EditTitle () {
  const [title, setTitle] = useState('')
  const [firstname, setFirstname] = useState('')
  const [y, setY] = useState(0)


  useEffect(() => {
    const originalTitle = document.title
    return () => {
      document.title = originalTitle
    }
  }, [title])

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(() => {
    const handler = (e) => {
      console.log('scroll')
      setY(window.scrollY)
    }
    window.addEventListener('scroll', handler)
    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, [])

  return <div className="vstack gap-2">
    <div>
      Scroll : {y}
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

export default App
