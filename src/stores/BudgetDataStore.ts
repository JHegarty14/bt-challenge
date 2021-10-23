import { action, IObservableArray, observable } from "mobx";
import api from "../api";

class BudgetDataStore {

    @observable budget: Budget = {
        amount: 0,
        balanceRemaining: 0,
        budgetItems: [],
    }

    successfulDrawRequests: IObservableArray<ProcessedDraw> = observable([]);
    erroringDrawRequests: IObservableArray<ErroringDraw> = observable([]);

    /**
     * Sets budget with updated data from processDraws
     * @param {Budget} data
     */
    @action
    setBudget = (data: Budget): void => {
        this.budget = data;
    }

    /**
     * Sets successfully processed requests
     * @param {Array<ProcessedDraw>} data
     */
    @action
    setSuccessfulDrawRequests = (data: Array<ProcessedDraw>): void => {
        this.successfulDrawRequests.replace(data);
    }

    /**
     * Sets erroring draw requests
     * @param {Array<ErroringDraw>} data 
     */
    @action
    setErroringDrawRequests = (data: Array<ErroringDraw>): void => {
        this.erroringDrawRequests.replace(data);
    }

    /**
     * Sorts array of draw requests by effective date
     * @param {Array} drawRequests array of draw requests to be sorted
     * @returns {Array} sorted draw requests
     */
    sortDrawRequests = (drawRequests: Array<DrawRequest>): Array<DrawRequest> => {
        return drawRequests.sort((a, b) => Date.parse(a.effectiveDate) - Date.parse(b.effectiveDate));
    }

    /**
     * Creates updated copy of the component state. Tracks changes to the budget
     * as a result of processed draw requests
     *
     * @param {Object} budget copy of this.state
     * @param {Number} itemId id of the budget item that a draw request was just processed for
     * @param {Number} amount dollar value of the processed draw request
     * @returns {Object} updated copy of this.state
     */
    updateBudgetCopy = (budget: Budget, itemId: number, amount: number): Budget => {
        const newBudget = { ...budget };
        const budgetItemIndex = newBudget.budgetItems.findIndex((item: BudgetItem) => item.itemId === itemId);
        const updatedFunding = newBudget.budgetItems[budgetItemIndex].fundedToDate + amount;

        newBudget.balanceRemaining -= amount;
        newBudget.budgetItems[budgetItemIndex].fundedToDate = updatedFunding;

        return newBudget;
    }

    /**
     * Determines if a draw request is valid based on drawable budget for a given
     * budget item, and if so, processes the request
     *
     * @param {Array} drawRequests array of draw requests to be processed
     * @returns {Object} object with arrays of successful draw requests and error
     */
    processDraws = (drawRequests: Array<DrawRequest>): ProcessedDrawReturn => {
        let budgetState = { ...this.budget };
        const successfullyProcessed: Array<ProcessedDraw> = [];
        const errors: Array<ErroringDraw> = []
        const sortedDrawRequests = this.sortDrawRequests(drawRequests);

        sortedDrawRequests.forEach((request, index) => {
            let validationErrors = this.validateDrawItem(request);

            if (validationErrors.length < 1) {
                let budget = budgetState.budgetItems.find(item => item.itemId === request.itemId);
                if (budget) {
                    let drawableAmount = budget.originalAmount - budget.fundedToDate;

                    if (drawableAmount >= request.amount) {
                        successfullyProcessed.push({
                            drawId: request.drawId,
                            order: index + 1,
                        });
                        budgetState = this.updateBudgetCopy(budgetState, request.itemId, request.amount);
                    }
                    else {
                        errors.push({
                            drawId: request.drawId,
                            errorMessage: [`Processing this draw request will overdraft budget ${budget.itemId}.`],
                        });
                    }
                }
                else {
                    errors.push({
                        drawId: request.drawId,
                        errorMessage: [`item with ID ${request.itemId} not found.`]
                    })
                }
            }
            else {
                errors.push({
                    drawId: request.drawId,
                    errorMessage: validationErrors,
                });
            }
        });

        this.setBudget({ ...budgetState });
        return {
            successfullyProcessed,
            errors,
        };
    }

    /**
     * Logic to validate keys of an incoming draw request
     *
     * @param {Object} drawRequest drawRequest to be validated
     * @returns {Array} array of error messages, if any
     */
    validateDrawItem = (drawRequest: DrawRequest): Array<string> => {
        const validators: DrawRequestValidator = {
            drawId: (val: number) => typeof val !== "number" ? "drawId is invalid. Not a number." : null,
            itemId: (val: number) => {
                if (typeof val !== "number") return "itemId is invalid. Not a number";
                if (!this.budget.budgetItems.find((item: BudgetItem) => item.itemId === val)) return "No budget item matching request itemId found.";
                return null;
            },
            amount: (val: number) => {
                if (typeof val !== "number") return "amount is invalid. Not a number.";
                if (val <= 0) return "amount is invalid. Must be a positive value.";
                return null;
            },
            effectiveDate: (val: string) => {
                if (typeof val !== "string" || (typeof val === "string" && !val.match(/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/\d{4}/g))) {
                    return "effectiveDate is invalid. Must be a string matching MM/DD/YYYY or MM/D/YYYY.";
                }
                return null;
            },
        };
        const errors: Array<string> = [];

        Object.keys(drawRequest).forEach((key: string) => {
            const validatorFunc: Function = validators[key as keyof DrawRequestValidator];
            const errorMsg: string = validatorFunc(drawRequest[key as keyof DrawRequest]);
            if (errorMsg) errors.push(errorMsg);
        });

        return errors;
    }

    /**
     * Method to fetch data from API. In a real app this would be called by router middleware
     * 
     * @returns {Promise}
     */
    @action
    preload = async (): Promise<any> => {
        try {
            // mocking API calls and return list of draw requests
            const budgetsRes: Budget = await api.budgets.get();
            const drawRequestRes: Array<DrawRequest> = await api.budgets.drawRequests();
            this.setBudget(budgetsRes);
            const { successfullyProcessed, errors }: ProcessedDrawReturn = this.processDraws(drawRequestRes);
            this.setSuccessfulDrawRequests(successfullyProcessed);
            this.setErroringDrawRequests(errors);

            return Promise.resolve();
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
}

export default BudgetDataStore;
