import { deepEqual, notEqual, equal } from 'assert';
import makeConfig from '../src/utils/makeConfig';
import { assert } from 'console';

describe('makeConfig()', () => {
  it('Basic config merging', () => {
    const defConfig: any = {
      number: 10,
      string: 'text',
      bool: false,
      nullable: null,
      arr: [1],
    };

    const config = makeConfig(defConfig, {});

    notEqual(defConfig, config);
    deepEqual(config, defConfig);

    const config2 = makeConfig(defConfig, {
      number: 20,
      string: 'text2',
      bool: true,
      nullable: {},
      arr: [2],
    });

    deepEqual(config2, {
      number: 20,
      string: 'text2',
      bool: true,
      nullable: {},
      arr: [2],
    });

    deepEqual(defConfig, {
      number: 10,
      string: 'text',
      bool: false,
      nullable: null,
      arr: [1],
    });
  });

  it('Recursive config merging', () => {
    const defConfig: any = {
      foo: 10,
      bar: 10,
      child: {
        child: {
          foo: 30,
          bar: 30,
        },
        foo: 20,
        bar: 20,
      },
    };

    const config = makeConfig(defConfig, {
      bar: 15,
      child: {
        child: {
          foo: 35,
        },
      },
    });

    deepEqual(config, {
      foo: 10,
      bar: 15,
      child: {
        child: {
          foo: 35,
          bar: 30,
        },
        foo: 20,
        bar: 20,
      },
    });
  });

  it('Non basic objects are not merged', () => {
    class Foo {
      constructor(public bar: number, public baz?: string) {}
    }

    const foo = new Foo(10, 'text');
    const defConfig: any = {
      foo,
      bar: 10,
    };

    const foo2 = new Foo(20);
    const config = makeConfig(defConfig, { foo: foo2 });

    equal(config.bar, 10);
    equal(config.foo, foo2);
    equal(config.foo.bar, 20);
    assert(config.foo.baz == null);
  });

  it('Custom config is also added.', () => {
    const defConfig: any = {
      foo: 10,
      child: {
        bar: 20,
      },
    };

    const config = makeConfig(defConfig, {
      bar: 15,
      child: {
        foo: 25,
        child: {
          bar: 35,
        },
      },
    });

    deepEqual(config, {
      foo: 10,
      child: {
        bar: 20,
        foo: 25,
        child: {
          bar: 35,
        },
      },
      bar: 15,
    });
  });
});
