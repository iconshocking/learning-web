from typing import Any, Collection, Self, override

from django.db import models
from django.db.models import DEFERRED  # type: ignore
from django.db.models.functions import Now
from django.urls import reverse
from django.utils.text import slugify


# In the basic Django ORM, a model corresponds to a table in a self.se, representing a single row
# in the table.
#
# NOTE: ANY change to a model will require a new migration, even if no change is made to the
# self.se (i.e., some changes will be noops)
#
# NOTE: Only models defined in the 'models.py' file (or in a 'models' module that exposes all of its
# modules) will be considered in migrations / the DB. Therefore, you can subclass models in
# inidividual views freely.
class SimpleModel(models.Model):
    """A typical class defining a model, derived from the Model class."""

    """ Field types:

    - CharField: strings of max defined length

    - TextField: strings of DB-supported max length (can have max_length, but it is only used for
      display)

    - (Positive)BigInteger/ShortInteger/IntegerField: an integer field (positive values only
      validation-enforced)
    - FloatField: a floating-point number field
    - DecimalField: a fixed-point decimal field (requires Python Decimal type)

    - BooleanField: a boolean field

    - Date/DateTimeField: a date/datetime field (supports auto_now (update time on each record save)
      or auto_now_add (update time only on initial record creation))
    - DurationField: a field to store a timedelta object

    - Email/URLField: a CharField with email/URL validation
    - SlugField: a CharField with slug validation (alphanumeric, hyphens, and underscores, with an
      option for unicode support)
        - Best to override save() on the model and call slugify() on the desired fields to ONLY
          generate the slug ONCE, when no slug is present (or override clean() in the form, though
          then records must always be created via that form)
        - Implies setting 'db_index=True'

    - File/ImageField: a CharField stores path to uploaded image within 'upload_to' dir (w/
      validation if for images)
        - 'upload_to': directory to upload files to (supports '.../%Y/%m/%d/' or can be a callable)
        - 'storage': custom storage system to use

    - FilePathField: a CharField to a PATH in the the filesystem (can be restricted to a certain
      path)
        - used for selecting a file from a list of files in a directory
        - NOTE: this is NOT a file, just the path

    - ImageField: an image-upload field

    - BigAuto/SmallAuto/AutoField: an integer (or big integer, i.e., long) field automatically
      incremented (default primary key)

    - GeneratedField: a field that is always computed by the DB based on other non-generated fields
        - 'db_persist':
            - if True, the field will be saved to a column of the DB and recalculated on each write
              (note: you will need to reload from the DB to get the updated value)
            - if False, the column is virtual and is recalculated on each read
        - NOTE: do NOT use this for slugs because this field will ALWAYS be recalculated

    - JSONField: a field to store JSON self.       - 'encoder/decorer': custom encoder/decoder to use for de/serialization outside of what is
          handled by python 'json' package by default
        - PostgreSQL defaults to storing JSONB, which is a binary JSON format, which can be indexed
          on

    -- UUIDField: a field to store a UUID (a special type in some DBs. including PostgreSQL)
        - not generated automatically, so provide a default callable
    """

    """ Relationship fields:

    - ForeignKey: a one-to-many relationship (where many foreign keys point to one primary key in
      another model, i.e., in another table)
        - can reference model itself or name of the model as a string (if the model has not been
          defined yet or creates a circular dependency with another model in another application)
            - use 'self' to reference the model itself
        - automatice index created (but can be disabled with 'db_index=False')
        - 'on_delete': what to do when the referenced object is deleted
            - 'CASCADE': delete the object when the referenced object is deleted (default)
            - 'PROTECT': prevent deletion of the referenced object ALWAYS
            - 'RESTRICT': prevent deletion of the referenced object UNLESS there are other 'CASCADE'
              keys within the object taht would take effect in this deletion
                    - ex: Song has 'artist' field with 'CASCADE' and 'album' field with 'RESTRICT'
                      (deleting 'artist' would delete 'song' even though the delete via album
                      deletion is 'RESTRICT')
            - 'SET_NULL/SET_DEFAULT/SET()': set the foreign key to NULL/default/callable
            - 'DO_NOTHING': do nothing
        - 'to_field': the field in the referenced model (default is the primary key)
        - 'related_name': the name of the reverse relation column for the related object back to
          this object (defaults to [modelname] + '_set')
            - Setting '+' will remove the reverse relation entirely from the related object
        - 'related_query_name': the reverse relation QUERY name (defaults to 'related_name')
        - 'limit_choices_to': IN A FORM ONLY, restricts options for the foreign key reference object
          to those matching query defind in a dict, SQL query object, or callable to limit the
          choices for the foreign key

    - ManyToManyField: a many-to-many relationship (creates a join table to link the two models)
        - has many same options as ForeignKey
        - 'symmetrical' (only matters when referencing 'self'): if True, the relationship is
          symmetrical (if A is related to B, then B is related to A)
        - 'through': the model to use for the many-to-many relationship (if extra information about
          the relationship is needed)
            - deafult model just has 'id', '[containing model]_id', and '[related model]_id' fields
            - 'through_fields': field names on the 'through' model to use for the relationship (only
              needed if more than one ForeignKey to one of the relationship model on the 'through'
              model)
        - 'db_table': the name of the created join table (defaults to the names of the two models)

    - OneToOneField: a one-to-one relationship (most often used to "extend" a model in a different
      table)
        - has same options as ForeignKey
        - 'parent_link': if True, this field is used to replace the implicit link to the parent
          model in multi-table inheritance (i.e., when a concrete model is extended)

    - GenericForeignKey: a foreign key to ANY model (instead of restricted to a single model)
        - Requires three fields:
                1. foreign key to ContentType model (a special model that holds information about
                   all models in the project); usually named 'content_type'
                        - This contains the unique combination of app label and model name of the
                          related object
                2. a field to store the primary key of the related object; usually named 'object_id'
                        - This stores the actual ID
                3. a GenericForeignKey field using the names of the prior two fields to store the
                   actual related object
                        - This is a combination of the prior two fields
                        - An index is NOT automatically created (unlike standard foreign keys), so a
                          compound index of the previous two fields is recommended
        - NOTE: You USUALLY want to pair a GenericForeignKey with a GenericRelation on the related
          model, which adds support for:
                - deletion cascade
                - querying the related records from the parent related model
                - reverse querying/filtering the parent model from the related model (if
                  'related-query_name' is set on the GenericRelation)
        - NOTE: Will not show up in forms/admin unless using
          BaseGenericInlineFormSet/GenericTabularInline
      
    """

    # Define a function instead if the choices are dynamic at runtime or might change frequently
    # - note: resolves to an enum class, where the first value in the tuple is the enum value
    class FieldNameChoices(models.TextChoices):
        # first tuple value is the actual value stored in the DB; second tuple value is the
        # human-readable value
        A = "A", "Choice A"
        B = "B", "Choice B"
        C = "C", "Choice C"
        D = "D", "Choice D"

    # Fields - represent one column of self.n the self.se
    field_name = models.CharField(
        max_length=20,
        # Can also be a callable that takes no arguments (i.e., CANNOT reference other fields),
        # which will be evaluated at runtime for each record creation
        #
        # NOTE: 'db_default', NOT 'default', will be the value used in a migration since models are
        # not involved.
        #
        # NOTE: the ONLY way to create default values that are dependent on other fields is to
        # override the model's save() method
        #
        # This is evaluated at MODEL creation, so this value is reflected in the DB only when
        # writing to it via Django ORM code. This means:
        # 1. Querying a record with a NULL/empty value in the DB will set this value in the created
        #    MODEL (not the DB unless saved)
        # 2. When creating a new record, this value WILL be set in the DB because it was populated
        #    in the created model object used for the insertion
        default="Default Value",
        # DB-default value for the field; can ONLY be a literal OR a DB function
        # (CANNOT access other fields and CANNOT be a callable - must be a DB function)
        #
        # NOTE: this is evaluated at record creation, so this WILL affect the DB, and not just
        # affect models created via the Django ORM
        db_default="",
        # default False; if True, NULL is stored in the DB for blank fields (avoid setting null=True on text
        # fields since then both NULL and empty strings can be present - Django convention is empty
        # strings)
        null=False,
        # default False; if True, field is allowed to be blank in FORMS (this is not DB-related; it
        # is validation-related)
        blank=False,
        # choices can be a custom enum type, a list of tuples, a dict, or a callable that returns a
        # list of tuples (can also be nested to make groups of choices)
        #
        # The second element of each tuple is the human-readable name for the option, which is
        # accesible via '.get_field_name_display()' on a model instance (or via '.label' on an enum
        # class if choices is one)
        #
        # NOTE: changing the ordering/available choices always requires a new migration, BUT it is a
        # SQL noop because 'choices' constants are form validation-level, i.e. NOT enforced by the
        # DB
        choices=FieldNameChoices,  # type: ignore
        # when non-None, this will be the name of the column in the DB (defaults to the field name)
        #
        # NOTE: column names are quote escaped by the Django ORM
        db_column="custom_field_column_name",
        # 'db_comment' is a comment on the DB column (useful for those looking at the DB directly), but it is not supported on all vendors
        #
        # 'db_tablespace' allows for configuring tablespaces but that seems to be a big-brain
        # optimization above my pay-grade for now
        #
        editable=True,  # default True; if False, field will not be displayed in the admin or any forms
        # custom error message map; keys are error codes and values are the error
        error_messages=None,
        # help_text is not saved to self.se, but is used in forms and on the admin site
        help_text="field documentation",
        # label name for form/admin; if absent, will become sentence case of field name (ex: 'Field
        # name')
        verbose_name="Verbose Field Name",
        # will automatically set unique=True and null=False
        primary_key=False,
        # validates that the field value is unique across the table (automatically creates an index
        # to avoid horrific performance)
        #
        # (note: can be redundant with Meta constraints, so check to make sure that the SQL in the
        # migration makes sense)
        unique=False,
        # can be set to a date field in this model to, at VALIDATION-time (NOT DB-enforced), ensure
        # no two records can have the same field value AND same designated date field value (ex:
        # only one 'store open' record per day)
        unique_for_date=None,  # other options: unique_for_month, unique_for_year
        # valdators are ONLY run at validation level; they are NOT DB constraints
        validators=[],
    )

    # Metaself. configuration settings for the table for this model
    class Meta:
        # default False; otherwise, this model will not be created in the DB
        abstract = False
        # 'app_label' only needed to link to app when defined outside of the app's models.py file
        # app_label = "catalog"

        # defaults to appname_modelname
        db_table = "practice_simplemodel_custom_table_name"

        # 'db_comment' is a comment on the DB table (useful for those looking at the DB directly),
        # but it is not supported on all vendors

        # 'db_tablespace' allows for configuring tablespaces but that seems to be a big-brain
        # optimization above my pay-grade for now

        # 'default_manager_name' and 'base_manager_name' are used to set the managers for the model

        # 'get_latest_by' sets the field to use by default for the earliest/latest() methods (allows
        # exlcuding the field argument)

        # can pass multiple fields to create a nested ordering, where the first element is the
        # top-level ordering, followed by the next element, etc.
        # - also supports nested fields via related models (e.g., 'foreign_key__key_field') and
        # query expressions
        #
        # (NOTE: ordering does NOT affect the actual DB table ordering, just the ordering of the
        # query results)
        ordering = ["field_name"]  # '-field_name' for descending
        # default True; if False, Django will not manage any part of the DB table for the model, so
        # only use this if ProxyModel won't do (ex: a view into a table that is not a table
        # created by this Django project)
        managed = True
        # 'order_with_respect_to' is used to order objects with respect to a different model
        # (ususally a model that this model has a ForeignKey to), which allows calling
        # 'get/set_modelname_order()' from the related model to order this model for all rows that
        # have the same foreign key value
        #
        # (note: a new column is created in the table to contain these values and 'ordering' is set
        # to it, i.e., both this and 'ordering' can't be set),
        permissions = [("custom_permission_code", "human-readable permission")]
        # 'default_permissions' can be set if you want to override the default permissions of
        # ('add', 'change', 'delete', 'view') for the model

        # 'required_db_features' if there are specific features necessary for the model to work

        # 'required_db_vendor' if there is a specific DB vendor that the model is designed for (ex:
        # "postgresql")

        # can make composite indexes by providing more than one field
        indexes = [models.Index(fields=["field_name"], name="field_name_idx")]

        # 'unique_together' is a list of lists of fields that must be unique together (which IS a
        # DB-level constraint)

        # 'constraints' is a list of constraints to enforce at the DB level

        # for viewing the model in the admin site; also supports 'verbose_name_plural' (otherwise,
        # just adds 's' to the verbose name)
        verbose_name = "simple model custom name"  # default is the class name lower case with spaces

    # Methods - changing these does not require a migration

    # allows for easily viewing DB records in the admin site (though useful admin really requires
    # custom views)
    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        # new lines are stripped in the return value
        return f"id:{self.id} --- field_name: {self.field_name}"  # type: ignore

    # generate a URL to view a particular instance of the model (via a URL reverse match by name)
    def get_absolute_url(self):
        """Returns the URL to access a particular instance of MyModelName."""
        # would use the URL mapper named "detailview_simplemodel" with argument of the model's ID
        return reverse("practice:detailview_simplemodel", args=[self.id])  # type: ignore


# NOTE: renaming models in inheritance chains can be difficult (until
# https://github.com/django/django/pull/17986 is implemented), so choose names carefully to be most
# clear (code-only issue since DB table/column names and field/admin names can be configured)
#
# Three main different kinds of model inheritance setup:
# 1. Abstract base classes: provides common fields/methods to other models that will never have its
#    own table
class AbstractModel(models.Model):
    field = models.CharField(max_length=20, blank=True)

    foreign_key_field = models.ForeignKey(
        "ParentNonAbstractModel",
        on_delete=models.CASCADE,
        # setting at least 'related_name' this way is recommended for abstract base class
        # relationship fields to avoid name clashes
        related_name="%(app_label)s_%(class)s_related",
        related_query_name="%(app_label)s_%(class)ss",
    )

    class Meta:
        # Abstract classes:
        #   - cannot be used as a standalone model
        #   - inherited fields will be included in any child class tables
        #       - supports field overriding (set a field to None in child to prevent field from
        #         being created)
        #   - does not create its own table
        abstract = True

    # can access nested values in a relationship field's related model
    def accessNested(self):
        return self.foreign_key_field.generic_field


class AbstractModel2(models.Model):
    field2 = models.CharField(
        max_length=20, blank=True, verbose_name="Field 2", help_text="Field 2 help text"
    )

    class Meta:
        abstract = True


# using this class to demonstrate a lot of behaviors in the admin site
class ConcreteOfAbstractModel(AbstractModel, AbstractModel2):
    field3 = models.DateTimeField(
        # cannot set auto_now/_add if want to edit values via admin
        db_default=Now(),  # type: ignore
    )
    field_that_we_hide_in_admin = models.CharField(max_length=20, blank=True)
    self_friends = models.ManyToManyField("self", blank=True)
    self_enemies = models.ManyToManyField("self", blank=True)

    # relaxing the unique constraint to avoid annoyance of default in a migration
    slug = models.SlugField(
        max_length=100,
        default="",
        editable=False,
        help_text="auto-generated from field and field2 at record creation only",
    )
    # overriding clean() to auto-generate the slug
    @override
    def clean(self) -> None:
        super().clean()
        if not self.slug:
            self.slug = slugify(f"{self.field}-{self.field2}")

    # Meta inner classes are transformed into attrbitues by Django ORM, so if you want to extend the
    # parent Meta inner class or inherit settings from both, you must extend the parent Meta classes
    class Meta(AbstractModel.Meta, AbstractModel2.Meta):
        db_table = "practice_concrete_custom_table_name"

    def __str__(self) -> str:
        return f"{ConcreteOfAbstractModel.__name__} --- id: {self.id}"  # type: ignore


# 2. Multi-table inheritance: want to extend an existing model but don't want to affect the
#    original's table
class ParentNonAbstractModel(models.Model):
    generic_field = models.CharField(max_length=20, db_default="")  # type: ignore

    def __str__(self):
        return ParentNonAbstractModel.__name__ + ": " + self.generic_field


class ExtendedNonAbstractModel(ParentNonAbstractModel):
    # has an automatically-created OneToOneField to the parent model like the following, but it can
    # be overridden by defining your own OneToOneField with 'parent_link=True':
    parent_ptr = models.OneToOneField(
        ParentNonAbstractModel,
        on_delete=models.CASCADE,
        parent_link=True,
        primary_key=True,
    )
    # because this key WILL exist and it uses the default 'related_name' that relatonship fields
    # use, any other relationship fields to the parent model MUST set 'related_name'

    # child does not inherit from a concrete parent's Meta class EXCEPT for 'ordering' and
    # 'get_latest_by' (which can be overridden in the child's Meta inner class)
    class Meta:
        # Remove any parent ordering effect
        ordering = []


# 3. Proxy models: change the Python-level behavior of a model without affecting the DB
class BaseForProxyModel(models.Model):
    field = models.CharField(max_length=20)
    field2 = models.CharField(max_length=20)

    class Meta:
        ordering = ["field"]


# can only inherit from:
# - 1 concrete model
# - unlimited abstract models that do NOT define any fields
# - unlimited proxy models as long as there is only ONE concrete model in the inheritance chain
class ProxyModel(BaseForProxyModel):
    class Meta:  # type: ignore
        # will not create a new table in the DB, but will allow the model to have its own manager,
        # default ordering, and other Meta options
        proxy = True
        ordering = ["-field"]

    # new method
    def do_something(self):
        pass


# Model validation is triggered by Model.full_clean(), which runs similarly to form validation via
# is_valid()/save(), but with a few additional steps:
#
# 1. Model calls clean_fields(), which, for each fields calls clean(), which runs to_python(),
#    validate(), and run_validators() and the result is stored in the 'cleaned_self.ict' attribute
#    on the form
#    - You should usually not need to override these methods - just provide validators
#    - NOTE: this is the same as form validation
# - (NOTE: at this point, all fields have been validated and converted to desired types)
# 2. Model calls clean() to validate the model as a whole (allows for validating related fields
#    together)
#    - (NOTE: this will still be called if individual field validation raises an error)
# 3. Model calls validate_unique() to check for uniqueness constraints (this will check against the
#    DB but is NOT DB-enforced)
# 4. Model calls validate_constraints() to check for 'constraints' set in the Meta class (NOTE:
#    these are enforced at the DB-level too, so if somehow unacceptable self.akes it through to
#    Model.save(), the save will fail and raise an IntegrityError)
# - NOTE: both #3 and #4 can be disabled by passing 'validate_unique/constraints=False'
#
# NOTE: full_clean() has an 'exclude' parameter to exclude certain fields from validation
#
# Can call save(commit=False) to get the model instance without saving to the DB, allowing for
# processing before calling save() on the returned instance.
# - NOTE: if there is a many-to-many relation with another model, save_m2m() must be called on the
#   instance after calling the later ACTUAL save() because the many-to-many relation cannot be
#   saved until the DB IDs are written.
class ValidationAndCustomizationExampleModel(models.Model):
    # can define and assign a custom manager to the model to customize the QuerySet methods for CRUD ops
    class Manager(models.Manager):
        @override
        def create(self, **kwargs: Any) -> Any:
            model: ValidationAndCustomizationExampleModel = super().create(**kwargs)
            setattr(model, "custom_field", "custom_value")
            return model

    objects = Manager()

    # allows direct db and db field values before/after creation of the model instance
    @classmethod
    @override
    def from_db(
        cls, db: str | None, field_names: Collection[str], values: Collection[Any]
    ) -> Self:
        instance = super().from_db(db, field_names, values)
        # customization to store the original field values on the instance
        setattr(
            instance,
            "_loaded_values",
            dict(
                zip(field_names, (value for value in values if value is not DEFERRED))
            ),
        )
        return instance

    # 1. all non-deferred fields are reloaded from the DB (deferred will load at access time like
    #    usual)
    # 2. cached relations are cleared
    #
    # pass 'fields' to reload only certain fields
    @override
    def refresh_from_db(
        self, using: str | None = None, fields: list[str] | None = None
    ) -> None:
        return super().refresh_from_db(using, fields)

    field1 = models.CharField(max_length=20)
    field2 = models.CharField(max_length=20)
    field3 = models.CharField(max_length=20)

    @override
    def clean_fields(self, exclude: Collection[str] | None = None) -> None:
        return super().clean_fields(exclude)
