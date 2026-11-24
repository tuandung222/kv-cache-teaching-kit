# 01 GPT Decoder-Only with Absolute Positions

## Why this subproject exists

This is the simplest architecture where KV Cache feels natural.

## Architecture target

- decoder-only transformer
- causal mask
- learned absolute positional embeddings
- standard MHA

## What changes relative to `00-common-runtime`

- add token embedding plus learned positional embedding
- derive `position_ids` from `past_seen_tokens`
- support multi-layer cache

## Cache semantics

- cache only self-attention K/V
- cache grows by one position per decode step
- positional index for the new token equals current cache length before append

## Implementation tasks

1. Build a small GPT-style block with MHA and MLP.
2. Add `position_ids = arange(past_len, past_len + seq_len)`.
3. Implement `forward_prefill`.
4. Implement `forward_decode_step` that consumes only the newest token.
5. Verify parity against full recomputation.

## Common mistakes

- off-by-one in `position_ids`
- feeding the full prefix again during decode
- concatenating cache on the wrong axis

## Exit criteria

You can reproduce GPT-style autoregressive decoding with cache and explain why absolute positions make the cache logic straightforward.
