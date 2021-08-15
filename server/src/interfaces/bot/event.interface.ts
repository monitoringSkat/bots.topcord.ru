interface Event {
    name: string
    execute: (...args: any) => void | any
}

export default Event
