import random
from typing import Any, override

from django.conf import settings
from django.db.models import Prefetch
from django.http import HttpRequest
from django.http.response import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import View
from django.views.generic import UpdateView
from django.views.generic.edit import FormView

from .forms import RestrictableExampleForm, ConcreteOfAbstractModelForm
from .models import ConcreteOfAbstractModel


class ExampleFormView(FormView):
    form_class = RestrictableExampleForm
    template_name = "practice/example_form.html"


class ExampleFormViewAlt(FormView):
    form_class = RestrictableExampleForm
    template_name = "practice/example_form_alt.html"


class ExampleFormViewSimple(FormView):
    form_class = RestrictableExampleForm
    template_name = "practice/example_form_simple.html"


class ConcreteOfAbstractModelFormView(UpdateView):
    model = ConcreteOfAbstractModel
    form_class = ConcreteOfAbstractModelForm
    template_name = "practice/concrete_of_abstract_model_form.html"

    @override
    def setup(self, request: HttpRequest, *args: Any, **kwargs: Any) -> None:
        super().setup(request, *args, **kwargs)
        self.pk = kwargs["pk"]
        self.model_instance = get_object_or_404(ConcreteOfAbstractModel, pk=self.pk)

    @override
    def get_success_url(self) -> str:
        return reverse(
            "practice:concrete_of_abstract_model_form", kwargs={"pk": self.pk}
        )


class ExampleQueriesView(View):
    # queries are never evaluated until their results are accessed (see NOTES.md for more details)
    def get(self, request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponse:
        string = ""

        def print(*strings):
            nonlocal string
            string += " ".join((str(item) for item in strings)) + "\n"

        print("QUERYSETS")

        # any queryset method that does not return a single model instance can be chained
        model = (
            ConcreteOfAbstractModel.objects.all()
            .filter(field="value")
            .order_by("field2")
        )

        print("\nREFRESH")
        model = ConcreteOfAbstractModel.objects.all()[0]
        model2 = ConcreteOfAbstractModel.objects.all()[0]
        model2.field = "new value: " + str(random.randint(0, 10000000))
        model2.save()
        print(model.field)
        model.refresh_from_db()
        print(model.field)

        # deferred fields will not be loaded from the DB until they are accessed (NOTE: don't abuse
        # this since more queries is usually bad, so only use when the savings are worth it)
        deferred_models = (
            ConcreteOfAbstractModel.objects.defer("field")
            .all()
            .defer(
                "field2"
            )  # any queryset method that does not return a single model instance can be chained
        )
        print("\nDEFERRED", deferred_models.first().field2)  # type: ignore

        print("\nSELECT_RELATED")
        model = ConcreteOfAbstractModel.objects.all()[0]
        # accessing a foreign key field will trigger a new query to fetch the related model
        model.foreign_key_field
        # select_related() fetches specified foreign key or one-to-one model fields in the same query as
        # the main model via a JOIN (can pass no args to fetch all foreign key models but
        # recommendation is to be explicit)
        print(
            ConcreteOfAbstractModel.objects.all()
            # can chain fields via underscore (like other queries), which will fetch the related chain of models
            .select_related("foreign_key_field")[0]
            .foreign_key_field
        )
        # can reset the select_related() fields by passing None
        ConcreteOfAbstractModel.objects.all().select_related(
            "foreign_key_field"
        ).select_related(None)

        print("\nPREFETCH_RELATED")
        for model in ConcreteOfAbstractModel.objects.all():
            # this will trigger a DB query for the related model table
            print(model.self_friends.all())
        # prefetch_related() fetches specified many-to-many/one or GenericRelation fields in a
        # second query after the initial query, so the necessary records are available whenever the
        # relation field is queried for ANY model in the QuerySet (MUST pass desired fields as args)
        for model in ConcreteOfAbstractModel.objects.all().prefetch_related(
            "self_friends"
        ):
            # won't hit the DB
            print(model.self_friends.all())
        # NOTE: the cached QuerySets are the FULL list of related model records for each model
        # record, so CHANGING the queryset will invalidate the prefetch cache (works the same as
        # with standard QuerySet caching)
        for model in ConcreteOfAbstractModel.objects.all().prefetch_related(
            "self_friends"
        ):
            # hits the DB every time
            print(model.self_friends.exclude(field__isnull=True))

        # NOTE: you can prefretch_related_objects([instance_list], "relation_field_name") if using a
        # instance list instead of a QuerySet, but this will load all related objects into memory
        # EVEN before any querying

        # NOTE: prefetch_related() and select_related() can be used together and combined using
        # underscores (and if prefetch is second, it will respect prior caching, since the query is
        # evaluated separately):
        # Restaurant.objects.select_related("best_pizza").prefetch_related("best_pizza__toppings")

        # use the Prefetch class for more complicated prefetching (like filtering, ordering, etc.)
        queryset = ConcreteOfAbstractModel.objects.all().prefetch_related(
            Prefetch(
                "self_friends",
                # filter the list of returned records
                queryset=ConcreteOfAbstractModel.objects.reverse()
                # access nested foreign key model on the prefetch model without a new query
                .select_related("foreign_key_field"),
                # 'to_attr' sets an attribute on the returned model instances that contains the
                # prefetch result as a LIST (if not set, the prefetch result is a QuerySet, as
                # normal)
                # - NOTE: generally use this if filtering the prefetch to avoid ambiguity (since
                #   otherwise access is in the same way as normal relation records)
            )
        )
        # initial model evaluation is a query + combination prefetch_related & select_related query
        model = queryset[0]
        # no queries occur here since we have run prefetch/select for all accessed related models
        for friend in model.self_friends.all():
            print(friend.foreign_key_field.generic_field)

        print("\nCACHING")
        # QuerySets cache their iteration results at the time of evaluation, allowing for reusing
        # the instances without querying the DB again. HOWEVER, querying a slice or index (anything
        # that is not the full QuerySet) will CHECK the cache but will not ADD to the cache
        #
        # NOTE: you must REUSE the queryset since caching is not ACROSS QuerySet instances, even if
        # the query is identical
        queryset = ConcreteOfAbstractModel.objects.all()
        print(queryset[0])
        # will query the DB again
        print(queryset[0])
        for model in queryset:
            print(model)
        # will NOT query the DB again
        print(queryset[0])
        # NOTE: changing the queryset will cause the cache to be invalidated EVEN if the
        # resulting query would have consisted of all cached records
        print(queryset.exclude(field__isnull=True)[0])

        print("\nITERATORS")
        # By default QuerySets cache their iteration results at the time of evaluation, allowing for
        # reusing the instances without querying the DB again. However, if the dataset is very large
        # this can have memory implications, so use .iterator() since this:
        #   1. does not cache the results
        #   2. supports 'chunk_size' (for most DB backends) to split up the number of records
        #      fetched at any one time to reduce memory overhead (default 'chunk_size' is 2000,
        #      which include prefetch_related)_ models)
        queryset = ConcreteOfAbstractModel.objects.all()
        # singular query since chunk_size defaults to 2000, which is all the records
        for model in queryset.iterator():
            print(model)
        # another DB query because results were not cached when using the direct iterator
        print(queryset[1])

        if settings.DEBUG:
            print("\nDEBUG")
            from django import db

            print(db.connection.queries)
            # django logs queries when debug is enabled, so reset periodically to avoid memory
            # issues if performing many queries in a long-runnning operation
            db.reset_queries()
            print("after reset:", db.connection.queries)

        return render(request, "core/debug/simple_print_context.html", {"data": string})
