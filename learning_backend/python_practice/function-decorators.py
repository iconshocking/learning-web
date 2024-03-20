# function decorators allow for a quick syntax to apply a function to another function
def toString(func):
    return lambda: str(func())


def add1(func):
    return lambda: func() + 1


# each decorator wraps the function beneath it
# equivalent to f() = toString(add1(f())), ignoring the recursive syntax issue here
@toString
@add1
def f():
    return 1


print(f())  # 2
print(type(f()))  # str type


# techincally, any function call is shorthand for function.__call__();
# therefore you can define __call__ to make a class instance callable as a function,
# which also makes it usable as a function decorator)
class Add2:
    def __init__(self, func):
        self.func = func

    def __call__(self):
        return self.func() + 2


@Add2
def g():
    return 1


print(g())  # 3
