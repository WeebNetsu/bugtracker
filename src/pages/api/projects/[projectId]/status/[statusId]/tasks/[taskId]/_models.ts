// requests
export interface SpecificProjectStatusTaskPutRequestModel {
    data?: {
        /**
         * If moving statuses, this is the new status ID
         */
        statusId?: string;
        title?: string;
        description?: string;
        archived?: boolean;
        /**
         * The old (current) index of the card
         */
        oldOrder?: number;
        newOrder?: number;
    };
}

// responses
