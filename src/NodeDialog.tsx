import React, { useState } from 'react'
import { Node } from './types'

type Props = {
  node: Node
  removeNode(node: Node): void
  updateNode(node: Node): void
  addNewNode(parent: Node): void
  closeDialog(): void
}

function NodeDialog(props: Props): React.JSX.Element {
  const [formData, setFormData] = useState({
    key: props.node.label,
    description: props.node.description,
    nextStep: props.node.nextStep,
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    props.updateNode({
      ...props.node,
      label: formData.key,
      description: formData.description,
      nextStep: formData.nextStep,
    })
    props.closeDialog()
  }

  function handleAddNewNode() {
    props.addNewNode(props.node)
    props.closeDialog()
  }

  function handleRemoveNode() {
    props.removeNode(props.node)
    props.closeDialog()
  }

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h2>Node details</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Key:
            </label>
            <input
              type="text"
              name="key"
              value={formData.key}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>
              Description:
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>
              Next Step:
              <input
                type="text"
                name="nextStep"
                value={formData.nextStep}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <button type="button" onClick={handleAddNewNode}>Add new child node</button>
            <button type="submit">Save</button>
            <button type="button" onClick={handleRemoveNode}>Delete</button>
            <button type="button" onClick={props.closeDialog}>Close</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NodeDialog
