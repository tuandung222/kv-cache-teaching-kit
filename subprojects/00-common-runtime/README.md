# 00 Common Runtime

## Objective

Build the smallest reusable runtime that every later subproject can share.

## What to implement

- a minimal `Cache` interface
- a `DynamicCache` that appends per layer
- a single causal self-attention block
- a two-path decoder:
  - full recomputation
  - iterative decode with cache
- a benchmark harness

## Minimal tensor contract

Assume:

- keys: `[batch, heads, seq, head_dim]`
- values: `[batch, heads, seq, head_dim]`
- queries: `[batch, heads, query_seq, head_dim]`

## Deliverables

- `src/cache.py`: base cache and dynamic append cache
- `src/decode.py`: `prefill` and `decode_step`
- `tests/test_cache_equivalence.py`
- `experiments/benchmark.py`

## Required tests

- cached decode logits equal uncached logits
- `get_seq_length` grows correctly
- appending one token updates the last sequence slot only

## Exit criteria

You can explain exactly which computation is removed by the cache and show it numerically.
