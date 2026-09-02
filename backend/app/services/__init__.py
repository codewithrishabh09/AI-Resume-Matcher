try:
    from . import matching_service
except ImportError:
    pass

__all__ = ["matching_service"]