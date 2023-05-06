import { ReactNode } from "react";

export interface ReactComponentProps {
	history?: any;
	location?: any;
	match?: {
		params?: any;
		path: string;
	};
	staticContext?: any;
	children?: ReactNode;
}

export interface SearchableObject {
	[index: string]: any;
}

/* export interface MongoDBOptions {
    sort?: Mongo.SortSpecifier | undefined;
    skip?: number | undefined;
    limit?: number | undefined;
    fields?: Mongo.FieldSpecifier | undefined;
    reactive?: boolean | undefined;
    transform?: Function | undefined;
}

export type MongoDBSelector = string | Mongo.Selector | Mongo.ObjectID;
 */
