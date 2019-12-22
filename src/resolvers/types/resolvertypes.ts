export interface IResolver {
    [key: string]: {
        [key: string]: (parent: any, args: any, context: {}, info: any) => any;
    };
}