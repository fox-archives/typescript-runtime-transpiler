"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.assert = exports.AssertionTypeDescription = exports.TypeName = void 0;
/// <reference lib="es2018"/>
/// <reference lib="dom"/>
/// <reference types="node"/>
let TypeName;
exports.TypeName = TypeName;

(function (TypeName) {
  TypeName["null"] = "null";
  TypeName["boolean"] = "boolean";
  TypeName["undefined"] = "undefined";
  TypeName["string"] = "string";
  TypeName["number"] = "number";
  TypeName["bigint"] = "bigint";
  TypeName["symbol"] = "symbol";
  TypeName["Function"] = "Function";
  TypeName["Generator"] = "Generator";
  TypeName["AsyncGenerator"] = "AsyncGenerator";
  TypeName["GeneratorFunction"] = "GeneratorFunction";
  TypeName["AsyncGeneratorFunction"] = "AsyncGeneratorFunction";
  TypeName["AsyncFunction"] = "AsyncFunction";
  TypeName["Observable"] = "Observable";
  TypeName["Array"] = "Array";
  TypeName["Buffer"] = "Buffer";
  TypeName["Object"] = "Object";
  TypeName["RegExp"] = "RegExp";
  TypeName["Date"] = "Date";
  TypeName["Error"] = "Error";
  TypeName["Map"] = "Map";
  TypeName["Set"] = "Set";
  TypeName["WeakMap"] = "WeakMap";
  TypeName["WeakSet"] = "WeakSet";
  TypeName["Int8Array"] = "Int8Array";
  TypeName["Uint8Array"] = "Uint8Array";
  TypeName["Uint8ClampedArray"] = "Uint8ClampedArray";
  TypeName["Int16Array"] = "Int16Array";
  TypeName["Uint16Array"] = "Uint16Array";
  TypeName["Int32Array"] = "Int32Array";
  TypeName["Uint32Array"] = "Uint32Array";
  TypeName["Float32Array"] = "Float32Array";
  TypeName["Float64Array"] = "Float64Array";
  TypeName["BigInt64Array"] = "BigInt64Array";
  TypeName["BigUint64Array"] = "BigUint64Array";
  TypeName["ArrayBuffer"] = "ArrayBuffer";
  TypeName["SharedArrayBuffer"] = "SharedArrayBuffer";
  TypeName["DataView"] = "DataView";
  TypeName["Promise"] = "Promise";
  TypeName["URL"] = "URL";
})(TypeName || (exports.TypeName = TypeName = {}));

const {
  toString
} = Object.prototype;

const isOfType = type => value => typeof value === type;

const getObjectType = value => {
  const objectName = toString.call(value).slice(8, -1);

  if (objectName) {
    return objectName;
  }

  return undefined;
};

const isObjectOfType = type => value => getObjectType(value) === type;

function is(value) {
  switch (value) {
    case null:
      return TypeName.null;

    case true:
    case false:
      return TypeName.boolean;

    default:
  }

  switch (typeof value) {
    case 'undefined':
      return TypeName.undefined;

    case 'string':
      return TypeName.string;

    case 'number':
      return TypeName.number;

    case 'bigint':
      return TypeName.bigint;

    case 'symbol':
      return TypeName.symbol;

    default:
  }

  if (is.function_(value)) {
    return TypeName.Function;
  }

  if (is.observable(value)) {
    return TypeName.Observable;
  }

  if (is.array(value)) {
    return TypeName.Array;
  }

  if (is.buffer(value)) {
    return TypeName.Buffer;
  }

  const tagType = getObjectType(value);

  if (tagType) {
    return tagType;
  }

  if (value instanceof String || value instanceof Boolean || value instanceof Number) {
    throw new TypeError('Please don\'t use object wrappers for primitive types');
  }

  return TypeName.Object;
}

is.undefined = isOfType('undefined');
is.string = isOfType('string');
const isNumberType = isOfType('number');

is.number = value => isNumberType(value) && !is.nan(value);

is.bigint = isOfType('bigint'); // eslint-disable-next-line @typescript-eslint/ban-types

is.function_ = isOfType('function');

is.null_ = value => value === null;

is.class_ = value => is.function_(value) && value.toString().startsWith('class ');

is.boolean = value => value === true || value === false;

is.symbol = isOfType('symbol');

is.numericString = value => is.string(value) && !is.emptyStringOrWhitespace(value) && !Number.isNaN(Number(value));

is.array = Array.isArray;

is.buffer = value => value?.constructor?.isBuffer?.(value) ?? false;

is.nullOrUndefined = value => is.null_(value) || is.undefined(value);

is.object = value => !is.null_(value) && (typeof value === 'object' || is.function_(value));

is.iterable = value => is.function_(value?.[Symbol.iterator]);

is.asyncIterable = value => is.function_(value?.[Symbol.asyncIterator]);

is.generator = value => is.iterable(value) && is.function_(value.next) && is.function_(value.throw);

is.asyncGenerator = value => is.asyncIterable(value) && is.function_(value.next) && is.function_(value.throw);

is.nativePromise = value => isObjectOfType(TypeName.Promise)(value);

const hasPromiseAPI = value => is.function_(value?.then) && is.function_(value?.catch);

is.promise = value => is.nativePromise(value) || hasPromiseAPI(value);

is.generatorFunction = isObjectOfType(TypeName.GeneratorFunction);

is.asyncGeneratorFunction = value => getObjectType(value) === TypeName.AsyncGeneratorFunction;

is.asyncFunction = value => getObjectType(value) === TypeName.AsyncFunction; // eslint-disable-next-line no-prototype-builtins, @typescript-eslint/ban-types


is.boundFunction = value => is.function_(value) && !value.hasOwnProperty('prototype');

is.regExp = isObjectOfType(TypeName.RegExp);
is.date = isObjectOfType(TypeName.Date);
is.error = isObjectOfType(TypeName.Error);

is.map = value => isObjectOfType(TypeName.Map)(value);

is.set = value => isObjectOfType(TypeName.Set)(value);

is.weakMap = value => isObjectOfType(TypeName.WeakMap)(value);

is.weakSet = value => isObjectOfType(TypeName.WeakSet)(value);

is.int8Array = isObjectOfType(TypeName.Int8Array);
is.uint8Array = isObjectOfType(TypeName.Uint8Array);
is.uint8ClampedArray = isObjectOfType(TypeName.Uint8ClampedArray);
is.int16Array = isObjectOfType(TypeName.Int16Array);
is.uint16Array = isObjectOfType(TypeName.Uint16Array);
is.int32Array = isObjectOfType(TypeName.Int32Array);
is.uint32Array = isObjectOfType(TypeName.Uint32Array);
is.float32Array = isObjectOfType(TypeName.Float32Array);
is.float64Array = isObjectOfType(TypeName.Float64Array);
is.bigInt64Array = isObjectOfType(TypeName.BigInt64Array);
is.bigUint64Array = isObjectOfType(TypeName.BigUint64Array);
is.arrayBuffer = isObjectOfType(TypeName.ArrayBuffer);
is.sharedArrayBuffer = isObjectOfType(TypeName.SharedArrayBuffer);
is.dataView = isObjectOfType(TypeName.DataView);

is.directInstanceOf = (instance, class_) => Object.getPrototypeOf(instance) === class_.prototype;

is.urlInstance = value => isObjectOfType(TypeName.URL)(value);

is.urlString = value => {
  if (!is.string(value)) {
    return false;
  }

  try {
    new URL(value); // eslint-disable-line no-new

    return true;
  } catch {
    return false;
  }
}; // TODO: Use the `not` operator with a type guard here when it's available.
// Example: `is.truthy = (value: unknown): value is (not false | not 0 | not '' | not undefined | not null) => Boolean(value);`


is.truthy = value => Boolean(value); // Example: `is.falsy = (value: unknown): value is (not true | 0 | '' | undefined | null) => Boolean(value);`


is.falsy = value => !value;

is.nan = value => Number.isNaN(value);

const primitiveTypeOfTypes = new Set(['undefined', 'string', 'number', 'bigint', 'boolean', 'symbol']); // TODO: This should be able to be `not object` when the `not` operator is out

is.primitive = value => is.null_(value) || primitiveTypeOfTypes.has(typeof value);

is.integer = value => Number.isInteger(value);

is.safeInteger = value => Number.isSafeInteger(value);

is.plainObject = value => {
  // From: https://github.com/sindresorhus/is-plain-obj/blob/master/index.js
  if (getObjectType(value) !== TypeName.Object) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.getPrototypeOf({});
};

const typedArrayTypes = new Set([TypeName.Int8Array, TypeName.Uint8Array, TypeName.Uint8ClampedArray, TypeName.Int16Array, TypeName.Uint16Array, TypeName.Int32Array, TypeName.Uint32Array, TypeName.Float32Array, TypeName.Float64Array, TypeName.BigInt64Array, TypeName.BigUint64Array]);

is.typedArray = value => {
  const objectType = getObjectType(value);

  if (objectType === undefined) {
    return false;
  }

  return typedArrayTypes.has(objectType);
};

const isValidLength = value => is.safeInteger(value) && value >= 0;

is.arrayLike = value => !is.nullOrUndefined(value) && !is.function_(value) && isValidLength(value.length);

is.inRange = (value, range) => {
  if (is.number(range)) {
    return value >= Math.min(0, range) && value <= Math.max(range, 0);
  }

  if (is.array(range) && range.length === 2) {
    return value >= Math.min(...range) && value <= Math.max(...range);
  }

  throw new TypeError(`Invalid range: ${JSON.stringify(range)}`);
};

const NODE_TYPE_ELEMENT = 1;
const DOM_PROPERTIES_TO_CHECK = ['innerHTML', 'ownerDocument', 'style', 'attributes', 'nodeValue'];

is.domElement = value => is.object(value) && value.nodeType === NODE_TYPE_ELEMENT && is.string(value.nodeName) && !is.plainObject(value) && DOM_PROPERTIES_TO_CHECK.every(property => property in value);

is.observable = value => {
  if (!value) {
    return false;
  } // eslint-disable-next-line no-use-extend-native/no-use-extend-native


  if (value === value[Symbol.observable]?.()) {
    return true;
  }

  if (value === value['@@observable']?.()) {
    return true;
  }

  return false;
};

is.nodeStream = value => is.object(value) && is.function_(value.pipe) && !is.observable(value);

is.infinite = value => value === Infinity || value === -Infinity;

const isAbsoluteMod2 = remainder => value => is.integer(value) && Math.abs(value % 2) === remainder;

is.evenInteger = isAbsoluteMod2(0);
is.oddInteger = isAbsoluteMod2(1);

is.emptyArray = value => is.array(value) && value.length === 0;

is.nonEmptyArray = value => is.array(value) && value.length > 0;

is.emptyString = value => is.string(value) && value.length === 0; // TODO: Use `not ''` when the `not` operator is available.


is.nonEmptyString = value => is.string(value) && value.length > 0;

const isWhiteSpaceString = value => is.string(value) && !/\S/.test(value);

is.emptyStringOrWhitespace = value => is.emptyString(value) || isWhiteSpaceString(value);

is.emptyObject = value => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length === 0; // TODO: Use `not` operator here to remove `Map` and `Set` from type guard:
// - https://github.com/Microsoft/TypeScript/pull/29317


is.nonEmptyObject = value => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length > 0;

is.emptySet = value => is.set(value) && value.size === 0;

is.nonEmptySet = value => is.set(value) && value.size > 0;

is.emptyMap = value => is.map(value) && value.size === 0;

is.nonEmptyMap = value => is.map(value) && value.size > 0;

const predicateOnArray = (method, predicate, values) => {
  if (!is.function_(predicate)) {
    throw new TypeError(`Invalid predicate: ${JSON.stringify(predicate)}`);
  }

  if (values.length === 0) {
    throw new TypeError('Invalid number of values');
  }

  return method.call(values, predicate);
};

is.any = (predicate, ...values) => {
  const predicates = is.array(predicate) ? predicate : [predicate];
  return predicates.some(singlePredicate => predicateOnArray(Array.prototype.some, singlePredicate, values));
};

is.all = (predicate, ...values) => predicateOnArray(Array.prototype.every, predicate, values);

const assertType = (condition, description, value) => {
  if (!condition) {
    throw new TypeError(`Expected value which is \`${description}\`, received value of type \`${is(value)}\`.`);
  }
};

let AssertionTypeDescription; // Type assertions have to be declared with an explicit type.

exports.AssertionTypeDescription = AssertionTypeDescription;

(function (AssertionTypeDescription) {
  AssertionTypeDescription["class_"] = "Class";
  AssertionTypeDescription["numericString"] = "string with a number";
  AssertionTypeDescription["nullOrUndefined"] = "null or undefined";
  AssertionTypeDescription["iterable"] = "Iterable";
  AssertionTypeDescription["asyncIterable"] = "AsyncIterable";
  AssertionTypeDescription["nativePromise"] = "native Promise";
  AssertionTypeDescription["urlString"] = "string with a URL";
  AssertionTypeDescription["truthy"] = "truthy";
  AssertionTypeDescription["falsy"] = "falsy";
  AssertionTypeDescription["nan"] = "NaN";
  AssertionTypeDescription["primitive"] = "primitive";
  AssertionTypeDescription["integer"] = "integer";
  AssertionTypeDescription["safeInteger"] = "integer";
  AssertionTypeDescription["plainObject"] = "plain object";
  AssertionTypeDescription["arrayLike"] = "array-like";
  AssertionTypeDescription["typedArray"] = "TypedArray";
  AssertionTypeDescription["domElement"] = "Element";
  AssertionTypeDescription["nodeStream"] = "Node.js Stream";
  AssertionTypeDescription["infinite"] = "infinite number";
  AssertionTypeDescription["emptyArray"] = "empty array";
  AssertionTypeDescription["nonEmptyArray"] = "non-empty array";
  AssertionTypeDescription["emptyString"] = "empty string";
  AssertionTypeDescription["nonEmptyString"] = "non-empty string";
  AssertionTypeDescription["emptyStringOrWhitespace"] = "empty string or whitespace";
  AssertionTypeDescription["emptyObject"] = "empty object";
  AssertionTypeDescription["nonEmptyObject"] = "non-empty object";
  AssertionTypeDescription["emptySet"] = "empty set";
  AssertionTypeDescription["nonEmptySet"] = "non-empty set";
  AssertionTypeDescription["emptyMap"] = "empty map";
  AssertionTypeDescription["nonEmptyMap"] = "non-empty map";
  AssertionTypeDescription["evenInteger"] = "even integer";
  AssertionTypeDescription["oddInteger"] = "odd integer";
  AssertionTypeDescription["directInstanceOf"] = "T";
  AssertionTypeDescription["inRange"] = "in range";
  AssertionTypeDescription["any"] = "predicate returns truthy for any value";
  AssertionTypeDescription["all"] = "predicate returns truthy for all values";
})(AssertionTypeDescription || (exports.AssertionTypeDescription = AssertionTypeDescription = {}));

const assert = {
  // Unknowns.
  undefined: value => assertType(is.undefined(value), TypeName.undefined, value),
  string: value => assertType(is.string(value), TypeName.string, value),
  number: value => assertType(is.number(value), TypeName.number, value),
  bigint: value => assertType(is.bigint(value), TypeName.bigint, value),
  // eslint-disable-next-line @typescript-eslint/ban-types
  function_: value => assertType(is.function_(value), TypeName.Function, value),
  null_: value => assertType(is.null_(value), TypeName.null, value),
  class_: value => assertType(is.class_(value), AssertionTypeDescription.class_, value),
  boolean: value => assertType(is.boolean(value), TypeName.boolean, value),
  symbol: value => assertType(is.symbol(value), TypeName.symbol, value),
  numericString: value => assertType(is.numericString(value), AssertionTypeDescription.numericString, value),
  array: value => assertType(is.array(value), TypeName.Array, value),
  buffer: value => assertType(is.buffer(value), TypeName.Buffer, value),
  nullOrUndefined: value => assertType(is.nullOrUndefined(value), AssertionTypeDescription.nullOrUndefined, value),
  object: value => assertType(is.object(value), TypeName.Object, value),
  iterable: value => assertType(is.iterable(value), AssertionTypeDescription.iterable, value),
  asyncIterable: value => assertType(is.asyncIterable(value), AssertionTypeDescription.asyncIterable, value),
  generator: value => assertType(is.generator(value), TypeName.Generator, value),
  asyncGenerator: value => assertType(is.asyncGenerator(value), TypeName.AsyncGenerator, value),
  nativePromise: value => assertType(is.nativePromise(value), AssertionTypeDescription.nativePromise, value),
  promise: value => assertType(is.promise(value), TypeName.Promise, value),
  generatorFunction: value => assertType(is.generatorFunction(value), TypeName.GeneratorFunction, value),
  asyncGeneratorFunction: value => assertType(is.asyncGeneratorFunction(value), TypeName.AsyncGeneratorFunction, value),
  // eslint-disable-next-line @typescript-eslint/ban-types
  asyncFunction: value => assertType(is.asyncFunction(value), TypeName.AsyncFunction, value),
  // eslint-disable-next-line @typescript-eslint/ban-types
  boundFunction: value => assertType(is.boundFunction(value), TypeName.Function, value),
  regExp: value => assertType(is.regExp(value), TypeName.RegExp, value),
  date: value => assertType(is.date(value), TypeName.Date, value),
  error: value => assertType(is.error(value), TypeName.Error, value),
  map: value => assertType(is.map(value), TypeName.Map, value),
  set: value => assertType(is.set(value), TypeName.Set, value),
  weakMap: value => assertType(is.weakMap(value), TypeName.WeakMap, value),
  weakSet: value => assertType(is.weakSet(value), TypeName.WeakSet, value),
  int8Array: value => assertType(is.int8Array(value), TypeName.Int8Array, value),
  uint8Array: value => assertType(is.uint8Array(value), TypeName.Uint8Array, value),
  uint8ClampedArray: value => assertType(is.uint8ClampedArray(value), TypeName.Uint8ClampedArray, value),
  int16Array: value => assertType(is.int16Array(value), TypeName.Int16Array, value),
  uint16Array: value => assertType(is.uint16Array(value), TypeName.Uint16Array, value),
  int32Array: value => assertType(is.int32Array(value), TypeName.Int32Array, value),
  uint32Array: value => assertType(is.uint32Array(value), TypeName.Uint32Array, value),
  float32Array: value => assertType(is.float32Array(value), TypeName.Float32Array, value),
  float64Array: value => assertType(is.float64Array(value), TypeName.Float64Array, value),
  bigInt64Array: value => assertType(is.bigInt64Array(value), TypeName.BigInt64Array, value),
  bigUint64Array: value => assertType(is.bigUint64Array(value), TypeName.BigUint64Array, value),
  arrayBuffer: value => assertType(is.arrayBuffer(value), TypeName.ArrayBuffer, value),
  sharedArrayBuffer: value => assertType(is.sharedArrayBuffer(value), TypeName.SharedArrayBuffer, value),
  dataView: value => assertType(is.dataView(value), TypeName.DataView, value),
  urlInstance: value => assertType(is.urlInstance(value), TypeName.URL, value),
  urlString: value => assertType(is.urlString(value), AssertionTypeDescription.urlString, value),
  truthy: value => assertType(is.truthy(value), AssertionTypeDescription.truthy, value),
  falsy: value => assertType(is.falsy(value), AssertionTypeDescription.falsy, value),
  nan: value => assertType(is.nan(value), AssertionTypeDescription.nan, value),
  primitive: value => assertType(is.primitive(value), AssertionTypeDescription.primitive, value),
  integer: value => assertType(is.integer(value), AssertionTypeDescription.integer, value),
  safeInteger: value => assertType(is.safeInteger(value), AssertionTypeDescription.safeInteger, value),
  plainObject: value => assertType(is.plainObject(value), AssertionTypeDescription.plainObject, value),
  typedArray: value => assertType(is.typedArray(value), AssertionTypeDescription.typedArray, value),
  arrayLike: value => assertType(is.arrayLike(value), AssertionTypeDescription.arrayLike, value),
  domElement: value => assertType(is.domElement(value), AssertionTypeDescription.domElement, value),
  observable: value => assertType(is.observable(value), TypeName.Observable, value),
  nodeStream: value => assertType(is.nodeStream(value), AssertionTypeDescription.nodeStream, value),
  infinite: value => assertType(is.infinite(value), AssertionTypeDescription.infinite, value),
  emptyArray: value => assertType(is.emptyArray(value), AssertionTypeDescription.emptyArray, value),
  nonEmptyArray: value => assertType(is.nonEmptyArray(value), AssertionTypeDescription.nonEmptyArray, value),
  emptyString: value => assertType(is.emptyString(value), AssertionTypeDescription.emptyString, value),
  nonEmptyString: value => assertType(is.nonEmptyString(value), AssertionTypeDescription.nonEmptyString, value),
  emptyStringOrWhitespace: value => assertType(is.emptyStringOrWhitespace(value), AssertionTypeDescription.emptyStringOrWhitespace, value),
  emptyObject: value => assertType(is.emptyObject(value), AssertionTypeDescription.emptyObject, value),
  nonEmptyObject: value => assertType(is.nonEmptyObject(value), AssertionTypeDescription.nonEmptyObject, value),
  emptySet: value => assertType(is.emptySet(value), AssertionTypeDescription.emptySet, value),
  nonEmptySet: value => assertType(is.nonEmptySet(value), AssertionTypeDescription.nonEmptySet, value),
  emptyMap: value => assertType(is.emptyMap(value), AssertionTypeDescription.emptyMap, value),
  nonEmptyMap: value => assertType(is.nonEmptyMap(value), AssertionTypeDescription.nonEmptyMap, value),
  // Numbers.
  evenInteger: value => assertType(is.evenInteger(value), AssertionTypeDescription.evenInteger, value),
  oddInteger: value => assertType(is.oddInteger(value), AssertionTypeDescription.oddInteger, value),
  // Two arguments.
  directInstanceOf: (instance, class_) => assertType(is.directInstanceOf(instance, class_), AssertionTypeDescription.directInstanceOf, instance),
  inRange: (value, range) => assertType(is.inRange(value, range), AssertionTypeDescription.inRange, value),
  // Variadic functions.
  any: (predicate, ...values) => assertType(is.any(predicate, ...values), AssertionTypeDescription.any, values),
  all: (predicate, ...values) => assertType(is.all(predicate, ...values), AssertionTypeDescription.all, values)
}; // Some few keywords are reserved, but we'll populate them for Node.js users
// See https://github.com/Microsoft/TypeScript/issues/2536

exports.assert = assert;
Object.defineProperties(is, {
  class: {
    value: is.class_
  },
  function: {
    value: is.function_
  },
  null: {
    value: is.null_
  }
});
Object.defineProperties(assert, {
  class: {
    value: assert.class_
  },
  function: {
    value: assert.function_
  },
  null: {
    value: assert.null_
  }
});
var _default = is; // For CommonJS default export support

exports.default = _default;
module.exports = is;
module.exports.default = is;
module.exports.assert = assert;
//# sourceMappingURL=index.js.map