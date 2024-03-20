# can unpack sequences into individual values but not dicts, like in JS
# (note: must match exact length unless using * for extended unpacking, unlike in JS)
a, b = (0, 1)
print(a, b)
a, b = [2, 3]
print(a, b)
a, b = range(4, 6)
print(a, b)
# can only unpack dicts into individual values in match statements

# underscore is used as a throwaway variable
a, _ = (0, 1)

# '*/**' are the extended unpacking operators, roughly equivalent to the JS spread/rest operator '...'

# * for iterables, and unlike JS, it doesn't need to be the final variable
a, *b, c = [0, 1, 2, 3, 4]
print(b)

# ** for dicts when there are no individual variable assignments (except match statements, which
# support that: see loops-and-conditionals.py)
merge = {**{"a": 1, "b": 2}, **{"c": 3}}
print(merge)


# usable in function calls also like the spread operator
def f(a, b, c):
    print(a, b, c)


f(*[1, 2, 3])
# dict keys must match function parameter names, unless a function uses **kwargs in its signature
f(**{"a": 1, "b": 2, "c": 3})
