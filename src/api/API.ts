class API {
    async fetchData(input: string) {
        const response = await fetch(input);
        // if no content in response
        if (response.status === 204) {
            return null;
        }
        const json = await response.json();

        if (response.ok) {
            return json;
        }
        throw new Error(json);
    };

    budgets = {
        get: (): Promise<any> => (
            Promise.resolve({
                amount : 126000,
                balanceRemaining : 108500,
                budgetItems : [
                    { itemId : 1, fundedToDate : 2500, originalAmount : 10000},
                    { itemId : 2, fundedToDate : 15000, originalAmount : 16000},
                    { itemId : 3, fundedToDate : 0, originalAmount : 100000},
                ],
            })
        ),
        drawRequests: (): Promise<any> => (
            Promise.resolve([
                { drawId : 1, itemId : 2, amount : 750, effectiveDate : '11/15/2015'},
                { drawId : 2, itemId : 1, amount : 2000, effectiveDate : '11/20/2015'},
                { drawId : 3, itemId : 3, amount : 50000, effectiveDate : '10/5/2015'},
                { drawId : 4, itemId : 3, amount : 60000, effectiveDate : '10/6/2015'},
                { drawId : 5, itemId : 2, amount : 500, effectiveDate : '10/31/2015'},
                { drawId : 6, itemId : 3, amount : 50000, effectiveDate : '10/7/2015'},
                { drawId : 7, itemId : 2, amount : 1000, effectiveDate : '11/16/2015'},
                { drawId : 8, itemId: 'nope', amount: 750, effectiveDate: '11/15/2015' },
                { drawId : 9, itemId: 1, amount: 10 },
                { drawId : 10, itemId: 2, amount: '100', effectiveDate: '10/31/2014' },
                { drawId : 11, itemId: 3, amount: 1, effectiveDate: 'A long long time ago...' },
                { drawId : 12, itemId: 1, amount: 100, effectiveDate: 10 / 31 / 2099 },
                { drawId : 13, itemId: 1, amount: -100000, effectiveDate: '11/8/2015' },
            ])
        ),
    };
}

export default API;
