# 02 LLaMA-Style Decoder with GQA and RoPE

## Why this subproject exists

This is where cache implementation becomes materially different from the naive GPT story.

## Architecture target

- decoder-only transformer
- RoPE position encoding
- GQA or MQA
- causal mask

## New concepts

- `num_attention_heads != num_key_value_heads`
- cache stores KV heads, not repeated query heads
- rotary position handling must remain consistent across prefill and decode

## Cache semantics

- cache K/V before any `repeat_kv(...)`
- stored shape should use `num_kv_heads`
- attention-time expansion should happen after cache read

## Implementation tasks

1. Add RoPE application to Q and K.
2. Split query heads from KV heads.
3. Store only KV heads in the cache.
4. Add `repeat_kv(...)` or grouped expansion at attention time.
5. Measure memory difference between MHA and GQA.

## Required experiments

- compare cache bytes for MHA vs GQA under same model width
- verify parity between full recomputation and cached decode
- inspect how RoPE indices depend on `cache_position`

## Common mistakes

- caching repeated KV instead of original KV heads
- applying RoPE with the wrong decode index
- assuming cache footprint scales with attention heads instead of KV heads

## Exit criteria

You can explain why GQA is both an architectural and serving decision.
