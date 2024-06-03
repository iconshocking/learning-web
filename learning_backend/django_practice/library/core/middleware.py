from typing import Callable, override

from django.http import HttpRequest, HttpResponse
from django.utils.deprecation import MiddlewareMixin
import sentry_sdk

# used to link tracing information with other logs
class RequestIdMiddlware(MiddlewareMixin):
    @override
    def __init__(
        self, get_response: Callable[[HttpRequest], HttpResponse] | None
    ) -> None:
        super().__init__(get_response)

    def process_request(self, request: HttpRequest):
        request_id = request.headers.get("X-Request-ID", None)
        if (request_id):
            with sentry_sdk.configure_scope() as scope:
                scope.set_tag("request_id", request_id)
