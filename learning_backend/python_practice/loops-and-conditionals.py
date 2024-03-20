x = 5
if x > 0:
    print("x is positive")
elif x < 0:  # not else if
    print("x is negative")
else:
    print("x is zero")

# 'and/or' work like in JS: they short-circuit and return the last value evaluated
print("first" or "second")  # first
print("first" and "second")  # second

# ternary operator equivalent is 'a if condition else b'
# (note: operator priority is usually not a concern since the if has the lowest priority)
print(
    # + has higher priority than 'if' so equivalent to "print more"
    "print" + " more" if True else ""
    # think of the expression as being nested after the if, similar to a list comprehension's 'for'
)

# python only allows for loop syntax for iteration over collections
for idx in range(5):
    print(idx, end=", ")
print()

# use enumerate() to get index
for idx, char in enumerate(["a", "b", "c"]):
    print(idx, char, end=", ")
print()

# use items() to get key-value pairs from a dict
for key, value in {"a": 1, "b": 2}.items():
    print(key, value, end=", ")
print()

# range function for iterating over a range of numbers, end-exclusive
for i in range(10, 0, -2):  # start, end, step
    print(i, end=", ")
print()

# loops can have else clause, which is executed if loop completes without break;
# NEVER use this since it is confusing (unless possibly with a comment making it clear)
for idx in range(5):
    if True:
        break
else:
    print(
        "should be called 'nobreak' instead of 'else' - NEVER use this since it is confusing"
    )

# loops can have 'continue' and 'break' statements like normal


# To be iterable, a class must implement __iter__ method, whose return value implements __next__
# method, which raises a StopIteration exception when there are no more elements
class Single:
    def __iter__(self):
        self.done = False
        return self

    def __next__(self):
        if not self.done:
            self.done = True
            return "single thing"
        else:
            raise StopIteration


for thing in Single():
    print(thing)
# equivalent
try:
    # iter() is a built-in that calls __iter__
    iterator = iter(Single())
    while True:
        # next() is a built-in that calls __next__
        print(next(iterator))
except StopIteration:
    pass


# generators alternatively create iterables via the 'yield' keyword, like in JS (automatically
# generating the __iter__ and __next__ methods on the generator object returned from invoking the
# function)
def DoubleGenerator():
    # function state is saved between calls, like generators in JS
    yield "first generator thing"
    yield "second generator thing"
    # StopIteration is automatically raised when the function returns


for thing in DoubleGenerator():
    print(thing)


# match is a switch statement, but allows for destructuring (including dicts) and guards
class Point:
    # define the match args for the class if matching with positional arguments
    __match_args__ = ("x", "y")

    def __init__(self, x, y):
        self.x = x
        self.y = y


point = Point(0, 2)
match point:
    case (0, 0) | (-0, -0):  # or case (wtf???)
        print("origin")
    case (0, 0, *_):
        print("XY origin with more than 2 elements")
    case (1, y) if x == y:  # guard
        print("x and y are 1")
    case {"x": x, "y": 0, **others}:  # dict destructuring only allowed in match case
        # others is optional, but otherwise the non-matched keys are ignored and inaccessable
        print("dict")
    case Point(
        10, y
    ):  # the atrributes within the class are matched against (need __match_args__ for this case)
        print("point has x that is 10")
    case Point(x=0, y=y) if x == y:
        print("point has x and y that are 0")
    case Point(x=0, y=y) as point2:  # can capture any part of the match
        print("point has x that is 0")
    case _:  # default
        print("other")

# python does not have a nullish coalescing operator, so use the 'if' operator
# (don't use 'or' since that will also catch other falsy values)
s = "thing"
other = s if s is not None else "default value"
# similarly there is no optional chaining operator, so again use the 'if' operator

# 'not' positioning depends on context:
# 1. 'not' is a prefix operator
print(not True is False)  # this is true  # noqa: E714

# 2. 'is not' is the negative identity operator - a SINGLE operator, not a combination of 'is' and 'not'
a = []
b = [1]
# this is true
print(a is not b)
# this is false because 'not b' is equal to 'False' since b is truthy, and 'a' is not 'False' (by reference)
print(a is (not b))

# 3. 'not in' is the negative membership operator - again a SINGLE operator
print(1 not in [2, 3])  # this is true

# comparisons can be chained in python, but they should generally NOT be used because they can have suprising results:
# this is false because it is equivalent to '(-1 > -2) and (-2 == True)'
print(-1 > -2 == True)  # noqa: E712
