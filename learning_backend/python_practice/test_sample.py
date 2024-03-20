# ONLY use doctest for simple documentation-style tests; it is DOCUMENTATION, not test coverage
import doctest


def average(values):
    """Computes the arithmetic mean of a list of numbers.

    >>> print(average([20, 30, 70]))
    40.0
    """
    return sum(values) / len(values)


# will run the '>>>' line in the docstring as a test and compare output to the next line
doctest.testmod()


# unittest is part of the standard library but pytest is the most popular testing framework
#
# USE PYTEST
def test_average():
    assert average((3, 4, 5)) == 4  # will pass
    assert average((3, 4, 5)) == 2  # will fail


# call pytest from the command line to run all files of form test_*.py or *_test.py
