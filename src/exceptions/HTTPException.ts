class HTTPException extends Error {
    constructor(public status: number, public details: any) {
        super(typeof details === 'object' ? JSON.stringify(details) : details);
    }
}

export default HTTPException;
