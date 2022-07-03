import { Bar } from "./bar";

export class Foo {
  constructor(private _bar = new Bar()) {}

  foo() {
    this._bar.bar();
  }

  loaf() {
    this.foo();
  }
}
