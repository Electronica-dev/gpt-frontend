//data object which we get from the backend
export interface Result {
  result: {
    index: number,
    message: {
      role: string,
      content: string
    },
    finish_reason: string
  }
}