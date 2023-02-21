export type DocumentUpdate<T extends Realm.Services.MongoDB.Document<any>> =
    Pick<Realm.Services.MongoDB.UpdateEvent<T>, "_id" | "updateDescription" >;
