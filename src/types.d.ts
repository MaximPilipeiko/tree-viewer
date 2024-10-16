export type Node = {
  id: string
  label: string
  level: number
  description?: string
  nextStep?: string
  price?: string
  nextMessage?: string
}

export type Edge = {
  id: string
  from: string
  to: string
}

export type TreeDate = {
  nodes: DataSet<Node>
  edges: DataSet<Edge>
}

