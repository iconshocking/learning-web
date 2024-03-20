import math


a, b = 0, 1  # multiple assignment, like JS
# falsy values in python are the same as JS (except for NaN), but also include empty basic collections
print(not ([] or () or {} or set() or range(0)))
print(
    not None
)  # None is equivalent to null/undefined in JS and the default return value of functions
print(bool(math.nan))  # NaN is truthy in python

# Value equality is ==, which calls __eq__ method, like Java.
# Reference equality is 'is', which checks if two references point to the same object
# (curiously, constants can pass an 'is' check due to memory reuse)
a = []
b = []
print(a == b)  # True
print(a is not b)  # True
# nan is not equal to itself (like JS ===)
print(math.nan != math.nan)  # True

# python supports assignment expressions (walrus operator), which performs the assignment and
# returns the value of the variable
n = 4
while (n := n - 1) >= 0:
    print(n)
