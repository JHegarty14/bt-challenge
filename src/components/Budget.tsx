import React from "react";
import { observer } from "mobx-react";
import { v4 as uuidv4 } from "uuid";

import budgetDataStore from "../stores";

const Budget = observer(() => {
    const { successfulDrawRequests, erroringDrawRequests } = budgetDataStore;

    return (
        <span>
            <div>
                Successes
                {successfulDrawRequests.map((success: ProcessedDraw) => (
                    <div key={uuidv4()}>
                        <span>
                            Draw ID: {success.drawId}
                        </span>
                        &nbsp;
                        <span>
                            Order: {success.order}
                        </span>
                    </div>
                ))}
            </div>
            &nbsp;
            <div>
                Errors
                {erroringDrawRequests.map((error: ErroringDraw) => (
                    <div key={uuidv4()}>
                        <span>
                            Draw ID: {error.drawId}
                        </span>
                        &nbsp;
                        <span>
                            Error Messages: {error.errorMessage.map((msg: string) => (
                                <div key={msg}>{msg}</div>
                            ))}
                        </span>
                    </div>
                ))}
            </div>
        </span>
    );
});

export default Budget;
