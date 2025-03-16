#!/bin/bash

curl -X POST https://graph.facebook.com/v22.0/312046999514384/events \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
        {
            "event_name": "submit_form",
            "event_time": '"$(date +%s)"',
            "event_source_url": "http://jcvotes.eastus2.cloudapp.azure.com:3000/find-voter",
            "action_source": "website",
            "user_data": {
                "em": "testemail@example.com",
                "ph": "1234567890",
                "fn": "John",
                "ln": "Doe",
                "address": "123 Main St",
                "zip": "12345"
            }
        }
    ],
    "access_token": "527052447076598|RbAiHTuIEfu0WzHb3H6M39oAIbs"
}'

