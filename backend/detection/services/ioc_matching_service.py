from detection.models import IOC, IOCType


class IOCMatchingService:
    """
    Service responsible for matching security-event
    indicators against active Indicators of Compromise.
    """

    @staticmethod
    def normalize_value(value):
        """
        Normalize an IOC value before matching.
        """

        if value is None:
            return None

        return str(value).strip()

    @classmethod
    def match(cls, value, ioc_type):
        """
        Match a single value against the IOC database.

        Returns the matched IOC object or None.
        """

        normalized_value = cls.normalize_value(value)

        if not normalized_value:
            return None

        if ioc_type not in IOCType.values:
            return None

        return (
            IOC.objects.filter(
                value__iexact=normalized_value,
                ioc_type=ioc_type,
                is_active=True,
            )
            .first()
        )

    @classmethod
    def match_event(cls, event):
        """
        Match supported IOC fields from a security event.

        Expected event example:

        {
            "ip_address": "185.220.101.1",
            "domain": "example.com",
            "url": "https://example.com/file",
            "file_hash": "abc123..."
        }
        """

        if not isinstance(event, dict):
            return []

        field_mapping = {
            "ip_address": IOCType.IP_ADDRESS,
            "domain": IOCType.DOMAIN,
            "url": IOCType.URL,
            "file_hash": IOCType.FILE_HASH,
        }

        matches = []

        for field_name, ioc_type in field_mapping.items():
            value = event.get(field_name)

            if not value:
                continue

            matched_ioc = cls.match(
                value=value,
                ioc_type=ioc_type,
            )

            if matched_ioc:
                matches.append(
                    {
                        "field": field_name,
                        "value": value,
                        "ioc": matched_ioc,
                    }
                )

        return matches