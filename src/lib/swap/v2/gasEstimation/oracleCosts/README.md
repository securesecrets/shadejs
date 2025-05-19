### ORACLE QUERY COST ###
The cost for querying an oracle is essential part of estimating the gas cost of stable swaps.
Each stable swap queries both tokens so we use the real query cost by the mock oracle contract execute to check how much gas is each key.

## To automatically update the oracles.json ##
Requirements:
```
jq, bc linux packages
```
Check `oracles.sh` and set secretcli and wallet_key variables
Add the oracle key to `oracles.json` with value of 0
Run `batch_oracles.sh`
The script will go one by one through each key that doesn't have a value and produce `oracles_updated.json`.
Manually replace the content of `oracles.json` which is used by the app.
