import traceback

# try-except-finally works like Java, where you have to define the caught error type
try:
    print("try")
    # errors are raised instaed of thrown
    raise ValueError("arg1", "arg2")  # arbitrary args
    # can also raise the class directly: 'raise ValueError'
    print("after try")
except (ValueError, ZeroDivisionError) as e:
    print(e)
    print(e.args)
except Exception as e:  # catch-all case
    print(e)
finally:
    print("finally")

# note: SystemExit is raised by sys.exit()

# BaseException is the base class for all exceptions, but it is recommended to catch Exception
# instead since it is more specific to errors that should be recoverable and doesn't include
# SystemExit (sys.exit()), KeyboardInterrupt (ctrl+c), etc.

# else runs when no exception is raised - requires a catch (or finally) block preceding it
try:
    pass
except Exception:
    pass
else:
    print("runs when no exception is raised")

# ways to chain exceptions:
# 1: re-raise
try:
    try:
        raise Exception("re-raised")
    except Exception:
        raise  # no argument re-raises the last-handled exception (i.e., the current one in the except block)
        # alternatively, could suppress internal exceptions so not shown in parallel with the main exception
        raise Exception("wrapping") from None
except Exception as e:
    e.add_note("whatever I want to add")  # can add notes, even multiple
    # print full exception chain with trace
    traceback.print_exc()
    # use traceback.format_exc() to get the string instead

print()

# 2: chain as __cause__ (i.e., the original cause of the exception)
try:
    try:
        raise Exception("root cause")
    except Exception as e:
        raise Exception("wrapping") from e
except Exception:
    # print full exception chain with trace
    traceback.print_exc()


# Like JS, DO NOT put control flow statements (return/raise/break/continue) in the 'finally' block
# since it will override any other control flow statements in the try/except blocks (this is very
# unexpected behavior)
def finally_override(throw_error=False):
    try:
        if throw_error:
            raise ValueError("error")
        return "try"
    finally:
        return "finally"


print(finally_override())
print(finally_override(throw_error=True))

# can also have exception groups to raise multiple, unrelated exceptions at once
try:
    raise ExceptionGroup(
        "there were problems", [OSError("error 1"), SystemError("error 2")]
    )
except* OSError as e:  # note the extended unpacking operator style notation here
    print(e)
except* SystemError as e:
    print(e)
# ExceptionGroup extends Exception, so it can be caught by a catch-all block with 'except Exception'
