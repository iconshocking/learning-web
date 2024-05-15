"""Python technically supports multi-threading but it due to the GIL (Global Interpreter Lock) in
CPython (the most common version of python), it is not possible for more than one thread to execute
Python code at once. So while IO operations and the like can be done in parallel, threading in
Python is very limited, except when the computation is offloaded to native code / other languages.

The multiprocessing module works around this by spawning multiple Python processes, so that threads
aren't needed at all."""
