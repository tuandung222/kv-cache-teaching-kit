# 04 T5 with Relative Position Bias

## Why this subproject exists

T5 is the best architecture for learning that cache correctness depends on positional semantics, not only tensor storage.

## Architecture target

- encoder-decoder transformer
- relative position bias
- decoder self-attention plus decoder cross-attention

## New concepts

- query length and key length matter directly to attention bias
- `cache_position` is used for positional reasoning, not only indexing
- cached decode must preserve the same relative bias as full recomputation

## What to implement

- T5-style relative position bucket computation
- self-attention cache
- cross-attention cache
- bias computation aware of query and key lengths

## Implementation tasks

1. Implement bucketed relative position bias.
2. Verify full-sequence bias construction.
3. Derive decode-step bias from `cache_position`.
4. Reuse cross-attention K/V after first construction.
5. Compare cached and uncached logits carefully.

## Required tests

- attention bias shape matches expected query and key lengths
- cached decode equals uncached decode
- wrong `cache_position` causes a detectable mismatch

## Common mistakes

- treating T5 like GPT with a different embedding layer
- building relative bias with local token index instead of global decode position
- reusing bias tensors incorrectly across incompatible lengths

## Exit criteria

You can explain why T5 is harder than GPT or BART from a KV Cache correctness perspective.
