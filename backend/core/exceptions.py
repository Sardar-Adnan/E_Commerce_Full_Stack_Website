"""
Custom DRF exception handler.

Ensures every error response returned by the API has a consistent, predictable
shape for the frontend to consume:

{
    "success": false,
    "message": "Human readable summary",
    "errors": { ... field level errors or details ... }
}
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from django.core.exceptions import PermissionDenied
from rest_framework.exceptions import APIException


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        error_payload = {
            "success": False,
            "message": _extract_message(exc, response),
            "errors": response.data,
        }
        response.data = error_payload
        return response

    # Handle exceptions DRF didn't catch (unexpected 500s) gracefully
    if isinstance(exc, Http404):
        return Response(
            {"success": False, "message": "Not found.", "errors": {}},
            status=status.HTTP_404_NOT_FOUND,
        )
    if isinstance(exc, PermissionDenied):
        return Response(
            {"success": False, "message": "Permission denied.", "errors": {}},
            status=status.HTTP_403_FORBIDDEN,
        )

    return None


def _extract_message(exc, response):
    if isinstance(exc, APIException):
        detail = exc.detail
        if isinstance(detail, str):
            return detail
        if isinstance(detail, dict) and "detail" in detail:
            return str(detail["detail"])
    if response.status_code == 400:
        return "Validation error. Please check the submitted data."
    if response.status_code == 401:
        return "Authentication credentials were not provided or are invalid."
    if response.status_code == 403:
        return "You do not have permission to perform this action."
    if response.status_code == 404:
        return "The requested resource was not found."
    return "An error occurred while processing your request."
