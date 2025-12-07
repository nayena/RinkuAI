import type * as React from "react";

type ReactNativeModule = typeof import("react-native");

type ReactNativeComponentKeys = {
  [K in keyof ReactNativeModule]: ReactNativeModule[K] extends React.JSXElementConstructor<any>
    ? K
    : never;
}[keyof ReactNativeModule];

type ReactNativeIntrinsicElements = {
  [K in ReactNativeComponentKeys]: React.ComponentProps<ReactNativeModule[K]>;
};

declare global {
  namespace ReactNative {
    namespace JSX {
      interface Element extends React.JSX.Element {}
      interface ElementClass {
        [key: string]: unknown;
      }
      interface ElementAttributesProperty {
        props: {};
      }
      interface ElementChildrenAttribute {
        children: {};
      }
      interface IntrinsicAttributes extends React.Attributes {}
      interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}
      interface IntrinsicElements extends ReactNativeIntrinsicElements {}
      type LibraryManagedAttributes<C, P> = React.JSX.LibraryManagedAttributes<C, P>;
    }
  }
  namespace JSX {
    interface ElementClass {
      [key: string]: unknown;
    }
  }
}
