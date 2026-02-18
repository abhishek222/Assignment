export {}; // makes this file an external module

if (typeof globalThis.TextEncoder === 'undefined') {
  class TextEncoderPolyfill {
    encode(str: string): Uint8Array {
      const utf8: number[] = [];
      for (let i = 0; i < str.length; i++) {
        utf8.push(str.charCodeAt(i));
      }
      return new Uint8Array(utf8);
    }
  }
  (
    globalThis as unknown as { TextEncoder: typeof TextEncoderPolyfill }
  ).TextEncoder = TextEncoderPolyfill;
}

if (typeof globalThis.TextDecoder === 'undefined') {
  class TextDecoderPolyfill {
    decode(arr: Uint8Array): string {
      let result = '';
      for (let i = 0; i < arr.length; i++) {
        result += String.fromCharCode(arr[i]);
      }
      return result;
    }
  }
  (
    globalThis as unknown as { TextDecoder: typeof TextDecoderPolyfill }
  ).TextDecoder = TextDecoderPolyfill;
}
