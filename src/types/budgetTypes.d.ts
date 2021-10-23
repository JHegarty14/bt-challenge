type Budget = {
    amount: number,
    balanceRemaining: number,
    budgetItems: Array<BudgetItem>,
};

type BudgetItem = {
    itemId: number,
    fundedToDate: number,
    originalAmount: number,
};
