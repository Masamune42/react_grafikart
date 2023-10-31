import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { Input } from './components/forms/input'

function App() {

  const prefixRef = useRef(null)
  const [prefix, setPrefix] = useState('')
  prefixRef.current = prefix

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(prefixRef.current)
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [prefix])

  return <div>
    <Input label="prefix" value={prefix} onChange={setPrefix} />
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit, dicta nisi deserunt sit corrupti, voluptate mollitia officia veniam harum ad fugiat quis sapiente voluptatibus, laboriosam molestiae laudantium odio laborum error.
    Quasi consequuntur nulla est repudiandae! Saepe laudantium distinctio corrupti voluptate, amet quisquam! Dolorum repellendus deserunt magni itaque nobis exercitationem rerum, earum minus dolorem incidunt! Eius, maxime? Beatae expedita modi minus.
    Magnam harum sed repudiandae libero unde accusantium blanditiis, illo minus perspiciatis quae minima aut similique, eos autem nihil deserunt incidunt repellat laborum sunt labore eum voluptate! Doloremque aliquid quis dignissimos.
  </div>
}

export default App
