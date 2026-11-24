# 03 BART and mBART Encoder-Decoder Cache

## Why this subproject exists

This subproject forces you to separate decoder self-attention cache from cross-attention cache.

## Architecture target

- encoder-decoder transformer
- learned positional embeddings
- decoder self-attention plus decoder cross-attention

## Core insight

There are two distinct cache stories:

- decoder self-attention cache grows with generated tokens
- decoder cross-attention cache is derived from encoder states and is usually reusable after the first decode step

## What to implement

- encoder forward pass
- decoder self-attention cache
- decoder cross-attention cache
- an `EncoderDecoderCache` wrapper holding both

## Implementation tasks

1. Implement encoder once per source sequence.
2. Implement decoder self-attention cache updates per step.
3. Implement cross-attention K/V creation from encoder states.
4. Reuse cross-attention cache after first population.
5. Add tests proving cross-attention K/V does not keep growing with target length.

## Required tests

- decoder self-attention cache length increases with generated sequence
- cross-attention cache length tracks source length, not generated length
- cached and uncached logits match

## Common mistakes

- mixing source length and target length
- appending cross-attention states every decode step
- forgetting that encoder output is fixed during generation

## Exit criteria

You can explain why encoder-decoder KV Cache is structurally different from decoder-only KV Cache.
