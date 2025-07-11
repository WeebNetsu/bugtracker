declare module 'meteor/edgee:slingshot' {
    export namespace Slingshot {
        export class Upload {
            constructor(uploadType: string, metaData?: any);

            send(
                file: File,
                callback: (error?: Error, url?: string) => void,
            ): void;
            progress(): number;
            xhr: XMLHttpRequest;
        }

        export function fileRestrictions(functionName: string, obj: any): any;
        export function createDirective(
            functionName: string,
            storage: any,
            obj: any,
        ): any;

        export const S3Storage: any;
    }
}
