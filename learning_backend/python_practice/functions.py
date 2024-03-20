def function(
    x: int,
) -> int:  # skinny arrow - don't get confused with the fat arrow in JS arrow functions
    # docstring when first line of function, module, or class; otherwise, ignored as a comment
    """Example function with type annotations."""
    return x + 1


# anonymous functions are called lambda functions (like Java/Kotling), but they are very limited
lambda a, b: a + b  # cannot be multiline, cannot have statements, cannot have type annotations


# support for default arguments, but they are evaluated once (so don't use mutable objects)
def f(
    a, list=[]
):  # this same list will always be used, so it won't be empty after the first call
    list.append(a)
    return list


# so do this instead
def f2(a, list=None):
    if list is None:
        list = []
    list.append(a)
    return list


# can use *args to capture extra variable positional arguments into a tuple and **kwargs to capture
# extra variable keyword (named) arguments into a dict (the names 'args' and 'kwargs' are just
# convention, but they are widely used)
#
# (note: keyword parameters after *args are keyword-only (like being after * special parameter),
# which makes sense since they would otherwise be captured by *args)
def f3(a, *args, b, **kwargs):
    print(a, args, b, kwargs)


# (note: keyword arguments must come after positional arguments)
f3("first", "second", b="third", c="fourth")


# can use / and * to separate positional/keyword-only parameters; when absent, there are no restrictions
def f4(a, b, /, c, d, *, e, f):
    print(a, b, c, d, e, f)


# a, b are positional-only; c, d are positional or keyword; e, f are keyword-only
f4("a", "b", "c", d="d", e="e", f="f")
# (note: position-only parameters can prevent name collision with keys in the kwargs if needed)


# completely optional parameters should generally use None as the default value
def f5(a, b=None):
    print("a is " + str(a))
    if b:
        print("b is " + str(b))


f5(1)
f5(2, 3)
