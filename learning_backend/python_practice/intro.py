"""NOTE: python has no primitive types, only objects, but it does have some standard built-in types
that echo primitive types in other languages:
- int: integers
- float: floating point numbers
- str: strings
- bytes: immutable sequence of bytes
- bool: boolean
- None: null/undefined
"""

# differentiates between ints and floats
print("\nMATH")
import math

print(type(1))
print(type(1.0))
# supports same math operations as JS, except division is different:
print(8 // 5 == 1)  # integer division
print(8 / 5 == 1.6)  # default flaoting point division
# note: python does not support ++ or --, but +/-/*//= are supported

print(255 == 0xFF)  # hex
print(63 == 0o77)  # octal
print(7 == 0b111)  # binary
print(math.isnan(math.nan))  # NaN

print("\nVARIABLES")
width = 5  # variable
# _ is value of last expression in interactive mode

# python has type hinting, but it is important to note:
# 1. types are NOT enforced (at runtime OR compile time); they're only hints - all types are dynamic
# 2. type hinting is only for readability, static analysis (linting, etc.), and tools/decorators
#    that access annotations
# 3. declaring a variable with a type hint does NOT create the variable; it is only created once a
#    values is set
height: int
try:
    print(height)  # height variable has not been created
except NameError as e:
    print(e)
height = "not an int"  # no error


# decimal module can be used to avoid floating point errors by enforcing defined precision, but it is
# slower. Also, precision is only applied to  operations (constructor provides same precision as the
# provided argument, so beware using floats).
from decimal import Decimal, getcontext

print("\nDECIMAL MODULE")
print(Decimal("1.1") + Decimal("2.2") == Decimal("3.3"))
getcontext().prec = 2
print(Decimal(1.1) + Decimal(2.2) == Decimal(3.3) / Decimal(1.0))
print(1.1 + 2.2 != 3.3)

print("\nSTRINGS")
# print properly formats strings with special/escape chars (the interactive shell does not)
print("Hello,\nworld!")
print("A \\n is a newline character.")  # escaped backslash
print(r"A \n is a newline character.")  # raw string ignores escape chars
print("""string literal just like JS w/ multi line and indent preservation
      escaped carriage return ignores new line... \
      so same line here""")
# end parameter can be used to change the default newline
print("line 1", end=", ")
print("same line")
# formatted string literals are like JS template literals
print(f"2 + 2 = {2 + 2}")
# can also create strings with the format() method like Java, but probably only need to do this when
# performing sophisticated logging or output formatting

# for regexes, use the 're' module
import re

for string in ("ab", "abc", "abcc"):
    if (x := re.match("abc+", string)) is not None:
        print(x)

# can index strings like JS, but also supports negative indexing
print("string"[-1] == "g")  # last char
print("string"[:1] + "string"[1:] + " " + "string"[0:-2] == "string stri")  # slicing
print(len("string") == 6)  # external function, for lists too

# pass is a no-op (needed since python requires a block when an indentation is expected)
if True:
    pass

print("\nBYTES")
# bytes (immutable)
x = b"\x00\x00"  # byte literal (hex notation)
y = bytes(2)
print(x, y)  # same
print(bytes("string", "ASCII"))  # bytes from string
print(b"string")  # byte literals default interpretation is ASCII
# print(b"👎") # ONLY ASCII is allowed unless written in escaped hex notation, so this would cause a SyntaxError

# bytearray (mutable)
x = bytearray()
x.append(0xFF)
print(x)
