interface QueueNode<T> {
  value: T
  next?: QueueNode<T>
}

export default class Queue<T> {
  private first?: QueueNode<T>
  private last?: QueueNode<T>
  private count: number

  constructor(...vals: T[]) {
    this.count = 0
    if (vals.length === 0) return
    vals.forEach((val) => this.push(val))
  }

  push(...values: T[]) {
    values.forEach((value) => {
      const nextLast: QueueNode<T> = { value }
      if (this.last === undefined) {
        this.last = nextLast
        this.first = this.last
      } else {
        this.last.next = nextLast
        this.last = nextLast
      }
      this.count++
    })
  }

  pop() {
    const result = this.first?.value
    if (this.first) {
      this.first = this.first.next
      if (!this.first) {
        this.last = undefined
      }
    }
    this.count--
    return result
  }

  size() {
    return this.count
  }

  peek() {
    return this.first?.value
  }
}
