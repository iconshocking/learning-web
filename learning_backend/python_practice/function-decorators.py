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


# decorators also intercept the function's arguments, so they can be accessed/modified
def add1ToArg(func):
    return lambda num: func(num + 1)


@add1ToArg
def printing(num: int):
    print(num)


printing(10)  # 11


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


# decorators cannot take arguments, but you can create a function that takes an argument and RETURNS a decorator
def addN(n: int):
    # the top-level function with the argument RETURNS the decorator
    def decorator(func):
        return lambda: func() + n

    return decorator


# note that the decorator here is NOT addN, but the function it returns, because addN is being
# invoked and evaluated
@addN(3)
def h():
    return 1


print(h())  # 4


def h2():
    return 1


# equivalent
print(addN(3)(h2)())  # 4


# To preserve a decorated function's metadata (docstring, name, etc.), use the functools.wraps decorator
def decorator(func):
    from functools import wraps

    @wraps(func)  # cannot be used with lambda functions annoyingly
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs) + 1

    return wrapper


@decorator
def i():
    """i function returns 1"""
    return 1


print(i.__doc__)  # would be None without functools.wraps
