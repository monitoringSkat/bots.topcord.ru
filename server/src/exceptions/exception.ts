class Exception {
    private readonly _jsonSpaces = 2
    constructor(
        private readonly message: string,
        private readonly statusCode: number
    ) {}
    public toString(): string {
        return JSON.stringify({ 
            message: this.message, 
            statusCode: this.statusCode 
        }, null, this._jsonSpaces)
    }
}

export default Exception