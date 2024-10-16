import { DataSet, Network, Options } from 'vis-network/standalone'
import { Edge, Node, TreeDate } from './types'
import { v4 as uuid } from 'uuid'

// @ts-ignore
export function initTree(
  treeData: TreeDate,
  container: HTMLElement,
  onNodeClick: () => void
): Network {
  const options = {
    layout: {
      hierarchical: {
        enabled: true,
        direction: 'UD',
        sortMethod: 'directed',
        nodeSpacing: 200,
      },
    },
    physics: false,
  } as Options
  const network = new Network(container, treeData, options)
  network.on('click', function (params) {
    if (params.nodes.length > 0) {
      onNodeClick()
      // const parent = treeData.nodes.stream([params.nodes[0]])
      //   .toItemArray()[0]
    }
  })

  return network
}

export function convertVisNodeToTreeNode(node: Node): any {
  return {
    key: node.label,
    description: node.description,
    nextStep: node.nextStep,
    price: node.price,
    nextMessage: node.nextMessage,
    children: [],
  }
}

export function convertTreeToVisData(tree: any): TreeDate {
  const nodes: Node[] = []
  const edges: Edge[] = []

  function read(parent: any, level: number) {
    nodes.push({
      id: parent.key,
      label: parent.label,
      description: parent.description,
      price: parent.price,
      nextStep: parent.nextStep,
      nextMessage: parent.nextMessage,
      level
    })
    if (parent.children) {
      for (const child of parent.children) {
        edges.push({ id: `${parent.key}_${child.key}`, from: parent.key, to: child.key })
        read(child, level + 1)
      }
    }
  }

  function populateLevel(parent: any) {
    if (!parent.label) {
      parent.label = parent.key
    }
    parent.key = uuid()
    if (parent.children) {
      for (const child of parent.children) {
        populateLevel(child)
      }
    }
  }

  populateLevel(tree)
  read(tree, 0)

  return {
    nodes: new DataSet(nodes),
    edges: new DataSet(edges),
  }
}

export function getTreeDataAsJson(treeData: TreeDate): any {
  const nodeMap = {}
  const nodeData: Node[] = treeData.nodes.get()
  const edgeData: Edge[] = treeData.edges.get()

  // Initialize a map of nodes
  nodeData.forEach(node => {
    // @ts-ignore
    nodeMap[node.id] = convertVisNodeToTreeNode(node)
  })

  // Build the tree based on edges
  edgeData.forEach(edge => {
    // @ts-ignore
    const parent = nodeMap[edge.from]
    // @ts-ignore
    const child = nodeMap[edge.to]
    parent.children.push(child) // Add child to parent's children array
  })

  // Find the root node (the one without any parent)
  let rootNode = null
  // @ts-ignore
  const childIds = new Set(edgeData.map(edge => edge.to))
  nodeData.forEach(node => {
    if (!childIds.has(node.id)) {
      // @ts-ignore
      rootNode = nodeMap[node.id]
    }
  })

  return rootNode
}
