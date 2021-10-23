# Built Technologies Coding Challenge

## Question: Determine if a Draw can be processed

### Background:

Within Built, every Project has a Budget which has a collection of budgetItems.These budgetItems represent costs associated with construction.Users can request cash Draws against budgetItems.

### Problem:

Given the provided Budget and DrawRequests data, fill in the body for the processDraws function below.This function should return an array of all the drawIds that were successfully processed according to the following rules:

- BudgetItems cannot be overdrawn
- The Drawable amount for BudgetItems is determined by subtracting a BudgetItems fundedToDate from its originalAmount
- Draws have to be processed in order of effectiveDate

### Bonus 1

Modify the processDraws function to also update the Budget by reference according to the following rules:

- update each BudgetItem's fundedToDate appropriately
- update the Budget's balanceRemaining appropriately


### Bonus 2 (and example solution)

Add error handling to processDraws and change the return type to be an object with two keys:

1. "successfullyProcessed": contains all the drawIds that were successfully processed
2. "errors": contains an entry for each drawId that failed along with a message describing why it failed

Add the following data to drawRequests to trigger errors:

```
[
  { drawId : 8, itemId: 'nope', amount: 750, effectiveDate: '11/15/2015' },
  { drawId : 9, itemId: 1, amount: 10 },
  { drawId : 10, itemId: 2, amount: '100', effectiveDate: '10/31/2014' },
  { drawId : 11, itemId: 3, amount: 1, effectiveDate: 'A long long time ago...' },
  { drawId : 12, itemId: 1, amount: 100, effectiveDate: 10 / 31 / 2099 },
  { drawId : 13, itemId: 1, amount: -100000, effectiveDate: '11/8/2015' }
]
```

### Bonus 3 (and example solution)

Log a message for each BudgetItem that lists the order each Draw was processed in (a `console.log` is an appropriate way to display this message) or include this data in the return array.

Note: it is safe to assume that the Budget and every budgetItem will never have a remaining balance below zero.

### Self-Imposed Bonus 4

Since I decided to tackle the React version of this challenge, I created a separate branch, `tryhard-branch`, to show how I approach constructing React applications and to play around with using Mobx + Typescript.