import { Button } from "@knicos/genai-base"
import { useState } from "react"

function ButtonTest() {
  const [count, setCount] = useState(0)

  const handleSetCount = () => {
    setCount(count + 1)
    console.log(count)
  }

  return (
    <Button onClick={() => handleSetCount()} size="large" variant="contained">
      testi
    </Button>
  )
}

export default ButtonTest
