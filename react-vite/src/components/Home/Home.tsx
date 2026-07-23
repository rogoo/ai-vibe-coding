import { useState } from 'react'
import './Home.css'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <section className="home">
      <h1>Home</h1>
      <p>A simple counter, driven by React state.</p>
      <button
        type="button"
        className="counter"
        onClick={() => setCount((current) => current + 1)}
      >
        Count is {count}
      </button>
    </section>
  )
}

export default Home
