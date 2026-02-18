export {};

declare global {
  var TextEncoder: {
    new (): {
      encode(input: string): Uint8Array;
    };
  };

  var TextDecoder: {
    new (): {
      decode(input: Uint8Array): string;
    };
  };

  var ReadableStream: unknown;
  var WritableStream: unknown;
  var TransformStream: unknown;
}
