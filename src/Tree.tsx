import React, { useEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { DataSet, Network } from 'vis-network/standalone'
import { Edge, Node, TreeDate } from './types'
import { convertTreeToVisData, getTreeDataAsJson, initTree } from './utils'
import NodeDialog from './NodeDialog'


type Props = {}

function Tree(props: Props): React.JSX.Element {
  const treeRef = useRef<HTMLDivElement | null>(null)
  const [tree, setTree] = useState({ key: 'Start' })
  const [network, setNetwork] = useState<Network | null>(null)
  const [isNodeDetailsDialogOpened, setIsNodeDetailsDialogOpened] = useState(false)

  const treeData: TreeDate = useMemo(() => convertTreeToVisData(tree), [tree])

  useEffect(() => {
    if (!treeRef.current) {
      return
    }

    setNetwork(
      initTree(treeData, treeRef.current!, () => setIsNodeDetailsDialogOpened(true)),
    )
  }, [treeData])

  function downloadTree() {
    const element = document.createElement('a')
    let treeAsJson = getTreeDataAsJson(treeData)
    const file = new Blob([JSON.stringify(treeAsJson, null, 2)], { type: 'application/json' })
    element.href = URL.createObjectURL(file)
    element.download = 'tree.json'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result
        if (content) {
          const treeData = JSON.parse(content as string)
          setTree(treeData)
        }
      }
      reader.readAsText(file)
    }
  }

  function addNewNode(parent: Node) {
    const newNodeId = uuid()
    treeData.nodes.add({ id: newNodeId, label: 'New Node', level: parent.level + 1 })
    treeData.edges.add({ id: `${parent.id}_${newNodeId}`, from: parent.id, to: newNodeId })
  }

  function updateNode(node: Node) {
    treeData.nodes.update(node)
  }

  function removeNode(node: Node) {
    treeData.nodes.remove(node.id)
  }

  return <div style={{ height: '100%', width: '100%' }}>
    {isNodeDetailsDialogOpened && (
      <NodeDialog
        node={treeData.nodes.get(network?.getSelectedNodes()[0]) as Node}
        updateNode={updateNode}
        addNewNode={addNewNode}
        removeNode={removeNode}
        closeDialog={() => setIsNodeDetailsDialogOpened(false)} />
    )}
    <button onClick={downloadTree}>Download tree</button>
    <div style={{ paddingTop: '8px' }}>
      <label htmlFor="file-upload">Upload tree: </label>
      <input type="file" accept=".json" onChange={handleFileUpload} />
    </div>
    <div style={{ height: '100%', width: isNodeDetailsDialogOpened ? '0' : '100%' }}>
      <div className="tree" id="tree" ref={treeRef}></div>
    </div>
  </div>
}

export default Tree
