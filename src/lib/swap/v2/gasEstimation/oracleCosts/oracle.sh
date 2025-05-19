#!/bin/bash
### Update these before running batch_queries.sh
WALLET_KEY="secret-wallet-key" # your wallet key for secretcli
SECRET_CLI="secretcli" # supports alias
###
# Ensure key is provided
if [ -z "$1" ]; then
    echo "Key argument is required"
    exit 1
fi
KEY=$1
MOCK_ORACLE_CA="secret18w3j29n2wk3czydssnhadmy3wmstxqa6pas90k" # mock contract supporting test_oracle execute
ORACLE_CA="secret10n2xl5jmez6r9umtdrth78k0vwmce0l5m9f5dm" # oracle for mainnet
ORACLE_CODE_HASH="32c4710842b97a526c243a68511b15f58d6e72a388af38a7221ff3244c754e91" # oracle for mainnet
GAS_LIMIT="500000" # you should increase it if oracle calls keep failing - this value is comfortably over the most expensive so far (SILK) oracle queery

HASH=$($SECRET_CLI tx compute execute $MOCK_ORACLE_CA '{"test_oracle": {
 "oracle": {
   "address": "'$ORACLE_CA'",
   "code_hash": "'$ORACLE_CODE_HASH'"

}, "key": "'$KEY'"    }}' --from "$WALLET_KEY" --gas $GAS_LIMIT --gas-prices "0.05uscrt" -y | jq -r '.txhash')
# plenty of time for tx to be executed
sleep 12
$SECRET_CLI q tx $HASH | jq -r '.gas_used'
