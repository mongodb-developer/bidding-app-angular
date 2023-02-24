import { from, Observable } from 'rxjs';
import { DocumentUpdate } from './helpers/documentUpdate';

export function extractUpdate(source: Observable<any>) {
  return new Observable<DocumentUpdate<any>>((subscriber) => {
    const subscription = source.subscribe({
      next: (value: Realm.Services.MongoDB.ChangeEvent<any>) => {
        if (value?.operationType === 'update') {
          const _id = value.documentKey?._id;
          const updateDescription = value.updateDescription || {};
          subscriber.next({ _id, updateDescription });
        }
      },
      error: (e) => {
        subscriber.error(e);
      },
      complete: () => {
        subscriber.complete();
      },
    });

    return () => {
      subscription?.unsubscribe();
    };
  });
}

export function fromChangeEvent(source: AsyncGenerator<Realm.Services.MongoDB.ChangeEvent<any>>)
  : Observable<Realm.Services.MongoDB.ChangeEvent<any>> {

  return new Observable(subscriber => {
    const subscription = from(source).subscribe({
      next(value) {
        subscriber.next(value);
      },
      error(error) {
        subscriber.error(error);
      },
      complete() {
        subscriber.complete();
      }
    })

    return () => {
      // Stop the collection watcher
      source.return(undefined);

      subscription.unsubscribe();
    };
  });
}
