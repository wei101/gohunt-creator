import { useState } from "react"
import Button from "../components/Button"
import StepBar from "../components/StepBar"

function Creator() {

  const [c, setC] = useState(1)
  const inc = () => setC(c + 1)
  return (
    <div>
      <StepBar count={5} current={c} />
      <Button onClick={inc}>Go</Button>
    </div>
  )
}

export default Creator
