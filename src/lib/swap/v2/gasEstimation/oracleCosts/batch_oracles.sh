#!/bin/bash

# Path to your JSON file
JSON_FILE="oracles.json"
OUTPUT_FILE="oracles_updated.json"
# Check if the output file already exists
if [ -f "$JSON_FILE" ]; then
    # Load existing data from the output file
    existing_data=$(jq '.' $JSON_FILE)
else
    # Initialize existing data as an empty object
    existing_data='{}'
fi

# Ensure jq is installed to parse JSON
if ! command -v jq &> /dev/null; then
    echo "jq is required. Please install it."
    exit 1
fi
# Ensure bc is installed
if ! command -v bc &> /dev/null; then
    echo "bc is required. Please install it."
    exit 1
fi
echo "Starting..."
# Iterate over the keys in the JSON file
jq -r 'to_entries[] | .key, .value' $JSON_FILE | while read -r key; read -r value; do
    if [[ "$value" =~ ^[0-9]+$ ]] && [ "$value" -lt 1000 ]; then
        # Execute the script with the current key and capture the gas_used
        gas_used=$(./oracle.sh "$key" </dev/null)
        if [ -n "$gas_used" ] && [[ "$gas_used" =~ ^[0-9]+$ ]]; then
            # Calculate the new gas_used with 10% increase and round to nearest integer

            # shellcheck disable=SC2046
            # no need for quoting $(echo..) to prevent word splitting, since it is one number and no spaces
            new_gas_used=$(printf "%.0f" $(echo "$gas_used * 1.1" | bc -l))
            # Output key and gas_used
            jq -n --arg key "$key" --arg value $new_gas_used '{$key: $value | tonumber}'
        else
            # Output the result if not parsed correctly as a number
            jq -n --arg key "$key" --arg value $gas_used '{$key: $value | tonumber}'
        fi
    else
        # If the key is skipped, use the existing value (if available) or null
        existing_value=$(echo "$existing_data" | jq -r ".\"$key\"")
        if [ -n "$existing_value" ] && [ "$existing_value" != "null" ]; then
            jq -n --arg key "$key" --arg value $existing_value '{$key: $value | tonumber }'
        else
            jq -n --arg key "$key" '{$key: -1}'
        fi
    fi
done | jq -s 'add' > $OUTPUT_FILE
