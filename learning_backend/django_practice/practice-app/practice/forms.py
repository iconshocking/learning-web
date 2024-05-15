from typing import Any, override

from django import forms
from django.core import validators
from django.urls import include

from .models import ConcreteOfAbstractModel, SimpleModel


# support labels for multi-value fields (widgets only handles the input normally, so we need to add
# back in per-subfield labels)
class LabeledInput(forms.TextInput):
    template_name = "core/multi_value_field_input_wrapper.html"

    @override
    def __init__(self, label, attrs: dict[str, Any]) -> None:
        super().__init__(attrs)
        self.label = label

    @override
    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        context["widget"]["label"] = self.label
        return context


class PhoneField(forms.MultiValueField):
    class PhoneWidget(forms.MultiWidget):
        def __init__(self, *args, **kwargs):
            widgets = (
                LabeledInput(
                    "Country code: +",
                    attrs={"size": 1, "maxlength": 3},
                ),
                LabeledInput(
                    "Phone number",
                    attrs={
                        "size": 10,
                        "maxlength": 10,
                    },
                ),
                LabeledInput(
                    "Extension",
                    attrs={
                        "size": 4,
                        "maxlength": 5,
                    },
                ),
            )
            super().__init__(widgets, *args, **kwargs)

        def decompress(self, value):
            if value:
                return value.split(",")
            return [None, None, None]

    def __init__(self, **kwargs):
        # Define one message for all fields.
        error_messages = {
            "incomplete": "Enter a country calling code and a phone number.",
        }
        # Or define a different message for each field.
        fields = (
            forms.CharField(
                error_messages={"incomplete": "Enter a country calling code."},
                validators=[
                    validators.RegexValidator(
                        r"^[0-9]+$", "Enter a valid country calling code."
                    ),
                ],
            ),
            forms.CharField(
                error_messages={"incomplete": "Enter a phone number."},
                validators=[
                    validators.RegexValidator(
                        r"^[0-9]+$", "Enter a valid phone number."
                    )
                ],
            ),
            forms.CharField(
                validators=[
                    validators.RegexValidator(r"^[0-9]+$", "Enter a valid extension.")
                ],
                required=False,
            ),
        )
        super().__init__(
            error_messages=error_messages,
            fields=fields,
            require_all_fields=False,
            widget=PhoneField.PhoneWidget(),
            **kwargs,
        )

    def compress(self, data_list: Any) -> Any:
        return ",".join(data_list)


class MultiEmailField(forms.Field):
    def to_python(self, value):
        """Normalize data to a list of strings."""
        # Return an empty list if no input was given.
        if not value:
            return []
        return value.split(",")

    def validate(self, value):
        """Check if value consists only of valid emails."""
        # Use the parent's handling of required fields, etc.
        super().validate(value)
        for email in value:
            validators.validate_email(email)


# Django provides a default form class that supports validation, error reporting, etc.
#
# Forms can be in two states:
# 1. "unbound", which is when the form was constructed with no data passed in
#   - "unbound" forms cannot be validated
# 2. "bound", when data was passed into the form constructor
#
# Form should be considered immutable, so create a new form whenever the data changes.
#
# Form validation occurs ONCE AND ONLY ONCE (which is why forms are effectively immutable) via
# either
#   - calling 'is_valid()'
#   - accessing the 'errors' attribute
# - (NOTE: these both call through to clean(), so override that method to add custom validation)
#
# Form validation is handled in the following steps for each field, with any step able to raise a
# ValidationError:
# 1. Field calls clean(), which runs to_python(), validate(), and run_validators() and the result is
#    stored in the 'cleaned_data dict' attribute on the form
#    - You should usually not need to override these methods - just provide validators
# - (NOTE: at this point, all form data has been converted to python instead of raw form strings and
#   has to be accessed via 'cleaned_data' on the form)
# 2. Form calls clean_<field_name>() for field, whose return value are the field's value in
#   - (NOTE: ALL fields are validated even if one field raises an error, so all current errors
#   should be caught, but only the FIRST per field)
# 3. Form calls clean() to validate the form as a whole (allows for validating related fields
#    together)
#   - (NOTE: this will still be called if individual field validation raises an error)
class ExampleForm(forms.Form):
    # Form constructor has following important parameters:
    # - 'data' is the data to be bound to the form (usually request.POST)
    # - 'files' is the file data to be bound to the form (usually request.FILES)
    # - 'instance' is the model instance to use to populate the form (used with ModelForms)
    #   - (NOTE: 'data' and 'files' are mutually exclusive with 'instance')
    # - 'initial' is the initial data for an unbound form (though this can usually be populated by
    #   the field or the model instance in a ModelForm)
    # - 'prefix' is a prefix for the form field names (useful for multiple forms on one page)
    # - 'field_order' (useful for changing order of fields in model forms since default is field
    #   definition order)
    # - 'empty_permitted' for a form that is allowed to be entirely empty
    @override
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    # validators do not return; they just raise a ValidationError if the value is invalid
    @staticmethod
    def validator(val):
        if val == "invalid":
            raise forms.ValidationError("It's invalid! ...get it?", code="invalid_code")

    # All forms accept some common arguments:
    # - required: (True by default)
    # - widget: widget to use for this field (defaults to expected widget for the field type)
    # - label: same as 'verbose_name' in model fields
    # - initial: used for initial "value" on an unboud form (does NOT effect bound forms)
    # - help_text: optional "help text" for this Field (check accessibility for screen readers)
    # - error_messages: optional dictionary to override the default error messages
    # - validators: List of ADDITIONAL validators to use
    # - localize: format dates, numbers, etc. according to the current locale
    # - disabled: same as HTML 'disabled' attribute
    # - label_suffix: (default is ':')
    # - show_hidden_initial: whether to render a hidden widget with initial value after the actual
    #   widget (no idead of a use case for this???)
    example = forms.Field(
        required=False,
        label="More descriptive label",
        initial="Initial value",
        help_text="Help text for this field",
        error_messages={
            "required": "This field is REQUIIIIIIIIRED",
            "invalid_code": "oops",
        },
        validators=(validator,),
        label_suffix=" hmmm?",
        # toggle this to set the field as hidden
        # widget=forms.HiddenInput()
    )

    # checkbox
    boolean = forms.BooleanField(required=False)
    # text input (only length is validated)
    char = forms.CharField(max_length=10, min_length=5, strip=True)
    # same as char field with a regex validator passed in
    regex = forms.RegexField(regex=r"Conrad( ?:Shock)?")
    # select (same format and options as choice field for model)
    choice = forms.ChoiceField(choices=[("a", "A"), ("b", "B"), ("c", "C")])
    # multiple select
    multiple_choice = forms.MultipleChoiceField(
        choices=[("a", "A"), ("b", "B"), ("c", "C")]
    )
    # same as choice but coerces values using the provided 'coerce' function (after validation)
    # since select values in HTML are always strings
    typed_choice = forms.TypedChoiceField(choices=[(1, "One"), (2, "Two")], coerce=int)
    typed_multiple_choice = forms.TypedMultipleChoiceField(
        choices=[(1, "One"), (2, "Two")], coerce=int
    )
    # date / time / datetime (don't recommend datetime since it is uncommon and has poor browser UX)
    #
    # can specify 'input_formats' to sepcify accepted formats
    date = forms.DateField(
        # default widget is text so override for better UX
        widget=forms.widgets.Input(attrs={"type": "date"})
    )
    time = forms.TimeField(widget=forms.widgets.Input(attrs={"type": "time"}))
    # number fields all accept 'step_size' and 'min/max_value'
    integer = forms.IntegerField(min_value=1, max_value=100)
    floatField = forms.FloatField()
    # 'decimal places' means max decimal places
    decimal = forms.DecimalField(
        min_value=1,
        max_digits=5,
        decimal_places=2,
        step_size=0.1,  # type: ignore
    )
    # duration field that maps specifically to a 'timedelta' python object
    duration = forms.DurationField(
        help_text="actually a text field", initial="DD HH:MM:SS.uuuuuu"
    )

    # just text validators on char fields
    email = forms.EmailField()
    ip = forms.GenericIPAddressField()
    slug = forms.SlugField()
    # default is 'http' but can be overridden here or better with `FORMS_URLFIELD_ASSUME_HTTPS` in
    # settings
    url = forms.URLField(assume_scheme="https")  # type: ignore
    uuid = forms.UUIDField()

    # files are passed as the second argument to the form constructor
    file = forms.FileField()
    # images requrie 'Pillow' package to be installed (python imaging library)
    image = forms.ImageField()
    # this is a select input for a file PATH, not an actual file (nothing is uploaded)
    filePath = forms.FilePathField(
        # The select options are computed at template creation, so be CAREFUL not to expose paths
        # that should not be exposed
        path="./",  # NEVER expose dirs that contain your code or sensitive data
        recursive=False,  # default
        allow_files=True,  # default
        allow_folders=False,  # default
    )
    # textarea element (not usually a form to expose to users due to bad UX)
    json = forms.JSONField()  # can support custom decoders/encoders
    # text input with validators from each field type (seems redundant???)
    combo = forms.ComboField(
        fields=(forms.CharField(max_length=20), forms.EmailField())
    )
    # multi-value fields must be subclassed and can be used to combine multiple fields into one via
    # the 'compress' function in the subclass (makes dealing with interdependent fields easier)
    # - (NOTE: can be annoying to render because labels must be extracted manually since they won't
    #   be rendered by default)
    multi_value = PhoneField()
    # date then a time field combined as a MultiValueField
    splite_date_time = forms.SplitDateTimeField()
    # example of widget customizations
    phone_keyboard = forms.RegexField(
        regex=r"\+?\d{10}",
        # 'id' defaults to 'id_<name>' but can be overridden if needed
        widget=forms.TextInput(attrs={"type": "tel", "id": "my_special_id"}),
    )
    # related fields (rendering behavior can be customized via forms.ModelForm.Meta.widgets)
    model_choide = forms.ModelChoiceField(
        queryset=SimpleModel.objects.all(),
        label="not recommended for anything other than models with small, defined datasets if using default widget since it is a select",
    )
    multiple_model_choice = forms.ModelMultipleChoiceField(
        queryset=SimpleModel.objects.all(),
        label="same as above but for multiple choices",
    )
    # can subclass forms.Field for more customization
    multi_emails = MultiEmailField()

    def clean_multi_emails(self):
        data = self.cleaned_data["multi_emails"]
        if "fred@example.com" not in data:
            raise forms.ValidationError("You have forgotten about Fred!")
        # Always return a value to use as the new cleaned data, even if unchanged
        return data

    # Good ValidationError practices:
    # 1. Use the 'code' argument to provide a unique identifier for the error
    # 2. Use the 'params' argument to provide context for the error message
    # 3. Use mapping keys to avoid positional / omission argument accidents
    # 4. Wrap the message with 'gettext' (shortcut is '_') to enable translation:
    #    'ValidationError(_("Invalid value"))'

    def clean(self):
        cleaned_data = super().clean()
        if cleaned_data.get("email") and cleaned_data.get(
            "email"
        ) not in cleaned_data.get("multi_emails", []):
            # adding error to a specific field instead to make error clearer (validation fails if
            # any errors are present, so we don't also need to raise the error)
            self.add_error(
                "multi_emails",
                forms.ValidationError("Email must be in the multi email list"),
            )
        return cleaned_data


# comment out lines to have the field show in the list
class RestrictableExampleForm(ExampleForm):
    example = None
    boolean = None
    char = None
    regex = None
    choice = None
    multiple_choice = None
    typed_choice = None
    typed_multiple_choice = None
    date = None
    time = None
    integer = None
    floatField = None
    decimal = None
    duration = None
    email = None
    ip = None
    slug = None
    url = None
    uuid = None
    file = None
    image = None
    filePath = None
    json = None
    combo = None
    # multi_value = None
    splite_date_time = None
    phone_keyboard = None
    model_choide = None
    multiple_model_choice = None
    multi_emails = None


# ModelForms map directly from models, providing the expected mapping of field to form field, and
# can be customized via the inner Meta class
#
# Validation of a ModelForm:
# 1. ModelForm is validated as a form
# 2. Model instance validate's itself using the form-validated values (ONLY valid values will have
#    been set on the model instance - following the first-error found rule per field; note there is
#    no risk if the model erroneously passes validation with only partially updated data because
#    validation will still fail due to the form errors)
#   - (NOTE: a failed model validation can result in an invalid model instance, so DO NOT REUSE the
#     same model instance used to construct the form, if one was used)
#
# Model forms can be saved via the 'save()' method, like models. Calling 'save()' automatically
# performs validation.
# - ModelForm(request.POST).save() creates a new record in the DB
# - ModelForm(request.POST, instance=model_instance).save() will update an existing record
class ConcreteOfAbstractModelForm(forms.ModelForm):
    # ModelForm will only create form fields for model fields that are NOT ALREADY DEFINED on the
    # form. Therefore, this field will:
    # - NOT be populated from the model instance
    # - NOT use data from the model field for the field rendering (max_length, required, etc.)
    # - NOT retain any behavior defined in the Meta for the model field of the same name
    #
    # The field WILL be validated and saved to the model (if it matches a model field name), but due
    # to these complications, it is generally riskier to override fields like this.
    field3 = forms.DateTimeField()

    # Meta inner class only used for ModelForms, not normal forms 
    class Meta:
        model = ConcreteOfAbstractModel
        # do NOT use "__all__" or 'exclude' instead of listing fields explicitly since it IS a
        # security risk ('exclude' can be useful for subclassing your own model forms though)
        #
        # (NOTE: any non-editable field will throw an error if included)
        fields = [
            "field",
            "field2",
            "field3",
            "foreign_key_field",
            "self_friends",
        ]
        # customize the model field to form field widget mapping (can use
        # 'field_classes'/'formfield_callback' to customize the Field object itself if desired)
        widgets = {"field": forms.Textarea(attrs={"cols": 80, "rows": 20})}
        # can also customize 'labels', 'help_texts', and 'error_messages' if you want to override
        # those set on the model/model Meta themselves (perhaps for translation purposes or less
        # technical language)

        # fields are not localized (dates, numbers, etc.), so usually recommended to set this
        localized_fields = "__all__"

        # recommend NOT using 'initial' since unlike normal forms it overrides values in BOUND
        # forms, and instead either pass values to the form constructor depending on absence from
        # the model instance or (RECOMMENDED) set the values on the constructed form if missing

    @override
    def clean(self) -> dict[str, Any]:
        # can access self.instance here to get the model instance with the validated form values set
        return super().clean()

# ModelForms can be extended for restricted/extra fields by extending the Meta inner class
class RestrictedConcreteOfAbstractModelForm(ConcreteOfAbstractModelForm):
    class Meta(ConcreteOfAbstractModelForm.Meta):
        exclude = ["field"] 

# simple model form classes can be created using modelform_factory()
FactorySimpleModelForm = forms.modelform_factory(SimpleModel, fields="__all__")