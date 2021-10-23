type DrawRequest = {
    drawId: number,
    itemId: number
    amount: number,
    effectiveDate: string,
};

type ProcessedDraw = {
    drawId: number,
    order: number,
};

type ErroringDraw = {
    drawId: number,
    errorMessage: Array<string>,
}

type ProcessedDrawReturn = {
    successfullyProcessed: Array<ProcessedDraw>,
    errors: Array<ErroringDraw>,
};

type DrawRequestValidator = {
    drawId: Function,
    itemId: Function,
    amount: Function,
    effectiveDate: Function,
};
