import React from 'react'
import './App.css'
import tree from './tree.json'
import Tree from './Tree'

function App() {
  console.log(tree)
  return (
    <div className="App">
      <Tree />
    </div>
  )
}

export default App
