import { log } from "console";

// can generate a variety of byte arrays
{
  let array = new Uint8Array(8); // 1 byte per element
  array[0] = 257; // wraps back around to 1
  log(array);
  array = new Uint16Array(8); // 2 bytes per element
  array[0] = 257; // representable now
  log(array);
}

// when dealing with more complex binary data, you can use ArrayBuffer (immutable and unreadable)
// with DataView/TypedArrays (mutable and readable)
{
  const buffer = new ArrayBuffer(13);
  const array = new Uint16Array(buffer, 0, 4);
  array.set([0, 1, 2, 3]);
  // DataView allows for unaligned byte access + endian control BUT can only write/read one element at a time
  const view = new DataView(buffer);
  view.setUint8(8, 0xff);
  view.setUint32(9, 0x12345678); // requires DataView because the bytes offset is not a multiple of 4 (32 bits)

  log(buffer);
  log(new Uint16Array(buffer, 0, 4));
  log(view.getUint8(8));
  log(view.getUint32(9));
}

// Little vs big endian data is determined by the network protocol (for example, TCP/IP is big
// endian), so make sure your library or own code is converting to the proper endian when receiving
// binary data.
