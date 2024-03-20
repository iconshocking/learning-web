# python follows JS/Java/Kotlin style of pass by value for primitives and pass by reference for
# objects, so objects are shadowed unless using the global or nonlocal keyword

# NOTE: almost NEVER use these keywords (since unlike C++ with pass-by-reference, there is no way to
# know your function might mutate outer state)

# globals are only per file, referred to as modules in python (so they must be imported to be used in other files)
y = "global"


def myfunc1():
    x = z = "outer"

    def myfunc2():
        z = "inner"  # noqa: F841
        nonlocal x
        x += " overwritten"
        global y
        y += " overwritten"

    myfunc2()

    print(x)
    print(y)
    print(z)


myfunc1()
