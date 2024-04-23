# relative imports are supported via '.' syntax, where each '.' represents a directory level up.
#
# This import will not work when running this module from the command line because the the module
# does not by default know about its parent package context, so it must be run as a module ('python
# -m python_practice.relative_imports.import')
#
# NOTE: the package context must contain the highest level of relative import dir, so in this case
# '..' is equivalent to 'python_practice'. Running 'python -m relative_imports.import' from within
# the 'python_practice' dir would throw 'Import Error: attempted relative import beyond top-level
# package.
from ..for_import.module import importFunction

importFunction()
