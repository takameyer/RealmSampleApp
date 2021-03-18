import {ObjectId} from 'bson';
import {TodoItem, TodoList} from 'realms/TodoList';
import Realm from 'realm';

// jest.mock('realm', () => ({
//   App: {
//     constructor(args){
//       console.log("hello world")
//       jest.fn()
//     },
//     login() {
//       console.log("login")
//       jest.fn()
//     }
//   }
// }
// ))

describe('realm', () => {
  it('can handle linkingObject circular references', async () => {
    const Person = {
      name: 'Person',
      primaryKey: '_id',
      properties: {
        _id: 'objectId',
        name: 'string',
        bestFriend: 'Person',
        bestFriendOf: {
          type: 'linkingObjects',
          objectType: 'Person',
          property: 'bestFriend',
        },
      },
    };

    const realm = await Realm.open({schema: [Person], inMemory: true});

    realm.write(() => {
      const person1 = realm.create('Person', {
        _id: new ObjectId(),
        name: 'Jon',
      });
      const person2 = realm.create('Person', {
        _id: new ObjectId(),
        name: 'Andrew',
      });
      const person3 = realm.create('Person', {
        _id: new ObjectId(),
        name: 'Peter',
      });
      person1.bestFriend = person2;
      const persistedPerson1 = realm.objectForPrimaryKey('Person', person1._id);
      expect(persistedPerson1.bestFriend).toStrictEqual(person2);
      console.log('persisited person', persistedPerson1?.toJSON());
    });
    realm.close();
  });
  xit('can open sync without crashing', async () => {
    const openRealmCloud = new Realm.App({id: 'code-challenge-juedd'});
    const credentials = await Realm.Credentials.anonymous();
    const user = await openRealmCloud.logIn(credentials);
    console.log(user);
    const realm = await Realm.open({
      schema: [TodoList.schema, TodoItem.schema],
      sync: {user, partitionValue: new ObjectId(user.id)},
    });

    const lists = realm.objects('TodoList');
    expect(lists.length).toEqual(0);
    realm.write(() => {
      const list = realm.create('TodoList', {
        _id: new Realm.BSON.ObjectId(),
        name: 'new TodoList',
      });
      const list2 = realm.create('TodoList', {
        _id: new Realm.BSON.ObjectId(),
        name: 'new TodoList2',
      });
      list.items.push({
        _id: new ObjectId(),
        description: 'try it itäm 1',
        deadline: new Date(),
      });
      list.items.push({_id: new ObjectId(), description: 'item 2', done: true});
      list.items.push({
        _id: new ObjectId(),
        description: 'item 3',
        deadline: new Date(),
      });
      list.items.push({_id: new ObjectId(), description: 'item 4', done: true});
      list2.items.push(list.items[0]);
      list2.favoriteList = list;
      list.favoriteList = list2;
    });

    const lists2 = realm.objects('TodoList');
    expect(lists2.length).toEqual(2);
    realm.close();
    await user.logOut();
  });
});
